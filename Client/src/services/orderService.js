import API from './api'

const orderService = {
  createOrder: (orderData) => API.post('/orders', orderData).then(res => res.data),
  getMyOrders: () => API.get('/orders/myorders').then(res => res.data),
  getOrderById: (id) => API.get(`/orders/${id}`).then(res => res.data),
  trackOrder: (orderId) => API.get(`/orders/track/${orderId}`).then(res => res.data),
  getAllOrders: () => API.get('/orders').then(res => res.data),
  updateOrderStatus: (orderId, status) => API.put(`/orders/${orderId}/status`, { status }).then(res => res.data),
  updateDeliveryStatus: (orderId, deliveryStatus) => API.put(`/orders/${orderId}/delivery`, { deliveryStatus }).then(res => res.data),
}

export default orderService