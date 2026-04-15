import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import orderService from '../services/orderService'
import Loader from '../components/Loader'
import { Link } from 'react-router-dom'

const Orders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const { userInfo } = useSelector(state => state.user)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await orderService.getMyOrders()
        setOrders(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    if (userInfo) fetchOrders()
  }, [userInfo])

  if (loading) return <Loader />
  if (orders.length === 0) return <div className="container mx-auto py-10 text-center">No orders yet.</div>

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Orders</h1>
      <div className="space-y-4">
        {orders.map(order => (
          <div key={order._id} className="border rounded p-4 shadow-sm">
            <div className="flex justify-between items-center flex-wrap">
              <div><span className="font-semibold">Order ID:</span> {order._id}</div>
              <div><span className="font-semibold">Total:</span> ₹{order.totalPrice}</div>
              <div><span className="font-semibold">Status:</span> {order.status}</div>
              <Link to={`/track?orderId=${order._id}`} className="text-orange-600 underline">Track</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
export default Orders