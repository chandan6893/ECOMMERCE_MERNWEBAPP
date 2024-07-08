const multer = require("multer");


// storage config
const storage = multer.diskStorage({
    destination:(req,file,callback)=>{
        callback(null,"./adminuploads")
    },
    filename:(req,file,callback)=>{
        const filename = `image-${Date.now()}.${file.originalname}`
        callback(null,filename)
    }
});

// filter image
const filefilter = ( req,file,callback ) =>{
    if(file.mimetype === "image/png"  || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg" || file.mimetype === "image/webp"){
        callback(null,true);
    }else{
        callback(null,false)
        return callback(new Error("Only png, jpg, jpeg, webp formattd Allow"))
    }
}


const upload = multer({
    storage : storage,
    fileFilter : filefilter
});

module.exports = upload;