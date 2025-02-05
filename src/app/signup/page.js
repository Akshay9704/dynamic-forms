"use client";
import AuthLayout from "@/components/auth/layout";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const SignupPage = () => {
  const router = useRouter();
  const [form, setForm] = useState({
    fullname: "",
    email: "",
    password: "",
    role: "user",
  });

  const [buttonDisabled, setButtonDisabled] = useState(false);

  useEffect(() => {
    const { fullname, email, password } = form;
    if (fullname && email && password) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [form.fullname, form.email, form.password, form]);

  const handleForm = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSignup = async (e) => {
    e.preventDefault();
    setButtonDisabled(true);
    try {
      const res = await axios.post("/api/users/signup", form);
      console.log("Signup response", res.data);
      toast.success("Signup successful");
      router.push("/login");
    } catch (error) {
      console.log("Signup error", error);
      toast.error("Signup failed");
    }
    setButtonDisabled(false);
  };

  console.log(form);
  return (
    <AuthLayout>
      <div className="mx-auto w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Create new account
          </h1>
          <p className="mt-2">
            Already have an account
            <Link
              className="font-medium underline ml-2 text-primary hover:underline"
              href="/login"
            >
              Login
            </Link>
          </p>
        </div>
        <form className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-foreground">
              Full Name
            </label>
            <input
              type="text"
              name="fullname"
              value={form.fullname}
              onChange={handleForm}
              className="mt-1 outline-none block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
              placeholder="Enter your full name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleForm}
              className="mt-1 outline-none block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mt-4">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleForm}
              className="mt-1 outline-none block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
              placeholder="Enter your password"
            />
          </div>
          <Button
            onClick={onSignup}
            disabled={buttonDisabled}
            className="mt-4 w-full"
          >
            Sign up
          </Button>
        </form>
      </div>
    </AuthLayout>
  );
};

export default SignupPage;
