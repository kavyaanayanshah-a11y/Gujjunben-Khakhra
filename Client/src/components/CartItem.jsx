import { useDispatch } from 'react-redux'
import { removeFromCart, updateQty } from '../redux/cartSlice'

const CartItem = ({ item }) => {
  const dispatch = useDispatch()

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center border-b py-4 gap-4">
      <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded" />
      <div className="flex-1">
        <h3 className="font-semibold">{item.name}</h3>
        <p>₹{item.price}</p>
      </div>
      <select
        value={item.qty}
        onChange={(e) => dispatch(updateQty({ _id: item._id, qty: Number(e.target.value) }))}
        className="border rounded p-1"
      >
        {[...Array(item.countInStock || 10).keys()].map(x => (
          <option key={x + 1} value={x + 1}>{x + 1}</option>
        ))}
      </select>
      <button onClick={() => dispatch(removeFromCart(item._id))} className="text-red-500">Remove</button>
    </div>
  )
}
export default CartItem