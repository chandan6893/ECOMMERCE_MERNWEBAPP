const express = require("express");
const router = new express.Router();
const adminauthenticate = require("../../middleware/admin/adminauthenticate");
const productController = require("../../controllers/product/productController")
const productupload = require("../../multerconfig/products/productStorageConfig")

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




module.exports = router;

