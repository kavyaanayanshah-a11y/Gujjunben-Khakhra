import API from './api'

const productService = {
  getProducts: () => API.get('/products').then(res => res.data),
  getProductById: (id) => API.get(`/products/${id}`).then(res => res.data),
  createProduct: (productData, token) =>
    API.post('/products', productData, { headers: { Authorization: `Bearer ${token}` } }).then(res => res.data),
  updateProduct: (id, productData, token) =>
    API.put(`/products/${id}`, productData, { headers: { Authorization: `Bearer ${token}` } }).then(res => res.data),
  deleteProduct: (id, token) =>
    API.delete(`/products/${id}`, { headers: { Authorization: `Bearer ${token}` } }),
}

export default productService