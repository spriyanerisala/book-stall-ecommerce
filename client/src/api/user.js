import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const  signup = async (userData) =>{
    const res = await axios.post(`${API_URL}/api/auth/signup`,userData);

    console.log(res.data);
    localStorage.setItem("user",JSON.stringify(userData));
}



export const login = async (userData) =>{
    const res = await axios.post(`${API_URL}/api/auth/login`,userData);
    console.log(res.data);
}


export const  logout = async () =>{
    const res = await axios.post(`${API_URL}/api/auth/logout`);
    console.log(res.data);
}

export const  forgotPassword = async (email) =>{
    const res = await axios.post(`${API_URL}/api/auth/forgot-password`,email);
    console.log(res.data);
}
export const  resetPassword = async (userData) =>{
    const res = await axios.post(`${API_URL}/api/auth/signup`,userData);
    console.log(res.data);
}
