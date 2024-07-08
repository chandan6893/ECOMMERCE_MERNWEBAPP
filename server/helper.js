// ljyffiymgrhswgix
const nodemailer = require("nodemailer");

// email config
exports.transporter = nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:"krc6893@gmail.com",
        pass:"ljyffiymgrhswgix"
    }
});
