import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { applyCoupon, removeCoupon } from '../redux/couponSlice'

const CouponBox = ({ total }) => {
  const [code, setCode] = useState('')
  const dispatch = useDispatch()
  const { appliedCoupon, discount, loading, error } = useSelector(state => state.coupon)

  const handleApply = () => {
    if (code) dispatch(applyCoupon({ code, total }))
  }

  if (appliedCoupon) {
    return (
      <div className="bg-green-100 p-3 rounded">
        <p>Coupon <strong>{appliedCoupon}</strong> applied! You saved ₹{discount}.</p>
        <button onClick={() => dispatch(removeCoupon())} className="text-red-600 underline">Remove</button>
      </div>
    )
  }

  return (
    <div className="flex gap-2 items-center">
      <input type="text" placeholder="Coupon code" value={code} onChange={(e) => setCode(e.target.value)} className="border p-2 rounded flex-1" />
      <button onClick={handleApply} disabled={loading} className="bg-orange-600 text-white px-4 py-2 rounded disabled:bg-gray-400">
        {loading ? 'Applying...' : 'Apply'}
      </button>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  )
}
export default CouponBox