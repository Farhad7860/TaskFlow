"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { logout, setUser } from "@redux/slices/userSlice";
import Image from "next/image";
import { Bars3Icon } from "@heroicons/react/24/outline";

export default function Navbar() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.user);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && !userInfo) dispatch(setUser({ token }));
  }, [userInfo, dispatch]);

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-blue-700 text-white flex justify-between items-center px-6 z-50">
    <div
  className="flex items-center gap-2 mx-12 cursor-pointer"
  onClick={() => router.push("/")}
>
  <span className="text-2xl font-bold">
    TaskFlow
  </span>
</div>


      <div className="relative">
        <Bars3Icon
          className="h-6 w-6 cursor-pointer"
          onClick={() => setOpen(!open)}
        />

        {open && (
          <div className="absolute right-0 mt-2 bg-white text-black rounded shadow w-40">
            {userInfo ? (
              <>
                <button
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  onClick={() => router.push("/profile/invitations")}
                >
                  Invitations
                </button>
                <button
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  onClick={() => {
                    dispatch(logout());
                    router.push("/login");
                  }}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  className="block w-full px-4 py-2"
                  onClick={() => router.push("/login")}
                >
                  Login
                </button>
                <button
                  className="block w-full px-4 py-2"
                  onClick={() => router.push("/register")}
                >
                  Register
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
