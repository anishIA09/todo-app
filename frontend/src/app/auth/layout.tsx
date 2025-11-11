import { Appbar } from "@/components/common/app-bar";
import React from "react";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-screen flex flex-col">
      <Appbar />
      <div className="flex-1 px-4">{children}</div>
    </div>
  );
};

export default AuthLayout;
