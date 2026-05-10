import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    product:  { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number, required: true },
    price:    { type: Number, required: true },
  }],
  totalPrice: { type: Number, required: true },
  isPaid:     { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);