const express = require("express");
const router = new express.Router();


const userUpload = require("../../multerconfig/user/userStorageConfig");
const userController = require("../../controllers/user/userControllers");
const userauthenticate = require("../../middleware/user/userauthenticate");

// user Auth Routes
router.post("/register",userUpload.single("userprofile"),userController.userRegister);
router.post("/login",userController.login);

router.get("/userloggedin",userauthenticate,userController.userverify); 
router.get("/logout",userauthenticate,userController.logout);
router.post("/forgotpassword",userController.forgotpassword);

// user verify for forgot password
router.get("/forgotpassword/:id/:token",userController.forgotpasswordverify);

router.put("/resetpassword/:id/:token",userController.resetpassword)

module.exports = router;