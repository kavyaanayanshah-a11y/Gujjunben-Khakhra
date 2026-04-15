import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import cartService from '../services/cartService';

// Async thunks
export const fetchCart = createAsyncThunk('cart/fetch', async (_, { rejectWithValue }) => {
  try {
    return await cartService.getCart();
  } catch (error) {
    return rejectWithValue(error.response?.data?.message);
  }
});

export const addToCartBackend = createAsyncThunk('cart/add', async (item, { rejectWithValue }) => {
  try {
    return await cartService.addToCart(item);
  } catch (error) {
    return rejectWithValue(error.response?.data?.message);
  }
});

export const updateQtyBackend = createAsyncThunk('cart/updateQty', async ({ productId, qty }, { rejectWithValue }) => {
  try {
    return await cartService.updateQty(productId, qty);
  } catch (error) {
    return rejectWithValue(error.response?.data?.message);
  }
});

export const removeFromCartBackend = createAsyncThunk('cart/remove', async (productId, { rejectWithValue }) => {
  try {
    return await cartService.removeFromCart(productId);
  } catch (error) {
    return rejectWithValue(error.response?.data?.message);
  }
});

export const clearCartBackend = createAsyncThunk('cart/clear', async (_, { rejectWithValue }) => {
  try {
    return await cartService.clearCart();
  } catch (error) {
    return rejectWithValue(error.response?.data?.message);
  }
});

const initialState = {
  cartItems: [],
  shippingAddress: localStorage.getItem('shippingAddress') ? JSON.parse(localStorage.getItem('shippingAddress')) : {},
  paymentMethod: localStorage.getItem('paymentMethod') || 'COD',
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Local optimistic updates (optional)
    localAddToCart: (state, action) => {
      const item = action.payload;
      const exist = state.cartItems.find(x => x.product === item.product);
      if (exist) exist.qty = item.qty;
      else state.cartItems.push(item);
    },
    localUpdateQty: (state, action) => {
      const { productId, qty } = action.payload;
      const item = state.cartItems.find(x => x.product === productId);
      if (item) item.qty = qty;
    },
    localRemoveFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter(x => x.product !== action.payload);
    },
    localClearCart: (state) => {
      state.cartItems = [];
    },
    // Shipping & payment (local storage only)
    saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
      localStorage.setItem('shippingAddress', JSON.stringify(action.payload));
    },
    savePaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
      localStorage.setItem('paymentMethod', action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.cartItems = action.payload.items || [];
      })
      .addCase(addToCartBackend.fulfilled, (state, action) => {
        state.cartItems = action.payload.items;
      })
      .addCase(updateQtyBackend.fulfilled, (state, action) => {
        state.cartItems = action.payload.items;
      })
      .addCase(removeFromCartBackend.fulfilled, (state, action) => {
        state.cartItems = action.payload.items;
      })
      .addCase(clearCartBackend.fulfilled, (state) => {
        state.cartItems = [];
      });
  },
});

export const { 
  localAddToCart, 
  localUpdateQty, 
  localRemoveFromCart, 
  localClearCart,
  saveShippingAddress,
  savePaymentMethod
} = cartSlice.actions;

export default cartSlice.reducer;