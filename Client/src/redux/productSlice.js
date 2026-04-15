import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import productService from '../services/productService'

export const fetchProducts = createAsyncThunk('products/fetchAll', async () => {
  return await productService.getProducts()
})

export const fetchProductById = createAsyncThunk('products/fetchById', async (id) => {
  return await productService.getProductById(id)
})

export const createProduct = createAsyncThunk('products/create', async (productData, { getState }) => {
  const { user } = getState()
  return await productService.createProduct(productData, user.userInfo.token)
})

export const updateProduct = createAsyncThunk('products/update', async ({ id, productData }, { getState }) => {
  const { user } = getState()
  return await productService.updateProduct(id, productData, user.userInfo.token)
})

export const deleteProduct = createAsyncThunk('products/delete', async (id, { getState }) => {
  const { user } = getState()
  await productService.deleteProduct(id, user.userInfo.token)
  return id
})

const productSlice = createSlice({
  name: 'products',
  initialState: { items: [], currentProduct: null, loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchProducts
      .addCase(fetchProducts.pending, (state) => { state.loading = true })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
      // fetchProductById
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true
        state.currentProduct = null
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false
        state.currentProduct = action.payload
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
      // createProduct
      .addCase(createProduct.fulfilled, (state, action) => {
        state.items.push(action.payload)
      })
      // updateProduct
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.items.findIndex(p => p._id === action.payload._id)
        if (index !== -1) state.items[index] = action.payload
      })
      // deleteProduct
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.items = state.items.filter(p => p._id !== action.payload)
      })
  }
})

export default productSlice.reducer