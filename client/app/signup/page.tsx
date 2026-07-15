"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { signup } from "@/services/auth";
import { useAuth } from "@/context/AuthProvider";

export default function SignupPage() {
  const router = useRouter();
  const { user, isLoading, refreshUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && user) {
      router.replace("/dashboard");
    }
  }, [isLoading, router, user]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      await signup({ email, password });
      await refreshUser();
      router.replace("/dashboard");
    } catch {
      toast.error("Unable to create account");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-sm"
      >
        <div className="text-center">
          <h1 className="text-3xl font-semibold text-gray-950">
            Create Account
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Sign up to create forms and manage responses.
          </p>
        </div>

        <label className="mt-6 block text-sm font-medium text-gray-700">
          Email
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
          />
        </label>

        <label className="mt-4 block text-sm font-medium text-gray-700">
          Password
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            minLength={8}
            className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
          />
        </label>

        <Button type="submit" className="mt-6 w-full" disabled={isSubmitting}>
          {isSubmitting ? "Creating account..." : "Sign up"}
        </Button>

        <p className="mt-4 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-black underline">
            Login
          </Link>
        </p>
      </form>
    </main>
  );
}
