"use client";

import type React from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import type { UserRole } from "@/lib/db-types";
import { createUserWithEmailAndPassword, updateProfile, GoogleAuthProvider, signInWithPopup, fetchSignInMethodsForEmail } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";

// ✅ International Phone Input
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

export default function SignupPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    role: undefined as UserRole | undefined,
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { login } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const Backend_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
  const DASHBOARD_URL = process.env.NEXT_PUBLIC_DASHBOARD_URL || "http://localhost:3001";

  // console.log("----------------------- DEBUG -----------------------");
  // console.log("Signup Page Loaded");
  // console.log("Backend_URL:", Backend_URL);
  // console.log("DASHBOARD_URL (raw):", process.env.NEXT_PUBLIC_DASHBOARD_URL);
  // console.log("DASHBOARD_URL (final):", DASHBOARD_URL);
  // console.log("-----------------------------------------------------");

  // ✅ Email regex
  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // ✅ Phone Validation using Library
  const isValidPhone = (phone: string) => {
    return phone && isValidPhoneNumber(phone);
  };


  // ... existing imports


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // 🧠 Validation
    if (!isValidEmail(formData.email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (!isValidPhone(formData.phone)) {
      setError("Please enter a valid phone number with country code");
      return;
    }

    if (!formData.role) {
      setError("Please select your role");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      // 1. Firebase Auth - Create User
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      // Update Display Name immediately
      await updateProfile(user, {
        displayName: formData.fullName
      });

      const idToken = await user.getIdToken();

      // 2. Backend Sync & Profile Creation
      const response = await axios.post(
        `${Backend_URL}/api/auth/signup-firebase`,
        {
          idToken,
          role: formData.role,
          fullName: formData.fullName,
          phone: formData.phone,
        },
        { withCredentials: true }
      );

      const data = response.data;

      if (!data || !data.token) {
        setError("Signup failed. Please try again.");
        setIsLoading(false);
        return;
      }

      // Save session
      login({
        user: data.user,
        token: data.token,
        expiresAt: Date.now() + 60 * 60 * 1000, // 1 hour
      });

      // 🧭 Role-based redirect
      // 🧭 Role-based redirect
      const targetUrl = data.role === "user" ? `${DASHBOARD_URL}/user` : `${DASHBOARD_URL}/provider`;
      // console.log("Attempting redirect to:", targetUrl);

      // Attempt redirect
      window.location.href = targetUrl;
      // console.log("Redirect command sent to:", targetUrl);
    } catch (err: any) {
      console.error("Signup error:", err);
      if (err.code === 'auth/email-already-in-use') {
        try {
          const methods = await fetchSignInMethodsForEmail(auth, formData.email);
          if (methods.includes('google.com')) {
            toast({
              title: "Account Exists",
              description: "You already signed up with Google. Please use Google Sign In.",
              variant: "destructive",
            });
            setError("You already have an account with Google. Please sign in with Google.");
          } else {
            toast({
              title: "Account Exists",
              description: "This email is already registered. Please login.",
              variant: "destructive",
            });
            setError("Email is already registered. Please login.");
          }
        } catch (e) {
          setError("Email is already registered. Please login.");
        }
      } else {
        setError(
          err.response?.data?.message || err.message || "An error occurred. Please try again."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setError("");

    if (!formData.role) {
      setError("Please select a role first to sign up with Google.");
      return;
    }

    setIsLoading(true);

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const idToken = await user.getIdToken();

      // Backend Sync & Profile Creation
      const response = await axios.post(
        `${Backend_URL}/api/auth/signup-firebase`,
        {
          idToken,
          role: formData.role,
          fullName: user.displayName || formData.fullName, // Use Google name if available
          phone: formData.phone || undefined,
        },
        { withCredentials: true }
      );

      const data = response.data;

      if (!data || !data.token) {
        setError("Signup failed. Please try again.");
        return;
      }

      // Save session
      login({
        user: data.user,
        token: data.token,
        expiresAt: Date.now() + 60 * 60 * 1000, // 1 hour
      });

      // Redirect based on role
      const targetUrl = data.role === "user" ? `${DASHBOARD_URL}/user` : `${DASHBOARD_URL}/provider`;
      window.location.href = targetUrl;

    } catch (err: any) {
      console.error("Google Signup Error:", err);

      // Handle specific Firebase auth errors
      if (err.code === 'auth/popup-closed-by-user') {
        // User closed the popup - don't show error, just reset state
        setIsLoading(false);
        return;
      } else if (err.code === 'auth/cancelled-popup-request') {
        // Multiple popup requests - ignore
        setIsLoading(false);
        return;
      } else if (err.code === 'auth/popup-blocked') {
        setError("Popup was blocked by your browser. Please allow popups for this site and try again.");
      } else if (err.code === 'auth/account-exists-with-different-credential') {
        toast({
          title: "Account Exists",
          description: "You already have an account with this email using a password. Please login with email and password.",
          variant: "destructive",
        });
        setError("Account already exists. Please login with your email and password.");
      } else if (err.response?.status === 400 && err.response?.data?.message?.includes("already exists")) {
        toast({
          title: "Account Exists",
          description: "Account already exists. Please login instead.",
          variant: "destructive",
        });
        setError("Account already exists. Please login instead.");
      } else {
        setError(err.response?.data?.message || err.message || "Failed to sign up with Google");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleRoleChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      role: value as UserRole,
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
          <h1 className="text-2xl font-bold text-gray-900">Join DOLT</h1>
          <p className="text-gray-600">Smart maintenance solutions</p>
        </div>

        <Card className="border-0 shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-gray-900">
              Create Account
            </CardTitle>
            <CardDescription>
              Sign up to access our maintenance platform
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-4">
                {/* Full Name */}
                <div className="grid gap-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="John Doe"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    className="h-12"
                  />
                </div>

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

                {/* Phone */}
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="phone-input-container">
                    <PhoneInput
                      placeholder="Enter phone number"
                      value={formData.phone}
                      onChange={(value) => setFormData(prev => ({ ...prev, phone: value || '' }))}
                      defaultCountry="IN" // Default to India but allow change
                      className="flex h-12 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>
                </div>

                {/* Role */}
                <div className="grid gap-2">
                  <Label htmlFor="role">I am a</Label>
                  <Select
                    value={formData.role ?? ""}
                    onValueChange={handleRoleChange}
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
                    </SelectContent>
                  </Select>
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
                      minLength={6}
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

                {/* Confirm Password */}
                <div className="grid gap-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      className="h-12 pr-10"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={20} />
                      ) : (
                        <Eye size={20} />
                      )}
                    </button>
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}

                {/* Submit */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white font-semibold"
                >
                  {isLoading ? "Creating account..." : "Create Account"}
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
                  onClick={handleGoogleSignup}
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
                      Sign up with Google
                    </>
                  )}
                </Button>
              </div>

              {/* Footer */}
              <div className="mt-6 text-center text-sm">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-orange-600 hover:text-orange-700 font-semibold underline underline-offset-4"
                >
                  Sign in
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
