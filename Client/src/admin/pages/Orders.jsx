// src/admin/pages/Orders.jsx
import { useEffect, useState } from 'react'
import orderService from '../../services/orderService'
import Loader from '../../components/Loader'
import toast from 'react-hot-toast'

const AdminOrders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchOrders = async () => {
    try {
      const data = await orderService.getAllOrders()
      setOrders(data)
    } catch (err) {
      toast.error('Failed to fetch orders')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const updateStatus = async (id, status) => {
    await orderService.updateOrderStatus(id, status)
    toast.success('Status updated')
    fetchOrders()
  }

  if (loading) return <Loader />
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">All Orders</h1>
      <div className="space-y-4">
        {orders.map(order => (
          <div key={order._id} className="bg-white p-4 rounded shadow">
            <div className="flex justify-between items-center flex-wrap">
              <div><strong>Order ID:</strong> {order._id}</div>
              <div><strong>Total:</strong> ₹{order.totalPrice}</div>
              <div><strong>Status:</strong> {order.status}</div>
              <select value={order.status} onChange={(e) => updateStatus(order._id, e.target.value)} className="border p-1 rounded">
                <option>Processing</option><option>Shipped</option><option>Delivered</option><option>Cancelled</option>
              </select>
            </div>
            <div className="mt-2 text-sm text-gray-600">Customer: {order.user?.name} | {order.shippingAddress?.address}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
export default AdminOrders