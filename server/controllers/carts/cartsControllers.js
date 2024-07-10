const productsdb  = require("../../model/product/ProductModel");
const cartsdb = require("../../model/carts/cartsModel");


exports.AddtoCart = async(req,res)=>{
   const {id} = req.params;
   console.log("re.params",req.params)

   try{
      const productfind = await productsdb.findOne({_id:id});
      // console.log("productfiind",productfind);
      const carts = await cartsdb.findOne({userid:req.userId, productid:productfind._id});
      // console.log("carts",carts);

      if(productfind?.quantity >= 1){

         if(carts?.quantity >= 1){
            // add to cart
            carts.quantity = carts.quantity + 1
            await carts.save();

            // decrement product quantity
            productfind.quantity = productfind.quantity - 1;
            await productfind.save();

            res.status(200).json({message:"Product Sucessfully Increment In your cart"})
         }else{
            const addtocart = new cartsdb({
               userid:req.userId,
               productid:productfind._id,
               quantity:1
            });
   
            await addtocart.save();

            productfind.quantity = productfind.quantity - 1;
            await productfind.save();

            res.status(200).json({message:"Product Successfully Added In your cart"});
         }

      }else{
         res.status(400).json({error:"This Product Is Sold Out"})
      }


   }catch(error){
    res.status(400).json(error);
   }
    // console.log("req.params",req.params)
}


// get carts value

exports.getCartsvalue = async(req,res)=>{
   
}