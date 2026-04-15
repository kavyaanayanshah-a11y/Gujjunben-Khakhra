import Coupon from '../models/Coupon.js';

// @desc    Validate a coupon (for checkout)
// @route   POST /api/coupons/validate
// @access  Public
export const validateCoupon = async (req, res) => {
  const { code, total } = req.body;
  const coupon = await Coupon.findOne({ code: code.toUpperCase() });
  if (!coupon) return res.status(400).json({ message: 'Invalid coupon code' });
  if (coupon.expiryDate < new Date()) return res.status(400).json({ message: 'Coupon expired' });
  if (total < coupon.minOrder) return res.status(400).json({ message: `Minimum order ₹${coupon.minOrder} required` });

  res.json({ valid: true, discount: coupon.discount, code: coupon.code });
};

// @desc    Get all coupons (admin only)
// @route   GET /api/coupons
// @access  Private/Admin
export const getCoupons = async (req, res) => {
  const coupons = await Coupon.find({});
  res.json(coupons);
};

// @desc    Get active coupons (not expired) – for public display
// @route   GET /api/coupons/active
// @access  Public
export const getActiveCoupons = async (req, res) => {
  try {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0); // ensure UTC day start
    const coupons = await Coupon.find({ expiryDate: { $gte: today } });
    res.json(coupons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a coupon (admin only)
// @route   POST /api/coupons
// @access  Private/Admin
export const createCoupon = async (req, res) => {
  const { code, discount, minOrder, expiryDate } = req.body;
  const coupon = new Coupon({ code: code.toUpperCase(), discount, minOrder, expiryDate });
  const created = await coupon.save();
  res.status(201).json(created);
};

// @desc    Update a coupon (admin only)
// @route   PUT /api/coupons/:id
// @access  Private/Admin
export const updateCoupon = async (req, res) => {
  const coupon = await Coupon.findById(req.params.id);
  if (coupon) {
    coupon.code = req.body.code.toUpperCase() || coupon.code;
    coupon.discount = req.body.discount || coupon.discount;
    coupon.minOrder = req.body.minOrder || coupon.minOrder;
    coupon.expiryDate = req.body.expiryDate || coupon.expiryDate;
    const updated = await coupon.save();
    res.json(updated);
  } else res.status(404).json({ message: 'Coupon not found' });
};

// @desc    Delete a coupon (admin only)
// @route   DELETE /api/coupons/:id
// @access  Private/Admin
export const deleteCoupon = async (req, res) => {
  const coupon = await Coupon.findById(req.params.id);
  if (coupon) {
    await coupon.deleteOne();
    res.json({ message: 'Coupon removed' });
  } else res.status(404).json({ message: 'Coupon not found' });
};