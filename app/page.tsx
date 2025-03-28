"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { MainNav } from "@/components/main-nav";
import { UserNav } from "@/components/user-nav";
import { QueryValidator } from "@/components/query-validator";

export default function Home() {
  const router = useRouter();

  // Redirect to login if user is not logged in
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (!isLoggedIn) {
      router.push("/login"); // Redirect to login page
    }
  }, [router]);

  return (
    <div className="flex min-h-screen flex-col">
      <div className="border-b">
        <div className="flex flex-col items-center px-4 py-6">
          <MainNav />
          <div className="flex items-center space-x-4 mt-4">
            <UserNav />
          </div>
        </div>
      </div>
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="grid gap-4">
          <QueryValidator />
        </div>
      </div>
    </div>
  );
}