const adminDB = require( "../../model/admin/adminModel" );
const jwt = require("jsonwebtoken");
const SECRET_KEY = "test01ojidjijfisjfdsofkskdokifiwinnb";

const adminauthenticate =  async(req,res,next)=>{
    try {
        const token = req.headers.authorization;
        if (!token) {
            throw new Error("Unauthorized No token Provided");
        }
        const verifyToken = jwt.verify(token, SECRET_KEY);

        const rootUser = await adminDB.findOne({ _id: verifyToken._id });

        if (!rootUser){
            throw new Error("User not found");
        }

        req.token = token;
        req.rootUser = rootUser;
        req.userId = rootUser._id;

        next();
    } catch (error) {
        res.status(400).json({error:"Unauthorized No token Provide"});
    }
} 

module.exports = adminauthenticate;