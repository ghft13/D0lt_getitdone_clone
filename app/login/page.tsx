"use client";

import Image from "next/image";
import axios from "axios";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/auth-context";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff } from "lucide-react";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "@/lib/firebase";

// ✅ Added imports for role select
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
    role: "", // ✅ includes admin now
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const router = useRouter();




  const Backend_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
  const DASHBOARD_URL = process.env.NEXT_PUBLIC_DASHBOARD_URL || "http://localhost:3001";


  // console.log(Backend_URL)
  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);


  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault();
    setError("");

    if (!isValidEmail(formData.email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (!formData.role) {
      setError("Please select your role");
      return;
    }

    setIsLoading(true);

    try {
      // 1. Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, formData.email.trim(), formData.password);
      const user = userCredential.user;
      const idToken = await user.getIdToken();
      // console.log(user, "user")
      // console.log(idToken, "idtoken")

      // 2. Backend Sync & Session Creation
      const res = await axios.post(
        `${Backend_URL}/api/auth/login-firebase`,
        {
          idToken,
          role: formData.role,
        },
        { withCredentials: true }
      );

      const data = res.data;
      // console.log(data)

      if (!data || !data.user || !data.token) {
        setError("Invalid server response");
        setIsLoading(false);
        return;
      }


      login({
        user: data.user,
        token: data.token,
        expiresAt: Date.now() + 60 * 60 * 1000,
      });



    } catch (err: any) {
      console.error("Login error:", err);
      setError(
        err.response?.data?.message || "An error occurred. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");

    // ✅ Enforce Role Selection
    if (!formData.role) {
      setError("Please select your role first to sign in with Google.");
      return;
    }

    setIsLoading(true);

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const idToken = await user.getIdToken();

      // Backend Sync
      const res = await axios.post(
        `${Backend_URL}/api/auth/login-firebase`,
        {
          idToken,
          role: formData.role, // Now mandatory
        },
        { withCredentials: true }
      );

      const data = res.data;

      if (!data || !data.user || !data.token) {
        setError("Login failed. Please try again.");
        return;
      }

      login({
        user: data.user,
        token: data.token,
        expiresAt: Date.now() + 60 * 60 * 1000,
      });

    } catch (err: any) {
      console.error("Google Login Error:", err);
      if (err.response?.status === 404) {
        setError("Account not found. Please Sign Up first.");
      } else {
        setError(err.response?.data?.message || err.message || "Failed to sign in with Google");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Logo + Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full overflow-hidden flex items-center justify-center mx-auto mb-4 border">
            <Image
              src="/images/logo/D_Black.png"
              alt="Logo"
              width={64}
              height={64}
              className="object-cover"
            />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back to DOLT
          </h1>
          <p className="text-gray-600">Smart maintenance solutions</p>
        </div>

        {/* Login Card */}
        <Card className="border-0 shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-gray-900">Sign In</CardTitle>
            <CardDescription>
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-6">
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}

                {/* Email */}
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="h-12"
                  />
                </div>

                {/* Password */}
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="h-12 pr-10"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                {/* ✅ Role Selector */}
                <div className="grid gap-2">
                  <Label htmlFor="role">Login as</Label>
                  <Select
                    value={formData.role}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, role: value }))
                    }
                  >
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">
                        Property Owner/Manager
                      </SelectItem>
                      <SelectItem value="provider">
                        Service Provider/Technician
                      </SelectItem>
                      <SelectItem value="admin">Admin</SelectItem> {/* ✅ Added */}
                    </SelectContent>
                  </Select>
                </div>

                {/* Remember Me */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2">
                    <Checkbox
                      id="rememberMe"
                      name="rememberMe"
                      checked={formData.rememberMe}
                      onCheckedChange={(checked: boolean) =>
                        setFormData((prev) => ({ ...prev, rememberMe: !!checked }))
                      }
                    />
                    <span className="text-sm text-gray-600">Remember me</span>
                  </label>
                  <Link
                    href="#"
                    className="text-sm text-orange-600 hover:text-orange-700 underline underline-offset-4"
                  >
                    Forgot password?
                  </Link>
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white font-semibold"
                >
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground bg-white">
                      Or continue with
                    </span>
                  </div>
                </div>

                <Button
                  variant="outline"
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                  className="w-full h-12"
                >
                  {isLoading ? (
                    "Loading..."
                  ) : (
                    <>
                      <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                        <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
                      </svg>
                      Sign in with Google
                    </>
                  )}
                </Button>

              </div>

              {/* Footer */}
              <div className="mt-6 text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link
                  href="/signup"
                  className="text-orange-600 hover:text-orange-700 font-semibold underline underline-offset-4"
                >
                  Sign up
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Back to home */}
        <div className="text-center mt-6">
          <Link href="/" className="text-gray-600 hover:text-gray-800 text-sm">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
