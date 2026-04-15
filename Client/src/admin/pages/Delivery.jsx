// src/admin/pages/Delivery.jsx
import { useEffect, useState } from 'react'
import orderService from '../../services/orderService'
import Loader from '../../components/Loader'
import toast from 'react-hot-toast'

const AdminDelivery = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchOrders = async () => {
    const data = await orderService.getAllOrders()
    setOrders(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const updateDelivery = async (id, status) => {
    await orderService.updateDeliveryStatus(id, status)
    toast.success('Delivery status updated')
    fetchOrders()
  }

  if (loading) return <Loader />
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Delivery Management</h1>
      <div className="space-y-4">
        {orders.map(order => (
          <div key={order._id} className="bg-white p-4 rounded shadow flex justify-between items-center flex-wrap">
            <div><strong>Order:</strong> {order._id}</div>
            <div><strong>Delivery:</strong> {order.deliveryStatus || 'Pending'}</div>
            <select value={order.deliveryStatus || 'Pending'} onChange={e => updateDelivery(order._id, e.target.value)} className="border p-1 rounded">
              <option>Pending</option><option>Assigned</option><option>Out for Delivery</option><option>Delivered</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  )
}
export default AdminDelivery