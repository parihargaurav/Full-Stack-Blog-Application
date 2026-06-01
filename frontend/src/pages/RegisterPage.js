/* eslint-disable jsx-a11y/anchor-is-valid */
import { useState } from "react";
import { apiUrl } from "../config";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  async function register(ev) {
    ev.preventDefault();
    const response = await fetch(apiUrl("/register"), {
      method: "POST",
      body: JSON.stringify({ username, password }),
      headers: { "Content-Type": "application/json" },
    });
    if (response.status === 200) {
      alert("registration successful");
    } else {
      alert("registration failed");
    }
  }
  return (
  <div className="min-h-screen bg-white flex items-center justify-center px-4">
    <div className="w-full max-w-sm">

      {/* Logo / Brand */}
      <div className="text-center mb-10">
        <h1 className="text-5xl font-bold tracking-tight text-gray-900"
            style={{ fontFamily: 'Georgia, serif' }}>
          📝
        </h1>
        <p className="mt-3 text-gray-500 text-sm tracking-widest uppercase">
          Join the community
        </p>
      </div>

      {/* Card */}
      <div className="border border-gray-200 rounded-2xl px-8 py-10 shadow-sm">
        <h2 className="text-2xl font-semibold text-gray-900 mb-1"
            style={{ fontFamily: 'Georgia, serif' }}>
          Create your account
        </h2>
        <p className="text-sm text-gray-600 mb-8">
          Start reading and writing today.
        </p>

        <form className="space-y-5" onSubmit={register}>

          {/* Username */}
          <div className="group">
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-widest mb-2">
              Username
            </label>
            <input
              type="text"
              placeholder="yourname"
              value={username}
              onChange={(ev) => setUsername(ev.target.value)}
              className="w-full px-4 py-3 text-sm text-gray-900 bg-gray-50 border border-gray-200 rounded-xl placeholder-gray-300 focus:outline-none focus:border-gray-900 focus:bg-white transition-all duration-200"
            />
          </div>

          {/* Password */}
          <div className="group">
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-widest mb-2">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(ev) => setPassword(ev.target.value)}
              className="w-full px-4 py-3 text-sm text-gray-900 bg-gray-50 border border-gray-200 rounded-xl placeholder-gray-300 focus:outline-none focus:border-gray-900 focus:bg-white transition-all duration-200"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full mt-2 py-3 px-4 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-black transition-colors duration-200 tracking-wide"
          >
            Register
          </button>

        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 border-t border-gray-100" />
          <span className="px-3 text-xs text-gray-300">or</span>
          <div className="flex-1 border-t border-gray-100" />
        </div>

        <p className="text-center text-sm text-gray-600">
          Already have an account?{' '}
          <a href="/login" className="text-gray-900 font-medium underline underline-offset-2 hover:text-black">
            Login
          </a>
        </p>
      </div>

      

    </div>
  </div>
);
}
