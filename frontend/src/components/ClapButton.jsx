import { useState } from "react";

export default function ClapButton({ postId, initialClaps, initialUserClaps, checkAuth  }) {
  const [totalClaps, setTotalClaps] = useState(initialClaps || 0);
  const [userClaps, setUserClaps] = useState(initialUserClaps || 0);
  const [animating, setAnimating] = useState(false);

  const handleClap = async () => {
    if (!checkAuth()) return;
    if (userClaps >= 50) return; 

    setAnimating(true);
    setTimeout(() => setAnimating(false), 300);

    try {

      const response = await fetch(`http://localhost:4000/post/${postId}/clap`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          
        },
        credentials: "include",
        body: JSON.stringify({ count: 1 }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setTotalClaps(data.totalClaps);
      setUserClaps(data.userClaps);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <button
      onClick={handleClap}
      disabled={userClaps >= 50}
      className={`flex flex-col items-center gap-1 group transition-all duration-200 ${
        userClaps >= 50
          ? "opacity-50 cursor-not-allowed"
          : "cursor-pointer"
      }`}
    >
      <span
        className={`text-2xl transition-transform duration-200 ${
          animating ? "scale-125" : "scale-100"
        } ${
          userClaps > 0
            ? "text-green-600"
            : "text-gray-600 group-hover:text-green-500"
        }`}
      >
        👏
      </span>
      <span className="text-sm text-gray-500 font-medium">{totalClaps}</span>
      {userClaps > 0 && (
        <span className="text-xs text-green-600">+{userClaps}</span>
      )}
    </button>
  );
}