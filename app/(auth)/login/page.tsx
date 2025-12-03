"use client";

import { useState, FormEvent } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Image from "next/image";
import logoNoBG from "@/app/component/logoWhitenb.png";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      return;
    }

    router.push("/dashboard");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center p-4 relative">
      {/* Glow background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(16,185,129,0.1),transparent_60%)]" />

      <div className="w-full max-w-md relative z-10">
        <div className="backdrop-blur-xl bg-gray-900/50 border border-gray-800 rounded-2xl p-8 shadow-2xl">

          {/* Logo */}
          <div className="flex justify-center mb-1">
            <Image
              src={logoNoBG}
              alt="UdinXplore Logo"
              width={220}
              height={220}
              className="opacity-90"
              priority
            />
          </div>

          {/* Title */}
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-white mb-1">Selamat Datang</h1>
            <p className="text-gray-400">Masuk untuk mengelola keuangan Anda</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <p className="text-red-400 text-sm text-center bg-red-900/30 p-2 rounded">
                {error}
              </p>
            )}

            {/* Email */}
            <div className="space-y-1">
              <label className="text-gray-300 text-sm">Email</label>
              <input
                type="email"
                placeholder="udin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-3 text-white placeholder-gray-500 focus:border-emerald-500 focus:ring-emerald-500/20 outline-none"
              />
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="text-gray-300 text-sm">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-3 text-white placeholder-gray-500 focus:border-emerald-500 focus:ring-emerald-500/20 pr-10 outline-none"
                />

                {/* Toggle password */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10 10 0 0112 19c-5.523 0-10-4.477-10-10 0-.91.122-1.79.35-2.625M21.65 9.375A9.958 9.958 0 0122 12c0 5.523-4.477 10-10 10-.947 0-1.865-.132-2.737-.378M4.222 4.222l15.556 15.556" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1.458 12C2.732 7.943 6.815 5 12 5c5.184 0 9.268 2.943 10.542 7-1.274 4.057-5.358 7-10.542 7-5.185 0-9.268-2.943-10.542-7z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-xl font-medium transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/20"
            >
              Masuk
            </button>
          </form>

          {/* Register redirect */}
          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              Belum punya akun?{" "}
              <a href="/register" className="text-emerald-400 hover:text-emerald-300 font-medium">
                Daftar sekarang
              </a>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
