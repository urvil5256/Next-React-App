"use client";

import axios from "axios";
import jwt, { JwtPayload } from "jsonwebtoken";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

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
      user?.email?.length > 0
    ) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [user]);

  useEffect(() => {
    const urlToken = window.location.search.split("=")[1];
    const userEmail = jwt.decode(urlToken) as JwtPayload;
    setUser((prev) => ({ ...prev, email: userEmail?.email }));
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
      <Toaster position="top-right" reverseOrder={false} />
      {isLoading ? (
        <>
          <h1 className="text-xl md:text-7xl font-bold flex items-center">
            L
            <svg
              stroke="currentColor"
              fill="currentColor"
              stroke-width="0"
              viewBox="0 0 24 24"
              className="animate-spin"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2ZM13.6695 15.9999H10.3295L8.95053 17.8969L9.5044 19.6031C10.2897 19.8607 11.1286 20 12 20C12.8714 20 13.7103 19.8607 14.4956 19.6031L15.0485 17.8969L13.6695 15.9999ZM5.29354 10.8719L4.00222 11.8095L4 12C4 13.7297 4.54894 15.3312 5.4821 16.6397L7.39254 16.6399L8.71453 14.8199L7.68654 11.6499L5.29354 10.8719ZM18.7055 10.8719L16.3125 11.6499L15.2845 14.8199L16.6065 16.6399L18.5179 16.6397C19.4511 15.3312 20 13.7297 20 12L19.997 11.81L18.7055 10.8719ZM12 9.536L9.656 11.238L10.552 14H13.447L14.343 11.238L12 9.536ZM14.2914 4.33299L12.9995 5.27293V7.78993L15.6935 9.74693L17.9325 9.01993L18.4867 7.3168C17.467 5.90685 15.9988 4.84254 14.2914 4.33299ZM9.70757 4.33329C8.00021 4.84307 6.53216 5.90762 5.51261 7.31778L6.06653 9.01993L8.30554 9.74693L10.9995 7.78993V5.27293L9.70757 4.33329Z"></path>
            </svg>{" "}
            ading . . .
          </h1>
        </>
      ) : (
        <div>
          {isDisabled ? (
            <div className="w-full max-w-sm mx-auto overflow-hidden bg-white rounded-lg shadow-md dark:bg-gray-800">
              <div className="px-6 py-4">
                <h3 className="mt-3 text-xl font-medium text-center text-gray-600 dark:text-gray-200">
                  Sending forgot password link
                </h3>

                <form>
                  <div className="w-full mt-4">
                    <input
                      className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-500 bg-white border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300"
                      type="email"
                      id="email"
                      value={user.email}
                      onChange={(e) =>
                        setUser({ ...user, email: e.target.value })
                      }
                      placeholder="Email Address"
                      aria-label="Email Address"
                    />
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <Link
                      href="/login"
                      className="text-sm text-gray-600 dark:text-gray-200 hover:text-gray-500"
                    >
                      Login?
                    </Link>
                    <button
                      onClick={sendLink}
                      className="px-6 py-2 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-500 rounded-lg hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50"
                      disabled={buttonDisabled}
                    >
                      Send link
                    </button>
                  </div>
                </form>
              </div>
            </div>
          ) : (
            <div className="w-full max-w-sm mx-auto overflow-hidden bg-white rounded-lg shadow-md dark:bg-gray-800">
              <div className="px-6 py-4">
                <h3 className="mt-3 text-xl font-medium text-center text-gray-600 dark:text-gray-200">
                  Forgot Password
                </h3>

                <form>
                  <div className="w-full mt-4">
                    <input
                      className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-500 bg-white border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300"
                      type="password"
                      id="password"
                      value={user.password}
                      onChange={(e) =>
                        setUser({ ...user, password: e.target.value })
                      }
                      placeholder="password"
                      aria-label="Password"
                    />
                  </div>

                  <div className="w-full mt-4">
                    <input
                      className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-500 bg-white border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300"
                      type="password"
                      id="confirmpassword"
                      value={user.confirmPassword}
                      onChange={(e) =>
                        setUser({ ...user, confirmPassword: e.target.value })
                      }
                      placeholder="confirm password"
                      aria-label="Confirm Password"
                    />
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <Link
                      href="/login"
                      className="text-sm text-gray-600 dark:text-gray-200 hover:text-gray-500"
                    >
                      Login?
                    </Link>

                    <button
                      onClick={onBtnClick}
                      disabled={buttonDisabled}
                      className="px-6 py-2 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-500 rounded-lg hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50"
                    >
                      Submit
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ForgotPassword;
