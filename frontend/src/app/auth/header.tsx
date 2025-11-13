"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export const AuthHeader = () => {
  const pathname = usePathname();

  const isSignupPage = pathname === "/auth/signup";

  return (
    <header className="shrink-0">
      <nav className="flex items-center justify-between p-4">
        <Link href={"/"} className="text-xl font-semibold">
          TODO APP
        </Link>
        <Link
          href={isSignupPage ? "/auth/signin" : "/auth/signup"}
          className="px-3 py-1.5 rounded-md bg-neutral-700 text-white text-sm font-semibold h-8 flex items-center justify-center min-w-20"
        >
          {isSignupPage ? "Sign In" : "Sign Up"}
        </Link>
      </nav>
    </header>
  );
};
