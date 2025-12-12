"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { supabaseBrowser } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const { data, error } = await supabaseBrowser.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6 text-center">Welcome Back</h1>

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <Label>Email</Label>
          <Input type="email" name="email" required />
        </div>

        <div>
          <Label>Password</Label>
          <Input type="password" name="password" required />
        </div>

        {errorMsg && (
          <p className="text-red-500 text-sm">{errorMsg}</p>
        )}

        <Button className="w-full" disabled={loading}>
          {loading ? "Signing in..." : "Login"}
        </Button>
      </form>

      <p className="text-center mt-4 text-sm text-gray-600">
        Don't have an account?{" "}
        <a href="/auth/register" className="text-blue-600 hover:underline">
          Create one
        </a>
      </p>
    </div>
  );
}
