import mongoose from 'mongoose';

const couponSchema = mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true },
    discount: { type: Number, required: true, default: 0 },
    minOrder: { type: Number, default: 0 },
    expiryDate: { type: Date, required: true },
  },
  { timestamps: true }
);

const Coupon = mongoose.model('Coupon', couponSchema);
export default Coupon;