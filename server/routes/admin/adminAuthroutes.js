const express = require("express");
const router = express.Router();

const adminAuthcontrollr = require("../../controllers/admin/adminControllers");
const adminUpload = require("../../multerconfig/admin/adminStorageConfig");
const adminauthenticate = require("../../middleware/admin/adminauthenticate");

// admin auth routes
router.post("/register",adminUpload.single("admin_profile"),adminAuthcontrollr.Register);
router.post("/login",adminAuthcontrollr.Login);
router.get("/logout",adminauthenticate,adminAuthcontrollr.Logout);

// admin verify
router.get("/adminVerify",adminauthenticate,adminAuthcontrollr.AdminVerify);

module.exports = router;


