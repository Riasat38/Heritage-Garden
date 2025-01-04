`use strict`
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USER,  // Your email address
        pass: process.env.EMAIL_PASS   // Your app password
    }
});

export const sendNotification = async (requester_email,subject, message) => {
    const mailOptions = {
        from: process.env.EMAIL_USER, 
        to: requester_email,
        subject: subject,
        text: `${message})`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Notification sent successfully');
    } catch (error) {
        console.error('Error sending notification:', error);
    }
};
