"use client";

import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";

const VerifyEmailPage = () => {
  const [token, setToken] = useState("");
  const [verified, setVerified] = useState(false);
  const [isError, setIsError] = useState(false);

  const VerifyUserEmail = async () => {
    try {
      await axios.post("/api/users/verifyemail", { token });
      setVerified(true);
    } catch (error: any) {
      setIsError(true);
      console.log(error.response.data);
    }
  };

  useEffect(() => {
    const urlToken = window.location.search.split("=")[1];
    setToken(urlToken || "No Token");
  }, []);

  useEffect(() => {
    if (token.length > 0) {
      VerifyUserEmail();
    }
  }, [token]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl">Verify Email</h1>
      <h2 className="p-2 mt-4 bg-orange-500 text-black">
        {token ? `${token}` : "No Token"}
      </h2>
      {verified && (
        <div className="text-2xl mt-4">
          Email Verified
          <p className="mt-2 text-center">
            <Link
              href="/login"
              className="inline-block rounded-lg px-6 py-1.5 mt-2 text-base font-semibold leading-7 hover:bg-gray-400 bg-blue-400"
            >
              Log in
            </Link>
          </p>
        </div>
      )}
      {isError && (
        <div className="text-2xl text-center p-2 mt-4 bg-red-500 text-black">
          Error
        </div>
      )}
    </div>
  );
};

export default VerifyEmailPage;
