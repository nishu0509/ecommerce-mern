import express from 'express';
import { upload } from '../config/cloudinary.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, adminOnly, upload.single('image'), (req, res) => {
  res.json({ imageUrl: req.file.path });
});

export default router;