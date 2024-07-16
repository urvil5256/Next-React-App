import nodemailer from "nodemailer";
import User from "@/models/userModel";
import bcrypt from "bcryptjs";

export const sendEmail = async ({ email, emailType, userId }: any) => {
  try {
    const SENDER_EMAIL = process.env.MAILTRAP_USER;
    const RECIPIENT_EMAIL = email;
    const SENDER_PASSWORD = process.env.MAILTRAP_PASSWORD;
    // Create a hased token
    const hasedToken = await bcrypt.hash(userId.toString(), 10);
    console.log("hasedToken :", hasedToken);
    if (emailType === "VERIFY") {
      console.log("emailType :", emailType);
      await User.findByIdAndUpdate(userId, {
        verifyToken: hasedToken,
        verifyTokenExpiry: Date.now() + 3600000,
      });
    } else if (emailType === "RESET") {
      await User.findByIdAndUpdate(userId, {
        forgotPasswordToken: hasedToken,
        forgotPasswordTokenExpiry: Date.now() + 3600000,
      });
    }

    console.log(">>>>>>>>>>>>>>>>>>>> :");
    const transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: SENDER_EMAIL,
        pass: SENDER_PASSWORD,
      },
    });
    console.log("transport :", transport);

    const mailOptions = {
      from: SENDER_EMAIL,
      to: RECIPIENT_EMAIL,
      subject:
        emailType === "VERIFY" ? "Verify your email" : "Reset your password",
      html: `<p>Click <a href="${
        process.env.domain
      }/verifyemail?token=${hasedToken}">here</a> to ${
        emailType === "VERIFY" ? "Verify your email" : "Reset your password"
      }</p>`,
    };

    console.log("mailOptions :", mailOptions);
    const mailResponse = await transport.sendMail(mailOptions);
    console.log('mailResponse :', mailResponse);
    return mailResponse;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
