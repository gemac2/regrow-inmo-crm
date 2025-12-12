"use client";

import { useState } from "react";
import { supabaseBrowser } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const { data, error } = await supabaseBrowser.auth.signUp({
      email,
      password,
    });

    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
      return;
    }

    // Redirige al login si el correo requiere confirmación
    router.push("/auth/login");
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6 text-center">Create an Account</h1>

      <form onSubmit={handleRegister} className="space-y-4">
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
          {loading ? "Creating account..." : "Create account"}
        </Button>
      </form>

      <p className="text-center mt-4 text-sm text-gray-600">
        Already have an account?{" "}
        <a href="/auth/login" className="text-blue-600 hover:underline">
          Log in
        </a>
      </p>
    </div>
  );
}
