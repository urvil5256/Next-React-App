import { sendEmail } from "@/helpers/mailer";
import User from "@/models/userModel";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import { EmailType } from "../../const";
import toast from "react-hot-toast";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { email, password, sendByLink } = reqBody;

    //Check if user is already exist
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: "User does not exist" },
        { status: 400 }
      );
    }

    // Create token data
    const tokenData = {
      id: user._id,
      username: user.username,
      email: user.email,
    };
    const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET!, {
      expiresIn: "1d",
    });

    const response = NextResponse.json({
      message: "Forgot password link successfully sent",
      success: true,
    });

    response.cookies.set("token", token, {
      httpOnly: true,
    });
    // Send verification email
    if (sendByLink) {
      await sendEmail({
        email,
        emailType: EmailType.resetEmail,
        userId: user._id,
      });
    } else {
      await updatePassword({ email, password });
    }

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

const updatePassword = async ({ password, email }: any) => {
  try {
    const encryptPass = await bcrypt.hash(password, 10);
    console.log("encryptPass :", encryptPass);
    const response = await User.updateOne(
      { email },
      { $set: { password: encryptPass } }
    );
    console.log("response :", response);
    toast.success(response.upsertedCount + "");
    console.log(response);
  } catch (error: any) {
    console.log(error.message);

    toast.error("Password not updated");
  }
};
