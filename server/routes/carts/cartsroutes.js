const express = require("express");
const router = new express.Router();
const cartsControllers = require("../../controllers/carts/cartsControllers")
const userauthenticate = require("../../middleware/user/userauthenticate")
// carts routs
router.post("/addtocart/:id",userauthenticate,cartsControllers.AddtoCart);
router.get("/getcarts",userauthenticate,cartsControllers.getCartsvalue);




module.exports = router;