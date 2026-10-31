
"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("Invalid email or password.");
        return;
      }

      if (res?.ok) {
        router.push("/admin");
        router.refresh();
      } else {
        setError("Unable to sign in. Please try again.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#FAFAF8] px-4 py-10">
      <div className="w-full max-w-md">
        {/* Logo and heading */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center">
  <Image
    src="/ijp.jpg"
    alt="Ife Journal of Politics logo"
    width={200}
    height={200}
    priority
    className="h-full w-full object-contain"
  />
</div>

          <h1 className="font-serif text-3xl font-bold tracking-wide text-[#0B1F3A]">
            Ife Journal
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Editorial Administration Portal
          </p>
        </div>

        {/* Login form */}
        <form
          onSubmit={handleLogin}
          className="rounded-2xl border border-slate-200 bg-white p-8 shadow-lg sm:p-10"
        >
          <div className="mb-7">
            <h2 className="text-xl font-semibold text-[#0B1F3A]">
              Admin Login
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Sign in to manage journal content and publications.
            </p>
          </div>

          {error && (
            <div
              role="alert"
              className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {error}
            </div>
          )}

          {/* Email */}
          <div className="mb-5">
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-[#0B1F3A]"
            >
              Email address
            </label>

            <input
              id="email"
              type="email"
              autoComplete="username"
              placeholder="admin@example.com"
              required
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#D5B36A] focus:ring-2 focus:ring-[#D5B36A]/20"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password */}
          <div className="mb-7">
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-[#0B1F3A]"
            >
              Password
            </label>

            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Enter your password"
                required
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 pr-12 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#D5B36A] focus:ring-2 focus:ring-[#D5B36A]/20"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-pressed={showPassword}
                className="absolute inset-y-0 right-0 flex items-center justify-center px-4 text-slate-500 transition hover:text-[#0B1F3A] focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#D5B36A]"
              >
                {showPassword ? (
                  /* Eye off */
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M3 3l18 18" />
                    <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
                    <path d="M9.9 5.2A10.8 10.8 0 0 1 12 5c5.5 0 9 7 9 7a15.8 15.8 0 0 1-3 3.8" />
                    <path d="M6.2 6.2C3.9 7.7 3 12 3 12s3.5 7 9 7a10.8 10.8 0 0 0 4.1-.8" />
                  </svg>
                ) : (
                  /* Eye */
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[#0B1F3A] px-4 py-3.5 font-semibold text-white transition hover:bg-[#16375D] focus:outline-none focus:ring-2 focus:ring-[#D5B36A] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

          {/* Footer */}
          <div className="mt-7 border-t border-slate-100 pt-5 text-center">
            <p className="text-xs text-slate-500">
              Ife Journal of Politics
              <span className="mx-2 text-[#D5B36A]">·</span>
              Editorial Administration
            </p>
          </div>
        </form>
      </div>
    </main>
  );
}
