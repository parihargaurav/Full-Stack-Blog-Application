import { useState } from "react";
import { apiUrl } from "../config";

export default function RepostButton({ postId, initialCount, initialReposted, checkAuth }) {
  const [reposted, setReposted] = useState(initialReposted || false);
  const [count, setCount] = useState(initialCount || 0);

  const handleRepost = async () => {

    if (!checkAuth()) return;
    try {
      const response = await fetch(apiUrl(`/post/${postId}/repost`), { 
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", //  sends cookie for auth
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setReposted(data.reposted);
      setCount(data.repostCount);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <button
      onClick={handleRepost}
      className={`flex items-center gap-2 transition-colors duration-200 ${
        reposted
          ? "text-green-600"
          : "text-gray-600 hover:text-green-500"
      }`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4 4v5h.582M20 20v-5h-.581M4.582 9A8 8 0 0119.42 15M19.419 9A8 8 0 014.58 15"
        />
      </svg>
      <span className="text-sm font-medium">{count}</span>
    </button>
  );
}