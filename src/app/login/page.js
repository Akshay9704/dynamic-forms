"use client";
import axios from "axios";
import { useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { GlobalContext } from "@/context";
import AuthLayout from "@/components/auth/layout";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const LoginPage = () => {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [loading, setLoading] = useState(false);

  const context = useContext(GlobalContext);
  const router = useRouter();

  if (!context) {
    throw new Error("GlobalContext must be used within a GlobalState provider");
  }

  const { isAuthUser, setIsAuthUser, userData, setUserData } = context;

  const handleUser = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const onLogin = async (e) => {
    e.preventDefault();
    setButtonDisabled(true);
    try {
      setLoading(true);
      const res = await axios.post("/api/users/login", user);
      if (res.data.success) {
        setIsAuthUser(true);
        setUserData(res?.data?.user);
        Cookies.set("token", res?.data?.token);
        localStorage.setItem("user", JSON.stringify(res?.data?.user));
        toast.success("Login successful!");
        window.location.reload();
      }
    } catch (error) {
      console.error(error);
      toast.error("Email or Password is Incorrect!");
    } finally {
      setLoading(false);
    }
    setButtonDisabled(false);
  };

  useEffect(() => {
    if (isAuthUser && userData?.role === "admin") {
      router.push("/dashboard/admin-view");
    } else if (isAuthUser && userData?.role === "user") {
      router.push("/dashboard/user-view");
    }
  }, [isAuthUser, userData?.role, router]);

  return (
    <AuthLayout>
      <div className="mx-auto w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Sign in to your account
          </h1>
          <p>
            Don&apos;t have an account?
            <Link
              className="font-medium underline ml-2 text-primary hover:underline"
              href="/signup"
            >
              Register
            </Link>
          </p>
        </div>
        <form className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-foreground">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={user.email}
              onChange={handleUser}
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
              value={user.password}
              onChange={handleUser}
              className="mt-1 outline-none block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
              placeholder="Enter your password"
            />
          </div>
          <Button
            disabled={buttonDisabled}
            onClick={onLogin}
            className="mt-4 w-full"
          >
            Login
          </Button>
        </form>
        <div>
          <h5 className="font-bold">Login Credentials:</h5>
          <p>
            Email: admin@gmail.com <br />
            Password: 1234 <br />
            Email: user@gmail.com <br />
            Password: 1234 <br />
          </p>
        </div>
      </div>
    </AuthLayout>
  );
};

export default LoginPage;