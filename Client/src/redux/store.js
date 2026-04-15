import { configureStore } from '@reduxjs/toolkit'
import userReducer from './userSlice'
import productReducer from './productSlice'
import cartReducer from './cartSlice'
import couponReducer from './couponSlice'
import categoryReducer from './categorySlice'
import wishlistReducer from './wishlistSlice'

const store = configureStore({
  reducer: {
    user: userReducer,
    products: productReducer,
    cart: cartReducer,
    coupon: couponReducer,
    categories: categoryReducer,
    wishlist: wishlistReducer,
  },
})

export default store