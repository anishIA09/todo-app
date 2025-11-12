"use client";

import { get } from "@/config/api";
import React, { useEffect } from "react";

const ProfilePage = () => {
  useEffect(() => {
    (async () => {
      try {
        const res = await get("/users/self");
      } catch (error) {
        console.log("error", error);
      }
    })();
  }, []);

  return (
    <div className="h-screen">
      <div className="flex justify-between">
        <h2 className="text-xl font-semibold">Todo App</h2>
        <div></div>
      </div>
    </div>
  );
};

export default ProfilePage;
