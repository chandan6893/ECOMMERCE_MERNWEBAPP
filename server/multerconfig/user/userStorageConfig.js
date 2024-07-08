const multer = require("multer");


// storage config
const storage = multer.diskStorage({
    destination:(req,file,callback)=>{
        callback(null,"./useruploads")
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


const userupload = multer({
    storage : storage,
    fileFilter : filefilter
});

module.exports = userupload;