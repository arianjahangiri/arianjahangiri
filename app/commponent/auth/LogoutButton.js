"use client";
import { signOut, useSession } from "next-auth/react";
import { Button } from "react-bootstrap";

const LogoutButton = () => {
  const { data: session, status } = useSession();

  if (status !== "authenticated") {
    return null;
  }

  const handleLogout = () => {
    signOut({ callbackUrl: "/" });
  };

  return (
<button
  className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded shadow-lg transition duration-300"
  onClick={handleLogout}
>
  خروج
</button>
  );
};

export default LogoutButton;
