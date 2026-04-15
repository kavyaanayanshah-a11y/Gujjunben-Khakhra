import mongoose from 'mongoose';

const productSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true, default: 0 },
    description: { type: String, required: true },
    image: { type: String, required: true },
      images: [String],       // ✅ add this line
    countInStock: { type: Number, required: true, default: 0 },
    category: { type: String, default: 'Khakhra' },
  },
  { timestamps: true }
);

const Product = mongoose.model('Product', productSchema);
export default Product;