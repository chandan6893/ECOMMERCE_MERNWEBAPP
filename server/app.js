require("dotenv").config();
const express = require("express");
const app = express();

require("./db/conn");




const cors = require("cors");
const port = 4009;

app.use(cors());
app.use(express.json());

// admin routes
const adminAuthroutes = require("./routes/admin/adminAuthroutes");
app.use("/adminauth/api",adminAuthroutes);

// productsroutes
const productroutes = require("./routes/products/productroutes");
app.use("/product/api",productroutes);

// user routs
const userAuthroutes = require("./routes/user/userAuthRoutes");
app.use("/userauth/api",userAuthroutes);

// carts routes
const cartsroutes = require("./routes/carts/cartsroutes");
app.use("/carts/api",cartsroutes)

app.get("/",(req,res)=>{
    res.status(200).json("sever is runing")
})
app.listen(port,()=>{
    console.log(`Server is runing at ${port}`);
})