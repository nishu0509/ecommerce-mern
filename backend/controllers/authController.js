import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import asyncHandler from '../utils/asyncHandler.js';

const generateToken = (res, id) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.cookie('jwt', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'none',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  return token;
};

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const exists = await User.findOne({ email });
  if (exists) {
    res.status(400);
    throw new Error('User already exists');
  }
  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashed });
  const token = generateToken(res, user._id);
  res.status(201).json({ _id: user._id, name: user.name, email: user.email, token });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    res.status(401);
    throw new Error('Invalid credentials');
  }
  const token = generateToken(res, user._id);
  res.json({ _id: user._id, name: user.name, email: user.email, token });
});

export const logout = (req, res) => {
  res.clearCookie('jwt');
  res.json({ message: 'Logged out' });
};

export const getProfile = asyncHandler(async (req, res) => {
  res.json(req.user);
});