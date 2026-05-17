/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/anchor-is-valid */
import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "./UserContext";

export default function Header() {
  const { setUserInfo, userInfo } = useContext(UserContext);
  useEffect(() => {
    fetch("http://localhost:4000/profile", {
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) {
          if (response.status === 401) {
            setUserInfo(null); // treat as guest
            return;
          }
          throw new Error(`HTTP error: ${response.status}`);
        }
        return response.json();
      })
      .then((userInfo) => {
        setUserInfo(userInfo);
      })
      .catch((err) => {
        if (!err.message.includes("401")) {
          //  replace the console.error with this
          console.error("Profile fetch error", err);
        }
        setUserInfo(null);
      });
  }, [setUserInfo]);

  function logout() {
    fetch("http://localhost:4000/logout", {
      credentials: "include",
      method: "POST",
    });
    setUserInfo(null);
  }

  const username = userInfo?.username;

  return (
    <header className="border-b bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        {/* Left Side */}
        <Link to="/" aria-label="Go to homepage" className="text-3xl font-bold tracking-tight text-black">
          🏠
        </Link>

        {/* Right Side */}
        <nav className="flex items-center gap-6 text-sm font-medium text-gray-700">
          {username ? (
            <>
              <Link
                to="/create"
                className="rounded-full border border-green-700 px-4 py-2 text-green-700 transition hover:bg-green-700 hover:text-white"
              >
                Write
              </Link>

              <span className="text-gray-500">{username}</span>

              <button onClick={logout} className="transition hover:text-black">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="transition hover:text-black">
                Sign in
              </Link>

              <Link
                to="/register"
                className="rounded-full bg-black px-5 py-2 text-white transition hover:bg-gray-800"
              >
                Get started
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
