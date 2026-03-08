import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

export const transporter = nodemailer.createTransport({
        host:process.env.EMAIL_HOST,
        port:parseInt(process.env.EMAIL_PORT),
        secure:false,
        auth:{
            user:process.env.EMAIL_USER,
            pass:process.env.EMAIL_PASSWORD
        }
})


transporter.verify((error,success)=>{
    if(error){
        console.log("EMAIL not connected",error);
    }else{
        console.log("EMAIL connected succesfully");
    }
})