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
      <div className="w-full max-w-sm mx-auto overflow-hidden bg-white rounded-lg shadow-md dark:bg-gray-800">
        <div className="px-6 py-4">
          <h3 className="mt-3 text-xl font-medium text-center text-gray-600 dark:text-gray-200">
            Verify Email
          </h3>
        </div>
        <div className="px-6 py-4">
          <h3 className="mt-3 text-xl font-medium text-center text-gray-600 dark:text-gray-200">
            {token ? `${token}` : "No Token"}
          </h3>
        </div>
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
    </div>
  );
};

export default VerifyEmailPage;
