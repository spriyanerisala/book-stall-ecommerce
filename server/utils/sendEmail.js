import { transporter } from "../config/email.js";

export const sendEmail = async ({to,subject,html,attachments=[]})=>{
    try{
        const info = await transporter.sendMail({
            from : process.env.EMAIL_USER,
            to,
            subject,
            html,
            attachments,
        })

        console.log("Email sent successfully",info);

    }catch(err){
        console.log("error in sending email",err);
    }
}