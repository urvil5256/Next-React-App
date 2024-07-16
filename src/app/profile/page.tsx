"use client";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

const ProfilePage = () => {
  const route = useRouter();
  const [userData, setUserData] = useState("nothing");
  const logout = async () => {
    try {
      await axios.get("/api/users/logout");
      toast.success("Logout successful");
      route.push("/login");
    } catch (error: any) {
      console.log("Failed to logout", error.message);
      toast.error(error.message);
    }
  };
  const getUserDetails = async () => {
    const res = await axios.get("/api/users/me");
    console.log(res.data.data);
    setUserData(res.data.data.username);
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1>Profile</h1>
      <hr />
      <h2 className="mt-4">
        {userData === "nothing" ? (
          "Nothing"
        ) : (
          <Link href={`/profile/${userData}`}
          className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-600 bg-indigo-400"
          >{userData}</Link>
        )}
      </h2>
      <button
        onClick={logout}
        className="p-2 border mt-4 border-gray-300 rounded-lg focus:outline-none focus:border-gray-600 bg-orange-400"
      >
        Logout
      </button>
      <button
        onClick={getUserDetails}
        className="p-2 mt-4 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-600 bg-green-500"
      >
        Get User Details
      </button>
    </div>
  );
};

export default ProfilePage;
