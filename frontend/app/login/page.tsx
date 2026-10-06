"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Database,
  Eye,
  EyeOff,
  KeyRound,
  Mail,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  // ---------------------------------------------------------
  // HANDLE GOOGLE LOGIN CALLBACK
  // ---------------------------------------------------------

  useEffect(() => {
    const googleSuccess =
      searchParams.get("google_success");

    const googleToken =
      searchParams.get("token");

    const googleUser =
      searchParams.get("user");

    if (
      googleSuccess === "true" &&
      googleToken &&
      googleUser
    ) {
      try {
        const decodedUser = JSON.parse(
          decodeURIComponent(googleUser)
        );

        localStorage.setItem(
          "dataTrustAuthToken",
          googleToken
        );

        localStorage.setItem(
          "dataTrustUser",
          JSON.stringify(decodedUser)
        );

        localStorage.setItem(
          "dataTrustLoggedIn",
          "true"
        );

        localStorage.setItem(
          "dataTrustLoginMethod",
          "google"
        );

        router.replace("/dashboard");
      } catch (error) {
        console.error(
          "Google callback error:",
          error
        );

        setError(
          "Google login completed, but user information could not be processed."
        );
      }
    }
  }, [searchParams, router]);

  // ---------------------------------------------------------
  // BACK
  // ---------------------------------------------------------

  const handleBack = () => {
    router.back();
  };

  // ---------------------------------------------------------
  // GOOGLE LOGIN
  // ---------------------------------------------------------

  const handleGoogleLogin = () => {
    setError("");
    setGoogleLoading(true);

    window.location.href =
      "http://127.0.0.1:8000/auth/google";
  };

  // ---------------------------------------------------------
  // NORMAL LOGIN
  // ---------------------------------------------------------

  const handleLogin = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setError("");

    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://127.0.0.1:8000/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
            password,
          }),
        }
      );

      let data: {
        detail?: string;
        access_token?: string;
        user?: unknown;
      } = {};

      try {
        data = await response.json();
      } catch {
        data = {};
      }

      if (!response.ok) {
        setError(
          data.detail ||
            "Invalid email or password."
        );
        return;
      }

      localStorage.setItem(
        "dataTrustAuthToken",
        data.access_token || ""
      );

      localStorage.setItem(
        "dataTrustUser",
        JSON.stringify(data.user || {})
      );

      localStorage.setItem(
        "dataTrustLoggedIn",
        "true"
      );

      localStorage.setItem(
        "dataTrustLoginMethod",
        "password"
      );

      if (rememberMe) {
        localStorage.setItem(
          "dataTrustRememberMe",
          "true"
        );
      } else {
        localStorage.removeItem(
          "dataTrustRememberMe"
        );
      }

      router.push("/dashboard");
    } catch (err) {
      console.error(err);

      setError(
        "Cannot connect to server. Please make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------------------------
  // UI
  // ---------------------------------------------------------

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#020617] px-4 py-10 text-white">

      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">

        <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-cyan-500/10 blur-[130px]" />

        <div className="absolute -right-40 top-[30%] h-[500px] w-[500px] rounded-full bg-blue-500/10 blur-[130px]" />

        <div className="absolute bottom-[-200px] left-[35%] h-[500px] w-[500px] rounded-full bg-purple-500/10 blur-[130px]" />

      </div>

      {/* Back button */}
      <button
        type="button"
        onClick={handleBack}
        aria-label="Go back"
        className="group absolute left-5 top-5 z-30 flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-cyan-400/40 hover:bg-cyan-400/10 hover:text-cyan-400 sm:left-8 sm:top-8"
      >
        <ArrowLeft className="h-5 w-5 transition-transform duration-300 group-hover:-translate-x-1" />
      </button>

      {/* Login card */}
      <div className="relative z-10 w-full max-w-md">

        <div className="rounded-3xl border border-white/10 bg-[#07111f]/95 p-7 shadow-2xl shadow-cyan-500/10 backdrop-blur-xl sm:p-9">

          {/* Logo */}
          <div className="mb-7 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-500 shadow-xl shadow-cyan-500/20 transition-all duration-300 hover:scale-110 hover:rotate-3">
              <Database className="h-8 w-8 text-white" />
            </div>
          </div>

          {/* Heading */}
          <div className="text-center">

            <h1 className="text-3xl font-black tracking-tight">
              Welcome Back
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Sign in to your CSVify account
            </p>

          </div>

          {/* Login Form */}
          <form
            onSubmit={handleLogin}
            className="mt-8 space-y-5"
          >

            {/* Email */}
            <div>

              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold text-slate-200"
              >
                Email
              </label>

              <div className="relative">

                <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-600" />

                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  placeholder="Enter your email"
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-3.5 pl-12 pr-4 text-white outline-none transition-all placeholder:text-slate-600 focus:border-cyan-400/60 focus:bg-white/[0.07] focus:ring-2 focus:ring-cyan-400/10"
                />

              </div>

            </div>

            {/* Password */}
            <div>

              <label
                htmlFor="password"
                className="mb-2 block text-sm font-semibold text-slate-200"
              >
                Password
              </label>

              <div className="relative">

                <KeyRound className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-600" />

                <input
                  id="password"
                  name="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  placeholder="Enter your password"
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-3.5 pl-12 pr-12 text-white outline-none transition-all placeholder:text-slate-600 focus:border-cyan-400/60 focus:bg-white/[0.07] focus:ring-2 focus:ring-cyan-400/10"
                />

                <button
                  type="button"
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 transition-colors hover:text-cyan-400"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>

              </div>

            </div>

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between">

              <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-500">

                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) =>
                    setRememberMe(
                      e.target.checked
                    )
                  }
                  className="h-4 w-4 accent-cyan-500"
                />

                Remember me

              </label>

              <button
                type="button"
                onClick={() => {
                  alert(
                    "Forgot password functionality will be added later."
                  );
                }}
                className="text-sm font-semibold text-cyan-400 transition-colors hover:text-cyan-300"
              >
                Forgot password?
              </button>

            </div>

            {/* Error */}
            {error && (
              <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm leading-6 text-red-400">
                {error}
              </div>
            )}

            {/* Sign In */}
            <button
              type="submit"
              disabled={loading || googleLoading}
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-500 px-5 py-3.5 font-bold text-white shadow-lg shadow-cyan-500/20 transition-all duration-300 hover:-translate-y-1 hover:bg-cyan-400 hover:shadow-cyan-500/30 disabled:cursor-not-allowed disabled:opacity-60"
            >

              {loading ? (
                "Signing in..."
              ) : (
                <>
                  Sign In

                  <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                </>
              )}

            </button>

          </form>

          {/* OR */}
          <div className="my-6 flex items-center gap-4">

            <div className="h-px flex-1 bg-white/10" />

            <span className="text-xs font-bold uppercase tracking-widest text-slate-600">
              OR
            </span>

            <div className="h-px flex-1 bg-white/10" />

          </div>

          {/* Google Sign In */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={googleLoading}
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/5 px-5 py-3.5 font-semibold text-white transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/10 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
          >

            <span
              className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-sm font-black"
              aria-hidden="true"
            >
              <span className="bg-gradient-to-r from-blue-500 via-red-500 to-green-500 bg-clip-text text-transparent">
                G
              </span>
            </span>

            {googleLoading
              ? "Connecting to Google..."
              : "Sign in with Google"}

          </button>

          {/* Create account */}
          <div className="mt-7 text-center text-sm text-slate-500">

            Don't have an account?{" "}

            <button
              type="button"
              onClick={() =>
                router.push("/register")
              }
              className="font-bold text-cyan-400 transition-colors hover:text-cyan-300"
            >
              Create account
            </button>

          </div>

          {/* Back Home */}
          <button
            type="button"
            onClick={() => router.push("/")}
            className="mx-auto mt-5 flex items-center gap-2 text-sm font-semibold text-slate-600 transition-colors hover:text-cyan-400"
          >

            <ArrowLeft className="h-4 w-4" />

            Back to Home

          </button>

        </div>

      </div>

    </main>
  );
}