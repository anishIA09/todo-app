"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import React, { ChangeEvent, FormEvent, useState } from "react";

export const SigninForm = () => {
  type FormData = {
    username: string;
    password: string;
  };

  type FormErrors = Partial<Record<keyof FormData, string>>;

  const [formData, setFormData] = useState<FormData>({
    username: "",
    password: "",
  });
  const [validationErrors, setValidationErrors] = useState<FormErrors>({
    username: "",
    password: "",
  });

  const router = useRouter();

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "password" && value.includes(" ")) return;

    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
    setValidationErrors((prevValidationErrors) => ({
      ...prevValidationErrors,
      [name]: "",
    }));
  };

  const validateForm = (): FormErrors => {
    const errors: FormErrors = {};

    if (!formData.username.trim()) {
      errors.username = "Username can't be empty.";
    }

    if (!formData.password.trim()) {
      errors.password = "Password can't be empty.";
    }

    return errors;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const errors = validateForm();

    if (Object.values(errors).length) {
      setValidationErrors((prevValidationErrors) => ({
        ...prevValidationErrors,
        ...errors,
      }));
      return;
    }

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/auth/signin`,
        formData,
        {
          withCredentials: true,
        }
      );

      router.push("/");
    } catch (error) {
      console.log("Error", error);
    }
  };

  return (
    <div className="w-md rounded-md bg-neutral-100 shadow-md p-6 border border-neutral-200">
      <h3 className="text-lg font-semibold text-center mb-5">Sign In</h3>
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
          {validationErrors.username && (
            <ErrorMessage message={validationErrors.username} />
          )}
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
          {validationErrors.password && (
            <ErrorMessage message={validationErrors.password} />
          )}
        </LabelInputContainer>
        <button className="h-9 rounded-md bg-neutral-700 text-white text-sm font-medium hover:-top-0.5 active:scale-[98%] relative transition-all duration-200 hover:shadow-lg">
          Sign In
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

const ErrorMessage = ({ message }: { message: string }) => {
  return <p className="text-xs text-red-600">{message}</p>;
};
