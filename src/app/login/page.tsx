"use client";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const LoginPage = () => {
  const router = useRouter();
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const onLogin = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post("/api/users/login", user);

      console.log("Login success", response.data);
      toast.success("Login Success");
      router.push("/profile");
    } catch (error: any) {
      console.log("Login faield", error.message);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (user.email.length > 0 && user.password.length > 0) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [user]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-center text-2xl">
        {isLoading ? "Processing" : "Login "}
      </h1>
      <hr />
      <label htmlFor="email">email</label>
      <input
        type="text"
        id="email"
        value={user.email}
        onChange={(e) => setUser({ ...user, email: e.target.value })}
        placeholder="email"
        className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600"
      />
      <label htmlFor="password">password</label>
      <input
        type="password"
        id="password"
        value={user.password}
        onChange={(e) => setUser({ ...user, password: e.target.value })}
        placeholder="password"
        className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600"
      />
      <button
        onClick={onLogin}
        // className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-600"
        className="inline-block rounded-lg px-6 py-1.5 mt-2 text-base font-semibold leading-7 hover:bg-gray-400 bg-blue-400"
        disabled={buttonDisabled}
      >
        Login
      </button>
      <br />
      <Link
        href="/signup"
        className="inline-block rounded-lg px-6 py-1.5 mt-2 text-base font-semibold leading-7 hover:bg-gray-400 bg-blue-400"
      >
        Visit signup page
      </Link>
      <br />
      <Link
        href="/forgotpassword"
        className="inline-block rounded-lg px-6 py-1.5 mt-2 text-base font-semibold leading-7 hover:bg-gray-400 bg-blue-400"
      >
        Visit forgot password
      </Link>
    </div>
  );
};

export default LoginPage;
