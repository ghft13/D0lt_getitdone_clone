"use client";

import { useRouter } from "next/navigation";

export default function HandleAddToCart() {
  const router = useRouter();


const  HandleCart= () => {
  const sessionString = localStorage.getItem("auth_session");

  if (!sessionString || sessionString === "undefined" || sessionString === "null") {
    alert("Please login first or create an account");
    window.location.href = "/login";
    return;
  }

  // Parse JSON safely
  let session;
  try {
    session = JSON.parse(sessionString);
  } catch (error) {
    console.error("Invalid session data", error);
    localStorage.removeItem("auth_session");
    window.location.href = "/login";
    return;
  }

  const DASHBOARD_URL = process.env.NEXT_PUBLIC_DASHBOARD_URL || "";

  if (session?.user?.role === "user") {
    window.location.href = `${DASHBOARD_URL}/user`;
  } else {
    alert("Please create a homeowner account first to book a service.");
  }
};


  return (
    <button
      onClick={HandleCart}
      className="block w-[80%] text-center px-3 py-3 bg-[#FF6B35] text-white font-medium rounded-full transition-all duration-300 hover:bg-[#ff5722] hover:scale-105"
    >
      Add 
    </button>
  );
}
