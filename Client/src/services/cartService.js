import API from './api';

const cartService = {
  getCart: () => API.get('/cart').then(res => res.data),
  addToCart: (item) => API.post('/cart', item).then(res => res.data),
  updateQty: (productId, qty) => API.put(`/cart/${productId}`, { qty }).then(res => res.data),
  removeFromCart: (productId) => API.delete(`/cart/${productId}`).then(res => res.data),
  clearCart: () => API.delete('/cart').then(res => res.data),
};

export default cartService;