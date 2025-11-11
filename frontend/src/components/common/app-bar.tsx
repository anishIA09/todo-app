"use client";

import Link from "next/link";

export const Appbar = () => {
  return (
    <header className="shrink-0">
      <nav className="flex justify-between items-center p-4">
        <Link href={"/"} className="text-xl font-semibold">
          TODO APP
        </Link>
        <Link
          href={"/auth/signup"}
          className="flex items-center justify-center px-3 py-2 h-8 rounded-md text-white bg-neutral-700 text-sm font-semibold shadow-md"
        >
          Sign Up
        </Link>
      </nav>
    </header>
  );
};
