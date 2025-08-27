

import { useAuth } from "@/hooks/useAuth";
import React, { useState } from "react";

function UserIcon() {
  return (
    <svg
      className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16 14a4 4 0 01-8 0m8 0a4 4 0 01-8 0m8 0V7a4 4 0 10-8 0v7m8 0H8"
      ></path>
    </svg>
  );
}
function LockIcon() {
  return (
    <svg
      className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 17v.01M17 11V7a5 5 0 00-10 0v4m12 0a2 2 0 012 2v6a2 2 0 01-2 2H7a2 2 0 01-2-2v-6a2 2 0 012-2h10z"
      ></path>
    </svg>
  );
}

export default function Login({ onSignupClick }: { onSignupClick?: () => void }) {
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    try {
      await login(email, password);
      const userId = localStorage.getItem("_id");
      if (userId) {
        localStorage.setItem("userId", userId);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="container-login animate-slide-in">
        <div className="form-box">
          <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-3xl font-bold text-white mb-2 text-center">
              Login
            </h2>
            <div className="text-center text-gray-300 mb-4">Welcome Back!</div>
            {error && (
              <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-2 text-sm text-center border border-red-200">
                {error}
              </div>
            )}
            <div className="input-box">
              <input
                type="email"
                name="email"
                placeholder="Username"
                required
                autoComplete="username"
              />
              <UserIcon />
            </div>
            <div className="input-box">
              <input
                type="password"
                name="password"
                placeholder="Password"
                required
                autoComplete="new-password"
              />
              <LockIcon />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 rounded-lg font-semibold transition ${
                isLoading
                  ? "bg-gradient-to-r from-[#25d7eb] to-[#1a9fc2] text-white cursor-not-allowed"
                  : "bg-gradient-to-r from-[#25d7eb] to-[#1a9fc2] text-white hover:from-[#1a9fc2] hover:to-[#25d7eb] shadow-md"
              }`}
              style={{
                boxShadow: "0 0 15px #25d7eb",
                border: "none",
                fontWeight: 600,
                fontSize: "18px",
              }}
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
            <div className="text-center mt-4">
              <span className="text-gray-400">Don't have an account? </span>
              <button
                type="button"
                className="text-[#25d7eb] font-semibold hover:underline transition bg-transparent border-none cursor-pointer"
                onClick={onSignupClick}
              >
                Sign Up
              </button>
            </div>
          </form>
        </div>
        <div className="welcome-box">
          <h2 className="text-3xl font-bold text-white mb-2">
            WELCOME BACK!
          </h2>
          <p className="text-gray-200">
            We are happy to have you with us again. If you need anything, we are
            here to help.
          </p>
        </div>
      </div>
      <style>
        {`
         .container-login {
            position: relative;
            width: 800px;
            height: 810px;
            border: 2px solid #25d7eb;
            box-shadow: 0 0 25px #25d7eb;
            overflow: hidden;
            background: linear-gradient(120deg, #111 60%, #25d7eb 100%);
            display: flex;
          }
          .form-box {
            position: absolute;
            top: 0;
            left: 0;
            width: 50%;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            padding: 40px;
            background: rgba(10,10,10,0.98);
            z-index: 2;
          }
          .welcome-box {
            position: absolute;
            right: 0;
            top: 0;
            width: 50%;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding: 40px;
            background: linear-gradient(120deg, #25d7eb 60%, #111 100%);
            color: #25d7eb;
            z-index: 1;
          }
          .input-box {
            position: relative;
            width: 100%;
            height: 50px;
            margin-top: 25px;
          }
          .input-box input {
            width: 100%;
            height: 100%;
            background: transparent;
            border: none;
            outline: none;
            font-size: 16px;
            color: #25d7eb;
            font-weight: 600;
            border-bottom: 2px solid #25d7eb;
            padding-right: 23px;
            padding-left: 90px; 
            transition: .5s;
            box-sizing: border-box;
          }
          .input-box input:focus {
            border-bottom: 2px solid #25d7eb;
          }
          .input-box svg {
            position: absolute;
            left: 1px; 
            top: 20%;
            transform: translateY(-50%);
            pointer-events: none;
            color: #25d7eb;
          }
          .animate-slide-in {
            animation: slide-in 0.7s cubic-bezier(.68,-0.55,.27,1.55);
          }
          @keyframes slide-in {
            from { opacity: 0; transform: translateY(-40px);}
            to { opacity: 1; transform: translateY(0);}
          }
        `}
      </style>
    </div>
  );
}

