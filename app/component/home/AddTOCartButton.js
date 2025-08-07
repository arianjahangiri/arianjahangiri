"use client"
import { useCart } from '@/app/context/cartContext';

import React, { useState } from 'react';
 

const AddTOCartButton = ({productId}) => {
    const {addToCart,error}=useCart();
    const [loading ,setLoading]=useState(false);
    const [localErrore,setlocalErrore]=useState(null) 
   const HandelAddToCart=async() => {
     setLoading(true)
     setlocalErrore(null)
     await addToCart(productId,1 )
     if (error){
        setlocalErrore(error) 
     }
     setLoading(false)
   };
    return (
        <div>
                <section className=" bg-danger">
                                        <button disabled={loading} onClick={HandelAddToCart} href="#" className="btn btn-danger d-block">{loading ? "درحال افزودن ...": "افزودن به سبد خرید"} </button>
                                        {localErrore&& <p className='text-danger text-lg m-9   '>{localErrore}</p>}
                                    </section>
        </div>
    );
};
 
export default AddTOCartButton;