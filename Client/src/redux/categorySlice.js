import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import API from '../services/api'

export const fetchCategories = createAsyncThunk('categories/fetchAll', async () => {
  const { data } = await API.get('/categories')
  return data
})

export const createCategory = createAsyncThunk('categories/create', async (categoryData, { getState }) => {
  const { user } = getState()
  const { data } = await API.post('/categories', categoryData, {
    headers: { Authorization: `Bearer ${user.userInfo.token}` }
  })
  return data
})

export const updateCategory = createAsyncThunk('categories/update', async ({ id, categoryData }, { getState }) => {
  const { user } = getState()
  const { data } = await API.put(`/categories/${id}`, categoryData, {
    headers: { Authorization: `Bearer ${user.userInfo.token}` }
  })
  return data
})

export const deleteCategory = createAsyncThunk('categories/delete', async (id, { getState }) => {
  const { user } = getState()
  await API.delete(`/categories/${id}`, {
    headers: { Authorization: `Bearer ${user.userInfo.token}` }
  })
  return id
})

const categorySlice = createSlice({
  name: 'categories',
  initialState: { items: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => { state.loading = true })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.items.push(action.payload)
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        const index = state.items.findIndex(c => c._id === action.payload._id)
        if (index !== -1) state.items[index] = action.payload
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.items = state.items.filter(c => c._id !== action.payload)
      })
  }
})

export default categorySlice.reducer