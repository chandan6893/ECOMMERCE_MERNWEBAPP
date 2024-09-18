import React, { useEffect, useState } from 'react'
import ProductsPagemain from '../../components/ProductsPageMain/ProductsPagemain'
import Loader from '../../components/Loader/Loader';

const ProductsPage = () => {
  const [spin, setSpin] = useState(true);


  useEffect(() => {
    window.scrollTo(0, 0);
  }, [])
   
  useEffect(() => {
    setTimeout(() => {
      setSpin(false)
    }, 3000)
  }, [])
  return (
    <>
      {
        spin ? <Loader /> : <ProductsPagemain />
      }

    </>
  )
}

export default ProductsPage


// (1)==>HARSH MERN=>redux,cart,payInt,Admin etc
// (2)==>DSA AND JSON
// (3)==>MUI && BS
// (4)==>R19
// (5)==>Mini Challenges for JS && React
// (6)==>Iprep (MERN)
// (7)==>Communicaton
// (8)==>Typing

