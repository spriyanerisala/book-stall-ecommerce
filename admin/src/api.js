import axios from 'axios'

const API_URL = axios.create({
    baseURL:'http://localhost:5000',
})

export const getProducts = ()=> API_URL.get('/api/products/all-products')
export const getUsers = ()=> API_URL.get('/api/admin/get-all-users')
export const createProduct = (product)=> API_URL.post('/api/admin/create-product', product) 
export const updateProduct = (id,product)=> API_URL.put(`/api/admin/update-product/${id}`, product);
export const deleteProduct = (id) => API_URL.delete(`/api/admin/delete-product/${id}`);
export const getOneProduct = (id) => API_URL.get(`/api/admin/get-one-product/${id}`);
export const getOrders = ()=>API_URL.get('/api/admin/all-orders');
