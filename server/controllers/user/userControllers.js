const cloudinary = require("../../Cloudinary/cloudinary")
const userDB = require("../../model/user/userModel")
const bcrypt = require("bcryptjs") ;
const jwt = require("jsonwebtoken");
const SECRET_KEY = "hagadhgadgadfgasghsahgghcasgclaksf";
const path = require("path");
const fs = require("fs");
const ejs = require("ejs");
const {transporter} = require("../../helper");
const { verify } = require("crypto");
// register
exports.userRegister= async(req,res)=>{
    // console.log(req.body);
    // console.log(req.file);
    const { firstname, lastname, email, password, confirmpassword } = req.body;

    if(!firstname || !lastname || !email  || !password || !confirmpassword || !req.file){
        res.status(400).json({error:"all fields are required"})
    }

    const file = req.file?.path;

    const upload = await cloudinary.uploader.upload(file);

    try {
        const preuser = await userDB.findOne({email:email});
        if(preuser){
            res.status(400).json({error:"this user is already exist"}) ;
        }else if(password !== confirmpassword){
            res.status(400).json({error:"password and confirm password not match"})
        }else{
            const userData = new userDB({
                firstname, lastname, email, password, userprofile:upload.secure_url
            });
            // password hassing
            await userData.save();
            res.status(200).json(userData); 
        }
    } catch (error) {
        res.status(400).json(error)
    }
}

// login
exports.login = async (req, res) => {
    const { email, password } = req.body;
    if(!email || !password){
        res.status(400).json({error:"all field require"});
    }

    try {
        const userValid = await userDB.findOne({email:email});
        if(userValid){
            const isMatch = await bcrypt.compare(password,userValid.password);
            if(!isMatch){
                res.status(400).json({error:"Invalid Details"});
            }else{
                // token generate
                const token = await userValid.generateuserAuthToken();

                const result = {
                    userValid,
                    token
                }
                res.status(200).json(result);
            }
        }else{
            res.status(400).json({error:"Invalid Details"})
        }
    } catch (error) {
        res.status(400).json(error)
    }
}

// user verify

exports.userverify = async(req,res)=>{
    try{
        const verifyUser = await userDB.findOne({_id:req.userId});
        res.status(200).json(verifyUser);
    }catch(error){
        res.status(400).json(error);
    }
}

// logout

exports.logout = async(req,res)=>{
    try {
        req.rootUser.tokens = req.rootUser.tokens.filter((currentElement)=>{
            return currentElement.token !== req.token
        });
        req.rootUser.save();
        res.status(200).json({mesage:"user Successfully Logout"});
    } catch (error) {
        res.status(400).json(error);
    }
}

// forgot password
exports.forgotpassword = async(req,res)=>{
    const {email} = req.body;
    if(!email){
        res.status(400).json({error:"enter your email"});
    }
    try {
        const userfind = await userDB.findOne({email:email});
        
        if(userfind){
            const token  = jwt.sign({_id:userfind._id},SECRET_KEY,{
                expiresIn:"120s"
            });
            const setusertoken = await userDB.findByIdAndUpdate({_id:userfind._id},{verifytoken:token},{new:true});
            
            // join email path
            const emailTemplatepath = path.join(__dirname,"../../EmailTemplate/ForgotTemplate.ejs");
            const emailtemplateread = fs.readFileSync(emailTemplatepath,"utf8");
            
            // Set token and logo value in ejs file
            const data = {
                passwordresetlink:`http://localhost:3001/resetpassword/${userfind.id}/${setusertoken.verifytoken}`,
                logo:"https://cdn-icons-png.flaticon.com/128/732/732200.png"
            }

            // set dynamic datavalue in ejs 
            const renderTemplate = ejs.render(emailtemplateread,data);

            if(setusertoken){
                const mailOptions = {
                    from:"krc6893@gmail.com",
                    to:email,
                    subject:"Sending Email For Password Reset",
                    html:renderTemplate
                }
                transporter.sendMail(mailOptions,(error,info)=>{
                    if(error){
                        console.log("error",error)
                        res.status(400).json({error:"email not sednd"})
                    }else{
                        console.log("email sent",info.response)
                        res.status(200).json({message:"Email sent Sucessfully"})
                    }
                })
            }
        }else{
            res.status(400).json({error:"This user does not exist."})
        }
    } catch (error) {
        res.status(400).json(error);
    }
}

exports.forgotpasswordverify = async(req,res)=>{
    const { id, token } = req.params;

    try {
        const validuser = await userDB.findOne({_id:id,verifytoken:token});
        const verifytoken = jwt.verify(token,SECRET_KEY);

        if(validuser && verifytoken._id){
            res.status(200).json({message:"Valid user"});
        }else{
            res.status(400).json({error:"user not exist"})
        }
     
    } catch (error) {
        res.status(400).json(error);
    }
}

// reset password

exports.resetpassword = async(req,res)=>{
    const {id,token} = req.params;
    const {password} = req.body;

    try {
        const validuser = await userDB.findOne({_id:id,verifytoken:token});
        const verifytoken = jwt.verify(token,SECRET_KEY);

        if(validuser && verifytoken._id){
            const newpassword = await bcrypt.hash(password,12);
            const setnewpassword = await userDB.findByIdAndUpdate({_id:id},{password:newpassword},{new:true})
            await setnewpassword.save();
            res.status(200).json({message:"Password sucessfully updated"});
        }else{
            res.status(400).json({error:"your session timed out, please generate newlink"})
        }
    } catch (error) {
        res.status(400).json(error);
    }
}

// getAlluser
exports.getAlluser = async(req,res)=>{
    const page = req.query.page || 1;
    const ITEM_PER_PAGE = 4;

    try{
     const skip = (page - 1) * ITEM_PER_PAGE;
     const count = await userDB.countDocuments();
     const pageCount = Math.ceil(count/ITEM_PER_PAGE);

     const usersdata = await userDB.find()
        .limit(ITEM_PER_PAGE)
        .skip(skip)
        .sort({_id:-1});

        res.status(200).json({
            Pagination:{
                count,pageCount
            },
            usersdata
        })
    }catch(error){
        res.status.json(error);
    }
}