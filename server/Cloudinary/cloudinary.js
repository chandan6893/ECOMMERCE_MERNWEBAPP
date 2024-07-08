const cloudinary = require("cloudinary").v2;

cloudinary.config({
    cloud_name:"dvcj7uooq",
    api_key:"462128821211869",
    api_secret:"IilfgBP7hRi-hc5m7KDYUaU_RFU"
});

module.exports = cloudinary;