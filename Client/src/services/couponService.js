import API from './api'

const couponService = {
  validateCoupon: (code, total) => API.post('/coupons/validate', { code, total }).then(res => res.data),
  getCoupons: () => API.get('/coupons').then(res => res.data),
  createCoupon: (couponData) => API.post('/coupons', couponData).then(res => res.data),
  updateCoupon: (id, couponData) => API.put(`/coupons/${id}`, couponData).then(res => res.data),
  deleteCoupon: (id) => API.delete(`/coupons/${id}`),
}

export default couponService