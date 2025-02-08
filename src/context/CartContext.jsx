import { createContext, useReducer } from "react"
import { useContext } from "react";
import { cartReducer } from "../reducer/cartReducer";

//createContext() is a React function that creates the context. 
// It takes a default value (initialState here) which will be used if no Provider is found above a component that needs this context.
const initalState ={
    cartList: [],
    total:0
}

const CartContext = createContext(initalState);

//create cart provider
//CartProvider is a component that will wrap other components to provide access to the context.

// CartContext.Provider: This is the special React component that shares the context value (value) with all child components.
// value={value}: This value is the data you want to share across components. 
// Right now, it's just { total: 0 }. But in a fully functional cart, it would include the cart items (cartList) and 
// the total price (total).
// children: This represents any components that are nested inside CartProvider. 
// These child components will have access to the context data.

export const CartProvider =({children})=>{
    const [state, disptach] = useReducer(cartReducer, initalState)
    
    const addToCart =(product) =>{
      const updatedCart=   state.cartList.concat(product)
      updateTotal(updatedCart);
      disptach({
        type: "ADD_TO_CART",
        payload:{
            products: updatedCart
        }
      })
    }  

    const removeFromCart =(product) =>{
        const updatedCart = state.cartList.filter(product1 => product1.id !==product.id);
        
        disptach({
            type:"REMOVE_FROM_CART",
            payload:{
                products: updatedCart
            }
        })
        updateTotal(updatedCart);
    }

    const updateTotal =(products) =>{
        let total =0;
        products.forEach(product=>total=total+product.price)
        disptach(
            {
                type:"UPDATE_TOTAL",
                payload:{
                    total
                }
            }
        )
    }

    const value ={
        cartList: state.cartList,
        total:state.total,
        addToCart,
        removeFromCart
    }

    return(
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    )
}

//useCart Hook
//This custom hook is a shortcut for accessing the context.
// useContext(CartContext): The useContext hook is how we consume the context in any child component. 
// It allows you to access the value provided by CartProvider.
// If you want to access the cart data (like total or cartList), 
// you can call useCart inside any component and it will give you access to that data.
// The hook returns the context value ({ total: 0 } right now). You can then use this data in your components.

export const useCart = ()=>{
    const context = useContext(CartContext)
    return context;
}
