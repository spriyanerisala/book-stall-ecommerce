import axios from 'axios'

const API_URL=import.meta.env.VITE_API_URL;
console.log(API_URL);


export const getAllBooks = async ()=>{
    const res = await axios.get(`${API_URL}/api/products/all-products`);
    console.log(res.data);
}


export const getBookById = async(id)=>{
    const res= await axios.get(`${API_URL}/api/products/product/${id}`);
    console.log(res.data);
}