import Order from '../models/Order.js';
import asyncHandler from '../utils/asyncHandler.js';

export const createOrder = asyncHandler(async (req, res) => {
  const { items, totalPrice } = req.body;
  const order = await Order.create({ user: req.user._id, items, totalPrice });
  res.status(201).json(order);
});

export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).populate('items.product', 'name price');
  res.json(orders);
});