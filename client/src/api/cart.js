import { createContext,useState,useContext }  from "react";

const CartContext= createContext();

export const CartProvider = ({children})=>{
    const [cart,setCart]  =  useState([]);

    const addToCart = (book) =>{
        setCart([...cart,book]);
    }

    const removeFromCart = (id)=>{
        setCart(cart.filter((item)=> item.id !== id));
    }

    const value = {
        cart,
        addToCart,
        removeFromCart
    }

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    )
}


export const useCart = ()=> useContext(CartContext);