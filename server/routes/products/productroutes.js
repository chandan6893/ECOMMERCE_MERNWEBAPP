const express = require("express");
const router = new express.Router();
const adminauthenticate = require("../../middleware/admin/adminauthenticate");
const productController = require("../../controllers/product/productController");
const productupload = require("../../multerconfig/products/productStorageConfig")
const userAuthenticate = require("../../middleware/user/userauthenticate");

// product category routes
router.post("/addcategory",adminauthenticate,productController.AddCategory);
router.get("/getcategory",productController.GetCategory);

// products routes
router.post("/addProducts",[adminauthenticate,productupload.single("productimage")],productController.AddProducts)
router.get("/getProducts",productController.getAllProducts);
router.get("/getsingleProduct/:productid",productController.getSingleProduct);
router.delete("/products/:productid",adminauthenticate,productController.DeleteProducts);

// new arrivals products
router.get("/getLatestProducts",productController.getLatestProducts);

// product review api
router.post("/productreview/:productid",userAuthenticate,productController.productreview);




module.exports = router;

