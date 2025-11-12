"use client";

import { get } from "@/config/api";
import React, { useEffect, useState } from "react";

const ProfilePage = () => {
  const [loading, setIsLoading] = useState(false);
  const [data, setData] = useState(null);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const res = await get("/users/self");
        setData(res.data.data);
        setIsLoading(false);
      } catch (error) {
        console.log("error", error);
        setIsLoading(false);
      }
    })();
  }, []);

  return (
    <div className="h-screen max-w-xl mx-auto py-5">
      <div className="flex justify-between">
        <h2 className="text-xl font-semibold">Todo App</h2>
        <div className="mx-5">
          {loading && !data ? (
            <p>Loading...</p>
          ) : (
            <div>
              <p>
                Username:{" "}
                <span className="font-semibold">{data?.username}</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
