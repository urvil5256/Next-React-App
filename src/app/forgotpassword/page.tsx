"use client";

import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import jwt, { JwtPayload } from "jsonwebtoken";

const ForgotPassword = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [isDisabled, setIsDisabled] = useState(true);
  const [user, setUser] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  useEffect(() => {
    if (
      (user.password.length > 0 && user.confirmPassword.length > 0) ||
      user.email.length > 0
    ) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [user]);

  useEffect(() => {
    const urlToken = window.location.search.split("=")[1];
    const userEmail = jwt.decode(urlToken) as JwtPayload;
    setUser((prev) => ({ ...prev, email: userEmail.email }));
    if (urlToken) {
      setIsDisabled(false);
      setIsLoading(false);
    }
  }, []);

  const onBtnClick = async () => {
    setIsLoading(true);
    if (user.password.length > 0 && user.confirmPassword.length > 0) {
      if (user.password === user.confirmPassword) {
        await axios.post("/api/users/forgotpassword", user);
      } else {
        toast.error("Password does not match");
        console.log("Password does not match");
      }
    }
  };

  const sendLink = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post("/api/users/forgotpassword", {
        ...user,
        sendByLink: true,
      });
      console.log("Email sent successfully", response.data);
      toast.success(response.data);
      router.push("/login");
    } catch (error: any) {
      console.log("Email sent faield", error.message);
      toast.error(error.message);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-center text-2xl">
        {isLoading ? "Processing" : "Forgot Password"}
      </h1>
      {isDisabled ? (
        <>
          <hr />
          <h2>Sending forgot password link</h2>
          <hr />
          <input
            type="text"
            id="email"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            placeholder="email"
            className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600"
          />
          <button
            onClick={sendLink}
            className="inline-block rounded-lg px-6 py-1.5 mt-2 text-base font-semibold leading-7 hover:bg-gray-400 bg-blue-400"
            disabled={buttonDisabled}
          >
            Send link
          </button>
        </>
      ) : (
        <>
          <label htmlFor="password">password</label>
          <input
            type="password"
            id="password"
            value={user.password}
            onChange={(e) => setUser({ ...user, password: e.target.value })}
            placeholder="password"
            className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600"
          />
          <label htmlFor="confirmpassword">confirm password</label>
          <input
            type="password"
            id="confirmpassword"
            value={user.confirmPassword}
            onChange={(e) =>
              setUser({ ...user, confirmPassword: e.target.value })
            }
            placeholder="confirm password"
            className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600"
          />
          <button
            onClick={onBtnClick}
            className="inline-block rounded-lg px-6 py-1.5 mt-2 text-base font-semibold leading-7 hover:bg-gray-400 bg-blue-400"
            disabled={buttonDisabled}
          >
            Submit
          </button>
          <br />
          <Link
            href="/login"
            className="inline-block rounded-lg px-6 py-1.5 mt-2 text-base font-semibold leading-7 hover:bg-gray-400 bg-blue-400"
          >
            Visit login page
          </Link>
        </>
      )}
    </div>
  );
};

export default ForgotPassword;
