const adminDB = require("../../model/admin/adminModel");
const cloudinary = require("../../Cloudinary/cloudinary");
const bcrypt = require("bcryptjs") ;

// register controller

exports.Register = async(req,res) =>{
    const { name, email, mobile, password, confirmpassword } = req.body;

    if(!name || !email || !mobile || !password || !confirmpassword || !req.file){
        res.status(400).json({error:"all fields are required"})
    }

    const file = req.file?.path;

    const upload = await cloudinary.uploader.upload(file);

    try {
        const preuser = await adminDB.findOne({email:email});
        const mobileverification = await adminDB.findOne({mobile:mobile});
        
        if(preuser){
            res.status(400).json({erroe:"this Admin is Already Exist"})
        }else if(mobileverification){
            res.status(400).json({erroe:"this Mobile is Already Exist"})
        }else if(password !==confirmpassword){
            res.status(400).json({erroe:"password and confirmpassword not match"})
        }else{
            const adminData = new adminDB({
                name,email,mobile,password,profile:upload.secure_url
            });

            await adminData.save();
            res.status(200).json(adminData);
        }
    } catch (error) {
        res.status(400).json(error);
    }

}

// login controller
exports.Login = async(req,res) =>{
    const { email, password } = req.body;
     
    if(!email || !password){
        res.status(400).json({error:"all fields required"})
    }
    try {
        const adminValid = await adminDB.findOne({email:email});
        
        if(adminValid){
            const isMatch = await bcrypt.compare(password,adminValid.password);
            if(!isMatch){
                res.status(400).json({error:"Invalid Details"})
            }else{
                //token generate 
                const token = await adminValid.generateAuthToken();
               
                const result = {
                    adminValid,
                    token
                }
                res.status(200).json(result);
            }
        }else{
            res.status(400).json({error:"Invaild Details"})
        }
    } catch (error) {
        res.status(400).json(error);
    }
}

// admin verify controller
exports.AdminVerify = async (req,res)=>{
    try {
        const VerifyAdmin = await adminDB.findOne({_id:req.userId});
        // console.log("first",VerifyAdmin )
        res.status(200).json(VerifyAdmin)
        
    } catch (error) {
        res.status(400).json({error:"invalid Details"})
    }
}

// admin Logout controller
exports.Logout = async(req,res)=>{
    try {
        req.rootUser.tokens  =  req.rootUser.tokens.filter((currentElement)=>{
            return currentElement.token !== req.token
        });
        req.rootUser.save();
        res.status(200).json({message:"admin successfully Logout"})
    } catch (error) {
        res.status(400).json(error); 
    }
}