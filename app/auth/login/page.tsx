"use client";
import { account } from "@/lib/appwrite";
import { OAuthProvider } from "appwrite";
import { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleEmailLogin = async () => {
    try {
      await account.createSession(email, password);
      window.location.reload(); // Refresh to reflect login
    } catch (err) {
      console.error(err); // Log the error
      setError("Invalid credentials. Please try again.");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await account.createOAuth2Session("google" as OAuthProvider, "http://localhost:3000");
    } catch (err) {
      console.error("Google login failed:", err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <input
        type="email"
        placeholder="Email"
        className="border p-2 rounded"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        className="border p-2 rounded"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        onClick={handleEmailLogin}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Login with Email
      </button>

      <button
        onClick={handleGoogleLogin}
        className="bg-red-500 text-white px-4 py-2 rounded"
      >
        Login with Google
      </button>

      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}
