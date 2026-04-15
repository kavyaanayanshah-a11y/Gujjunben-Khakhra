import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import orderService from '../services/orderService'
import Loader from '../components/Loader'

const TrackOrder = () => {
  const [searchParams] = useSearchParams()
  const orderId = searchParams.get('orderId')
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(false)
  const [inputId, setInputId] = useState(orderId || '')

  const track = async () => {
    if (!inputId) return
    setLoading(true)
    try {
      const data = await orderService.trackOrder(inputId)
      setOrder(data)
    } catch (err) {
      alert('Order not found')
      setOrder(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (orderId) track()
  }, [orderId])

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Track Your Order</h1>
      <div className="flex gap-2 mb-6">
        <input type="text" placeholder="Enter Order ID" value={inputId} onChange={e => setInputId(e.target.value)} className="border p-2 rounded flex-1" />
        <button onClick={track} className="bg-orange-600 text-white px-4 py-2 rounded">Track</button>
      </div>
      {loading && <Loader />}
      {order && (
        <div className="bg-gray-100 p-4 rounded">
          <p><strong>Order ID:</strong> {order._id}</p>
          <p><strong>Status:</strong> {order.status}</p>
          <p><strong>Delivery Status:</strong> {order.deliveryStatus || 'Processing'}</p>
          <p><strong>Total:</strong> ₹{order.totalPrice}</p>
          <h3 className="font-semibold mt-4">Items</h3>
          {order.orderItems.map(item => <div key={item._id}>{item.name} x{item.qty}</div>)}
        </div>
      )}
    </div>
  )
}
export default TrackOrder