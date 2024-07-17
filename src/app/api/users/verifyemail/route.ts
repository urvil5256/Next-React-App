import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { token } = reqBody;

    const userDetail: any = await User.findOne({
      verifyToken: token,
      verifyTokenExpiry: { $gt: Date.now() },
    });
    if (!userDetail) {
      return NextResponse.json({ error: "Invalid token" }, { status: 400 });
    }
    
    userDetail.isVerified = true;
    userDetail.verifyToken = undefined;
    userDetail.verifyTokenExpiry = undefined;
    await userDetail.save();

    return NextResponse.json({
      messaage: "Email verified successfully",
      success: true,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
