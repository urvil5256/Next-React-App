import { EmailType } from "@/app/api/const";
import User from "@/models/userModel";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";

export const sendEmail = async ({ email, emailType, userId }: any) => {
  try {
    const SENDER_EMAIL = process.env.MAILTRAP_USER;
    const RECIPIENT_EMAIL = email;
    const SENDER_PASSWORD = process.env.MAILTRAP_PASSWORD;

    const EMAIL_MESSAGE =
      EmailType.verifyEmail === emailType
        ? "Verify your email"
        : "Reset your password";

    // Create a hased token
    const tokenData = {
      email,
    };
    const hasedToken = await jwt.sign(tokenData, process.env.TOKEN_SECRET!, {
      expiresIn: "1d",
    });
    if (emailType === EmailType.verifyEmail) {
      await User.findByIdAndUpdate(userId, {
        verifyToken: hasedToken,
        verifyTokenExpiry: Date.now() + 3600000,
      });
    } else if (emailType === EmailType.resetEmail) {
      await User.findByIdAndUpdate(userId, {
        forgotPasswordToken: hasedToken,
        forgotPasswordTokenExpiry: Date.now() + 3600000,
      });
    }

    const transport = nodemailer.createTransport({
      host: process.env.MAILTRAP_HOSTNAME,
      port: 2525,
      auth: {
        user: SENDER_EMAIL,
        pass: SENDER_PASSWORD,
      },
    });
    const mailOptions = {
      from: SENDER_EMAIL,
      to: RECIPIENT_EMAIL,
      subject: EMAIL_MESSAGE,
      html:
        EmailType.verifyEmail === emailType
          ? `<p>Click <a href="${process.env.DOMAIN}/verifyemail?token=${hasedToken}">here</a> to ${EMAIL_MESSAGE}</p>`
          : `<p>Click <a href="${process.env.DOMAIN}/forgotpassword?token=${hasedToken}">here</a> to ${EMAIL_MESSAGE}</p>`,
    };

    const mailResponse = await transport.sendMail(mailOptions);
    return mailResponse;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
