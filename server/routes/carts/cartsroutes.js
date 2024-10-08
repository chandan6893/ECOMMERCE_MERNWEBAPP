const express = require("express");
const router = new express.Router();
const cartsControllers = require("../../controllers/carts/cartsControllers")
const userauthenticate = require("../../middleware/user/userauthenticate")
// carts routs
router.post("/addtocart/:id",userauthenticate,cartsControllers.AddtoCart);
router.get("/getcarts",userauthenticate,cartsControllers.getCartsValue);
router.delete("/removesingleitem/:id",userauthenticate,cartsControllers.removeSingleitm);
router.delete("/removeiteams/:id",userauthenticate,cartsControllers.removeAlliteam);
router.delete("/removecartdata",userauthenticate,cartsControllers.DeleteCartsData)




module.exports = router;