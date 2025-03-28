"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  CardFooter,
  Card,
} from "@/components/ui/card";
import { motion } from "framer-motion";
import { MainNav } from "@/components/main-nav";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  // Redirect to login if user is not logged in
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/login"); // Redirect to login if no user is found
    }
  }, [router]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // Retrieve user data from localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);

      // Verify email and password
      if (user.email === email && user.password === password) {
        alert("Login successful!");
        localStorage.setItem("isLoggedIn", "true"); // Mark user as logged in
        router.push("/"); // Redirect to localhost:3000 (home page)
      } else {
        alert("Invalid email or password!");
        router.push("/signup"); // Redirect to signup page
      }
    } else {
      alert("No user found! Please sign up first.");
      router.push("/signup"); // Redirect to signup page
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="border-b">
        <div className="flex flex-col items-center px-4 py-6">
          <MainNav />
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="mx-auto max-w-sm">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Login</CardTitle>
              <CardDescription className="text-center">
                Enter your credentials to access your account
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleLogin}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-3">
                {/* Login Button */}
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full"
                >
                  <Button type="submit" className="w-full">
                    Login
                  </Button>
                </motion.div>

                {/* SignUp Prompt */}
                <p className="text-center text-sm text-gray-600">
                  Don't have an account?
                </p>

                {/* SignUp Button */}
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full"
                >
                  <Button
                    className="w-full bg-blue-500 hover:bg-blue-600"
                    onClick={() => router.push("/signup")}
                  >
                    SignUp Page
                  </Button>
                </motion.div>
              </CardFooter>
            </form>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}