import axios from 'axios';

export default axios.create({
baseURL: 'https://ecommerce-mern-ql25.onrender.com/api',
withCredentials: true,
});