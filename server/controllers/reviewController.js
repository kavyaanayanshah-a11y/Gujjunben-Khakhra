import Review from '../models/Review.js';
import Product from '../models/Product.js';

export const getProductReviews = async (req, res) => {
  const reviews = await Review.find({ product: req.params.productId }).populate('user', 'name');
  res.json(reviews);
};

export const createReview = async (req, res) => {
  const { productId, rating, comment } = req.body;
  const product = await Product.findById(productId);
  if (!product) return res.status(404).json({ message: 'Product not found' });

  const alreadyReviewed = await Review.findOne({ product: productId, user: req.user._id });
  if (alreadyReviewed) return res.status(400).json({ message: 'You already reviewed this product' });

  const review = new Review({
    product: productId,
    user: req.user._id,
    rating,
    comment,
  });
  const created = await review.save();
  res.status(201).json(created);
};