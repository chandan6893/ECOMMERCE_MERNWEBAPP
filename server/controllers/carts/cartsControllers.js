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


// getcartsvalue

exports.getCartsValue = async(req,res)=>{
   try {
      const getCarts = await cartsdb.aggregate([
         {
            $match:{userid:req.userMainId}
         },
         {
            $lookup:{
               from:"productsmodels",
               localField:"productid",
               foreignField:"_id",
               as:"productDetails"
            }
         }
      ]);
      res.status(200).json(getCarts)
   } catch (error) {
      res.status(400).json(error)
   }   
}

// removeSingleitm
exports.removeSingleitm = async(req,res)=>{
   const { id } = req.params;

   try{
      const productfind = await productsdb.findOne({_id:id});
      // console.log("productfiind",productfind);
      const carts = await cartsdb.findOne({userid:req.userId, productid:productfind._id});

      if(!carts){
         res.status(400).json({error:"cart item not found"});
      }
      // console.log("carts",carts)

      // increment product quantity
      if(carts.quantity == 1){
         const deleteCartItem = await cartsdb.findByIdAndDelete({_id:carts._id});

         productfind.quantity = productfind.quantity + 1;
         await productfind.save();

         res.status(200).json({message:"Your Item sucessfully removed from your cart",deleteCartItem});
      }else if(carts.quantity > 1){
         carts.quantity = carts.quantity - 1;
         await carts.save();

         // increment product quantity
         productfind.quantity = productfind.quantity + 1;
         await productfind.save();

         res.status(200).json({message:"your item sucessfully Deremented form your Cart"})
      }

   }catch(error){
      res.status(400).json(error);
   }
}


// removeAlliteam

exports.removeAlliteam = async(req,res)=>{
   const { id } = req.params;
    
   try{
      const productfind = await productsdb.findOne({_id:id});
      // console.log("productfiind",productfind);
      const carts = await cartsdb.findOne({userid:req.userId, productid:productfind._id});
       if(!carts){
         res.status(400).json({error:"cart item not found"})
       }

       const deleteCartItem  = await cartsdb.findByIdAndDelete({_id:carts._id});

      //  product increment
       productfind.quantity = productfind.quantity + carts.quantity;

       await productfind.save();

       res.status(200).json({message:"Your Item Sucessfully Removed From The Cart",deleteCartItem});
   }catch(error){
      res.status(400).json(error);
   }
}

// DeleteCartData
exports.DeleteCartsData = async(req,res)=>{
   try {
      const DeleteCarts = await cartsdb.deleteMany({userid:req.userId});
      res.status(200).json(DeleteCarts);
   } catch (error) {
      res.status(400).json(error);
   }
}