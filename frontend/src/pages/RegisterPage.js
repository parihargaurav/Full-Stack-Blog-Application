/* eslint-disable jsx-a11y/anchor-is-valid */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiUrl } from "../config";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  async function register(ev) {
    ev.preventDefault();
    const response = await fetch(apiUrl("/register"), {
      method: "POST",
      body: JSON.stringify({ username, password }),
      headers: { "Content-Type": "application/json" },
    });

    if (response.status === 200) {
      setDialogMessage("Registration successful. Please login to continue.");
      setIsSuccess(true);
      setShowDialog(true);
    } else {
      setDialogMessage("Registration failed. Please check your details and try again.");
      setIsSuccess(false);
      setShowDialog(true);
    }
  }

  const closeDialog = () => setShowDialog(false);
  const goToLogin = () => navigate("/login");
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

      {showDialog ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-xl">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              {isSuccess ? "Success" : "Registration error"}
            </h2>
            <p className="text-sm text-gray-600 mb-6">{dialogMessage}</p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={closeDialog}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors duration-200"
              >
                Close
              </button>
              {isSuccess ? (
                <button
                  type="button"
                  onClick={goToLogin}
                  className="px-4 py-2 bg-gray-900 text-white rounded-xl hover:bg-black transition-colors duration-200"
                >
                  Login
                </button>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  </div>
  );
}
