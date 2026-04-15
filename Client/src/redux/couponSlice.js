import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import couponService from '../services/couponService'

export const applyCoupon = createAsyncThunk('coupon/apply', async ({ code, total }) => {
  return await couponService.validateCoupon(code, total)
})

const couponSlice = createSlice({
  name: 'coupon',
  initialState: { appliedCoupon: null, discount: 0, loading: false, error: null },
  reducers: {
    removeCoupon: (state) => {
      state.appliedCoupon = null
      state.discount = 0
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(applyCoupon.pending, (state) => { state.loading = true; state.error = null })
      .addCase(applyCoupon.fulfilled, (state, action) => {
        state.loading = false
        state.appliedCoupon = action.payload.code
        state.discount = action.payload.discount
      })
      .addCase(applyCoupon.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
  },
})

export const { removeCoupon } = couponSlice.actions
export default couponSlice.reducer