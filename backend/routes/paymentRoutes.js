import express from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/create-order', protect, async (req, res) => {
  try {
    console.log('KEY:', process.env.RAZORPAY_KEY_ID);
    console.log('SECRET exists:', !!process.env.RAZORPAY_KEY_SECRET);
    
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const { amount } = req.body;
    console.log('Amount received:', amount);
    
    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    });
    
    console.log('Order created:', order.id);
    res.json(order);
  } catch (err) {
    console.log('Razorpay error full:', JSON.stringify(err));
    res.status(500).json({ message: err.message || JSON.stringify(err) });
  }
});

router.post('/verify', protect, (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    if (expectedSignature === razorpay_signature) {
      res.json({ success: true });
    } else {
      res.status(400).json({ message: 'Invalid payment signature' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;