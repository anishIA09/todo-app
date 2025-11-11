"use client";

import React, { ChangeEvent, FormEvent, useState } from "react";

export const SignupForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <div className="w-md rounded-md bg-neutral-100 shadow-md p-6 border border-neutral-200">
      <h3 className="text-lg font-semibold text-center mb-5">Sign Up</h3>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <LabelInputContainer>
          <Label htmlFor="username">Username</Label>
          <Input
            placeholder="Enter username or email"
            value={formData.username}
            name={"username"}
            id={"username"}
            onChange={handleInputChange}
          />
        </LabelInputContainer>
        <LabelInputContainer>
          <Label htmlFor="password">Password</Label>
          <Input
            id={"password"}
            name={"password"}
            placeholder="Enter password"
            type={"password"}
            value={formData.password}
            onChange={handleInputChange}
          />
        </LabelInputContainer>
        <button className="h-9 rounded-md bg-neutral-700 text-white text-sm font-medium hover:-top-0.5 active:scale-[98%] relative transition-all duration-200 hover:shadow-lg">
          Sign Up
        </button>
      </form>
    </div>
  );
};

const LabelInputContainer = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex flex-col gap-1.5">{children}</div>;
};

const Label = ({
  htmlFor,
  children,
}: {
  htmlFor: string;
  children: React.ReactNode;
}) => {
  return (
    <label htmlFor={htmlFor} className="font-semibold">
      {children}
    </label>
  );
};

const Input = ({ ...props }) => {
  return (
    <input
      className="px-3 h-9 rounded-md border border-neutral-200 text-sm placeholder:text-neutral-400 bg-white"
      {...props}
    />
  );
};
