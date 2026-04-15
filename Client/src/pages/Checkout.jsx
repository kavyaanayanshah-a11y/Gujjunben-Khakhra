import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { saveShippingAddress, savePaymentMethod, clearCartBackend } from '../redux/cartSlice'   // ✅ changed
import { removeCoupon } from '../redux/couponSlice'
import orderService from '../services/orderService'
import toast from 'react-hot-toast'

const Checkout = () => {
  const { cartItems, shippingAddress, paymentMethod: savedMethod } = useSelector(state => state.cart)
  const { userInfo } = useSelector(state => state.user)
  const { discount, appliedCoupon } = useSelector(state => state.coupon)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [address, setAddress] = useState(shippingAddress.address || '')
  const [city, setCity] = useState(shippingAddress.city || '')
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || '')
  const [phone, setPhone] = useState(shippingAddress.phone || '')
  const [payment, setPayment] = useState(savedMethod || 'COD')
  const [loading, setLoading] = useState(false)

  const subtotal = cartItems.reduce((acc, i) => acc + i.price * i.qty, 0)
  const total = subtotal - discount

  const placeOrder = async () => {
    if (!address || !city || !postalCode || !phone) {
      toast.error('Please fill all shipping details')
      return
    }
    const shippingAddr = { address, city, postalCode, phone }
    dispatch(saveShippingAddress(shippingAddr))
    dispatch(savePaymentMethod(payment))

    const orderItems = cartItems.map(item => ({
      product: item._id,
      name: item.name,
      qty: item.qty,
      price: item.price,
      image: item.image,
    }))

    const orderData = {
      orderItems,
      shippingAddress: shippingAddr,
      paymentMethod: payment,
      itemsPrice: subtotal,
      discount: discount,
      totalPrice: total,
      couponCode: appliedCoupon || null,
    }

    setLoading(true)
    try {
      await orderService.createOrder(orderData)
      await dispatch(clearCartBackend()).unwrap()   // ✅ clear cart from backend
      dispatch(removeCoupon())
      toast.success('Order placed successfully!')
      navigate('/orders')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Order failed')
    } finally {
      setLoading(false)
    }
  }

  if (!userInfo) {
    navigate('/login')
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3">
          <div className="bg-white shadow rounded p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
            <div className="grid grid-cols-1 gap-4">
              <input type="text" placeholder="Address" value={address} onChange={e => setAddress(e.target.value)} className="border p-2 rounded" />
              <input type="text" placeholder="City" value={city} onChange={e => setCity(e.target.value)} className="border p-2 rounded" />
              <input type="text" placeholder="Postal Code" value={postalCode} onChange={e => setPostalCode(e.target.value)} className="border p-2 rounded" />
              <input type="text" placeholder="Phone" value={phone} onChange={e => setPhone(e.target.value)} className="border p-2 rounded" />
            </div>
          </div>
          <div className="bg-white shadow rounded p-6">
            <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
            <select value={payment} onChange={e => setPayment(e.target.value)} className="border p-2 rounded w-full">
              <option value="COD">Cash on Delivery</option>
              <option value="Card">Credit/Debit Card</option>
              <option value="UPI">UPI</option>
            </select>
          </div>
        </div>
        <div className="lg:w-1/3">
          <div className="bg-gray-100 p-4 rounded shadow">
            <h2 className="text-xl font-bold mb-4">Your Order</h2>
            {cartItems.map(item => (
              <div key={item._id} className="flex justify-between text-sm mb-2">
                <span>{item.name} x{item.qty}</span>
                <span>₹{item.price * item.qty}</span>
              </div>
            ))}
            <hr className="my-2" />
            <div className="flex justify-between"><span>Subtotal:</span><span>₹{subtotal}</span></div>
            {discount > 0 && <div className="flex justify-between text-green-600"><span>Discount:</span><span>-₹{discount}</span></div>}
            <div className="flex justify-between font-bold text-lg mt-2"><span>Total:</span><span>₹{total}</span></div>
            <button onClick={placeOrder} disabled={loading} className="w-full bg-orange-600 text-white py-2 rounded mt-6 disabled:bg-gray-400">
              {loading ? 'Placing Order...' : 'Place Order'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
export default Checkout