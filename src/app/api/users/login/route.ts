import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

connect();
export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { email, password } = reqBody;
    const userDetails = await User.findOne({ email });
    if (!userDetails) {
      return NextResponse.json(
        { error: "User does not exist" },
        { status: 400 }
      );
    }
    const validePassword = bcrypt.compare(password, userDetails.password);
    if (!validePassword) {
      return NextResponse.json({ error: "Invalid password" }, { status: 400 });
    }
    // Create token data
    const tokenData = {
      id: userDetails._id,
      username: userDetails.username,
      email: userDetails.email,
    };
    const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET!, {
      expiresIn: "1d",
    });

    const response = NextResponse.json({
      message: "Login successfully",
      success: true,
    });

    response.cookies.set("token", token, {
      httpOnly: true,
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
