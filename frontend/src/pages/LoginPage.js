import { useContext, useState } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../UserContext";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState(false);
  const { setUserInfo } = useContext(UserContext);
  async function login(ev) {
    ev.preventDefault();
    const response = await fetch("http://localhost:4000/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    if (response.ok) {
      response.json().then((userInfo) => {
        setUserInfo(userInfo);
        setRedirect(true);
      });
    } else {
      alert("wrong credentials");
    }
  }

  if (redirect) {
    return <Navigate to={"/"} />;
  }
  return (
  <div className="min-h-screen bg-white flex items-center justify-center px-4">
    <div className="w-full max-w-sm">

      {/* Logo / Brand */}
      <div className="text-center mb-10">
        <h1 className="text-5xl font-bold tracking-tight text-gray-900">
          📍
        </h1>
        <p className="mt-3 text-gray-500 text-sm tracking-widest uppercase">
          Welcome back
        </p>
      </div>

      {/* Card */}
      <div className="border border-gray-200 rounded-2xl px-8 py-10 shadow-sm">
        <h2 className="text-2xl font-semibold text-gray-900 mb-1"
            style={{ fontFamily: 'Georgia, serif' }}>
          Sign in to your account
        </h2>
        <p className="text-sm text-gray-600 mb-8">
          Continue your reading journey.
        </p>

        <form className="space-y-5" onSubmit={login}>

          {/* Username */}
          <div>
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
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-widest">
                Password
              </label>
              
            </div>
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
            Login
          </button>

        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 border-t border-gray-100" />
          <span className="px-3 text-xs text-gray-300">or</span>
          <div className="flex-1 border-t border-gray-100" />
        </div>

        <p className="text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <a href="/register" className="text-gray-900 font-medium underline underline-offset-2 hover:text-black">
            Create one
          </a>
        </p>
      </div>

      

    </div>
  </div>
);
}
