import nodemailer from 'nodemailer';
import { EmailSend } from 'types/mailTypes/emailSend';

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // Use SSL
  auth: {
    user: process.env.GOOGLE_ACCOUNT,
    pass: process.env.GOOGLE_APP_PASSWORD,
  },
});

export async function sendEmail(email: EmailSend) {
    const info = await transporter.sendMail(email)
    return info;
}

export async function sendValidationMail(address: string, token: string){
    const verificationLink = `${process.env.DOMAIN_ADDRESS}/auth/verify/${token}`;
    const mailToSend = {
        from: "no-reply@vegoboken.se",
        to: address,
        subject: "Verifiera ditt konto på Vegoboken.se",
        text: `Klicka på länken för att verifiera din mailadress:
        ${verificationLink}`,
        html: `<h3>Verifiera ditt konto</h3>
        <p>Klicka på länken för att verifiera din mailadress:</p>
        <a href="${verificationLink}">Bekräfta konto</a>`
    }
    return await sendEmail(mailToSend);
}