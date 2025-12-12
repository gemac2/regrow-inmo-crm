"use client";

import { logout } from "@/app/auth/logout/action";

export default function LogoutButton() {
  return (
    <button
      onClick={() => logout()}
      className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
    >
      Logout
    </button>
  );
}
