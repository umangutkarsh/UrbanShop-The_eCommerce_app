import { createSlice } from "@reduxjs/toolkit";
import { updateCart } from "../utils/cartUtils";

const initialState = localStorage.getItem("cart") ? JSON.parse(
   localStorage.getItem("cart")
) : { cartItems: [], shippingAddress: {}, paymentMethod: 'PayPal' };


const cartSlice = createSlice({
   name: "cart",
   initialState,
   reducers: {
      addToCart: (state, action) => {

         const item = action.payload;
         const existItem = state.cartItems.find(currItem => currItem._id === item._id);

         if (existItem) {
            state.cartItems = state.cartItems.map(currItem => 
               currItem._id === existItem._id ? item : currItem
            );
         }

         else {
            state.cartItems = [...state.cartItems, item];
         }
         
         return updateCart(state);
      },
      removeFromCart: (state, action) => {

         const itemToRemove = action.payload;
         state.cartItems = state.cartItems.filter(item => item._id !== itemToRemove);

         return updateCart(state);
      },
      saveShippingAddress: (state, action) => {

         state.shippingAddress = action.payload;
         return updateCart(state);
      },
      savePaymentMethod: (state, action) => {

         state.paymentMethod = action.payload;
         return updateCart(state);
      },
      clearCart: (state, action) => {

         state.cartItems = [];
         return updateCart(state);
      },
      resetCart: (state) => (state = initialState)
   }
});

export const { 
   addToCart, 
   removeFromCart, 
   saveShippingAddress, 
   savePaymentMethod, 
   clearCart,
   resetCart
} = cartSlice.actions;

export default cartSlice.reducer;