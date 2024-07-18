import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

export const getDataFromToken: any = (request: NextRequest) => {
  try {
    console.log('request.cookies.get("token")?.value :', request);
    const token = request.cookies.get("token")?.value || "";
    console.log('token :', token);
    const decodeToken: any = jwt.verify(token, process.env.TOKEN_SECRET!);
    console.log('decodeToken :', decodeToken);
    return decodeToken.id;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
