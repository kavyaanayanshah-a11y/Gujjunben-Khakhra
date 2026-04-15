import Order from '../models/Order.js';

export const createOrder = async (req, res) => {
  const { orderItems, shippingAddress, paymentMethod, itemsPrice, discount, totalPrice, couponCode } = req.body;
  if (orderItems && orderItems.length === 0) return res.status(400).json({ message: 'No order items' });

  const order = new Order({
    user: req.user._id,
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    discount,
    totalPrice,
    couponCode,
  });
  const created = await order.save();
  res.status(201).json(created);
};

export const getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.json(orders);
};

export const getOrderById = async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');
  if (order) res.json(order);
  else res.status(404).json({ message: 'Order not found' });
};

export const trackOrder = async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (order) res.json(order);
  else res.status(404).json({ message: 'Order not found' });
};

// Admin
export const getAllOrders = async (req, res) => {
  const orders = await Order.find({}).populate('user', 'name email');
  res.json(orders);
};

export const updateOrderStatus = async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (order) {
    order.status = req.body.status;
    const updated = await order.save();
    res.json(updated);
  } else res.status(404).json({ message: 'Order not found' });
};

export const updateDeliveryStatus = async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (order) {
    order.deliveryStatus = req.body.deliveryStatus;
    const updated = await order.save();
    res.json(updated);
  } else res.status(404).json({ message: 'Order not found' });
};