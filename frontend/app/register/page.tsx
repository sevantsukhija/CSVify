"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Database,
  Eye,
  EyeOff,
  KeyRound,
  Mail,
  User,
  ShieldCheck,
} from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();

  const [step, setStep] = useState<"register" | "otp">(
    "register"
  );

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleBack = () => {
    if (step === "otp") {
      setStep("register");
      setOtp("");
      setError("");
      setMessage("");
      return;
    }

    router.back();
  };

  const handleGoogleSignup = () => {
    alert(
      "Google Sign-Up will be connected after Google OAuth credentials are added."
    );
  };

  const handleRegister = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setError("");
    setMessage("");

    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }

    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }

    if (!password) {
      setError("Please enter a password.");
      return;
    }

    if (password.length < 6) {
      setError(
        "Password must be at least 6 characters."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://127.0.0.1:8000/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim(),
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.detail ||
            "Could not create account."
        );
        return;
      }

      setStep("otp");

      if (data.email_sent) {
        setMessage(
          `A 6-digit OTP has been sent to ${email.trim()}.`
        );
      } else {
        setMessage(
          "OTP could not be sent by email. Check the backend terminal for the OTP."
        );
      }
    } catch (error) {
      console.error(error);

      setError(
        "Cannot connect to server. Please make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setError("");
    setMessage("");

    if (!/^\d{6}$/.test(otp)) {
      setError("Enter the 6-digit OTP.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://127.0.0.1:8000/auth/verify-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
            otp,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.detail ||
            "OTP verification failed."
        );
        return;
      }

      alert(
        "Email verified successfully! You can now log in with your password."
      );

      router.push("/login");
    } catch (error) {
      console.error(error);

      setError(
        "Cannot connect to server. Please make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#020617] px-4 py-10 text-white">

      {/* Background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-cyan-500/10 blur-[130px]" />

        <div className="absolute -right-40 top-[30%] h-[500px] w-[500px] rounded-full bg-blue-500/10 blur-[130px]" />

        <div className="absolute bottom-[-200px] left-[35%] h-[500px] w-[500px] rounded-full bg-purple-500/10 blur-[130px]" />
      </div>

      {/* Back */}
      <button
        type="button"
        onClick={handleBack}
        aria-label="Go back"
        className="group absolute left-5 top-5 z-30 flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-cyan-400/40 hover:bg-cyan-400/10 hover:text-cyan-400 sm:left-8 sm:top-8"
      >
        <ArrowLeft className="h-5 w-5 transition-transform duration-300 group-hover:-translate-x-1" />
      </button>

      {/* Card */}
      <div className="relative z-10 w-full max-w-md">
        <div className="rounded-3xl border border-white/10 bg-[#07111f]/95 p-7 shadow-2xl shadow-cyan-500/10 backdrop-blur-xl sm:p-9">

          {/* Logo */}
          <div className="mb-7 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-500 shadow-xl shadow-cyan-500/20 transition-all duration-300 hover:scale-110 hover:rotate-3">
              {step === "otp" ? (
                <ShieldCheck className="h-8 w-8 text-white" />
              ) : (
                <Database className="h-8 w-8 text-white" />
              )}
            </div>
          </div>

          {/* REGISTER */}
          {step === "register" && (
            <>
              <div className="text-center">
                <h1 className="text-3xl font-black tracking-tight">
                  Create Account
                </h1>

                <p className="mt-2 text-sm text-slate-500">
                  Create your CSVify account
                </p>
              </div>

              <form
                onSubmit={handleRegister}
                className="mt-8 space-y-5"
              >

                {/* Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-semibold text-slate-200"
                  >
                    Full Name
                  </label>

                  <div className="relative">
                    <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-600" />

                    <input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) =>
                        setName(e.target.value)
                      }
                      placeholder="Enter your name"
                      className="w-full rounded-xl border border-white/10 bg-white/5 py-3.5 pl-12 pr-4 text-white outline-none transition-all placeholder:text-slate-600 focus:border-cyan-400/60 focus:bg-white/[0.07] focus:ring-2 focus:ring-cyan-400/10"
                    />
                  </div>
                </div>

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
                      type="email"
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
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      value={password}
                      onChange={(e) =>
                        setPassword(e.target.value)
                      }
                      placeholder="Create a password"
                      className="w-full rounded-xl border border-white/10 bg-white/5 py-3.5 pl-12 pr-12 text-white outline-none transition-all placeholder:text-slate-600 focus:border-cyan-400/60 focus:bg-white/[0.07] focus:ring-2 focus:ring-cyan-400/10"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(!showPassword)
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-cyan-400"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm */}
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="mb-2 block text-sm font-semibold text-slate-200"
                  >
                    Confirm Password
                  </label>

                  <div className="relative">
                    <KeyRound className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-600" />

                    <input
                      id="confirmPassword"
                      type={
                        showConfirmPassword
                          ? "text"
                          : "password"
                      }
                      value={confirmPassword}
                      onChange={(e) =>
                        setConfirmPassword(
                          e.target.value
                        )
                      }
                      placeholder="Confirm your password"
                      className="w-full rounded-xl border border-white/10 bg-white/5 py-3.5 pl-12 pr-12 text-white outline-none transition-all placeholder:text-slate-600 focus:border-cyan-400/60 focus:bg-white/[0.07] focus:ring-2 focus:ring-cyan-400/10"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(
                          !showConfirmPassword
                        )
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-cyan-400"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="group flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-500 px-5 py-3.5 font-bold text-white shadow-lg shadow-cyan-500/20 transition-all duration-300 hover:-translate-y-1 hover:bg-cyan-400 disabled:opacity-60"
                >
                  {loading ? (
                    "Creating account..."
                  ) : (
                    <>
                      Create Account
                      <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
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

              {/* Google */}
              <button
                type="button"
                onClick={handleGoogleSignup}
                className="flex w-full items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/5 px-5 py-3.5 font-semibold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-white/10"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-sm font-black">
                  <span className="bg-gradient-to-r from-blue-500 via-red-500 to-green-500 bg-clip-text text-transparent">
                    G
                  </span>
                </span>

                Sign up with Google
              </button>

              <div className="mt-7 text-center text-sm text-slate-500">
                Already have an account?{" "}

                <button
                  type="button"
                  onClick={() => router.push("/login")}
                  className="font-bold text-cyan-400 hover:text-cyan-300"
                >
                  Sign In
                </button>
              </div>
            </>
          )}

          {/* OTP */}
          {step === "otp" && (
            <>
              <div className="text-center">
                <h1 className="text-3xl font-black tracking-tight">
                  Verify Your Email
                </h1>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                  We sent a 6-digit verification code to
                </p>

                <p className="mt-1 break-all text-sm font-semibold text-cyan-400">
                  {email}
                </p>
              </div>

              {message && (
                <div className="mt-6 rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-3 text-center text-sm leading-6 text-cyan-300">
                  {message}
                </div>
              )}

              <form
                onSubmit={handleVerifyOTP}
                className="mt-7 space-y-5"
              >
                <div>
                  <label
                    htmlFor="otp"
                    className="mb-2 block text-sm font-semibold text-slate-200"
                  >
                    Verification OTP
                  </label>

                  <input
                    id="otp"
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={otp}
                    onChange={(e) =>
                      setOtp(
                        e.target.value
                          .replace(/\D/g, "")
                          .slice(0, 6)
                      )
                    }
                    placeholder="Enter 6-digit OTP"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-4 text-center text-2xl font-bold tracking-[0.5em] text-white outline-none transition-all placeholder:text-slate-600 placeholder:tracking-normal focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/10"
                  />
                </div>

                {error && (
                  <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="group flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-500 px-5 py-3.5 font-bold text-white shadow-lg shadow-cyan-500/20 transition-all duration-300 hover:-translate-y-1 hover:bg-cyan-400 disabled:opacity-60"
                >
                  {loading ? (
                    "Verifying..."
                  ) : (
                    <>
                      Verify Email
                      <ShieldCheck className="h-5 w-5 transition-transform group-hover:scale-110" />
                    </>
                  )}
                </button>
              </form>

              <p className="mt-6 text-center text-xs leading-5 text-slate-600">
                The OTP is valid for 10 minutes.
              </p>
            </>
          )}

          {/* Bottom */}
          <button
            type="button"
            onClick={() => router.push("/")}
            className="mx-auto mt-6 flex items-center gap-2 text-sm font-semibold text-slate-600 transition-colors hover:text-cyan-400"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </button>

        </div>
      </div>
    </main>
  );
}