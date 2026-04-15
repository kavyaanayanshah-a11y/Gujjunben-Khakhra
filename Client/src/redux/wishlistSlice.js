import { createSlice } from '@reduxjs/toolkit'

const loadWishlist = () => {
  const stored = localStorage.getItem('wishlist')
  return stored ? JSON.parse(stored) : []
}

const saveWishlist = (items) => {
  localStorage.setItem('wishlist', JSON.stringify(items))
}

const initialState = {
  items: loadWishlist(),
}

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    addToWishlist: (state, action) => {
      const product = action.payload
      const exists = state.items.find(item => item._id === product._id)
      if (!exists) {
        state.items.push(product)
        saveWishlist(state.items)
      }
    },
    removeFromWishlist: (state, action) => {
      const productId = action.payload
      state.items = state.items.filter(item => item._id !== productId)
      saveWishlist(state.items)
    },
    toggleWishlist: (state, action) => {
      const product = action.payload
      const exists = state.items.find(item => item._id === product._id)
      if (exists) {
        state.items = state.items.filter(item => item._id !== product._id)
      } else {
        state.items.push(product)
      }
      saveWishlist(state.items)
    },
    clearWishlist: (state) => {
      state.items = []
      saveWishlist([])
    },
  },
})

export const { addToWishlist, removeFromWishlist, toggleWishlist, clearWishlist } = wishlistSlice.actions
export default wishlistSlice.reducer