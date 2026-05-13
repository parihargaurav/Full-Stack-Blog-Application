/* eslint-disable no-unused-vars */
import { useContext } from "react";

import Post from "./Post";
import Header from "./Header";
import { Route, Routes } from "react-router-dom";
import Layout from "./Layout";
import IndexPage from "./pages/IndexPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { UserContextProvider, UserContext } from "./UserContext";
import CreatePost from "./pages/CreatePost";
import PostPage from "./pages/PostPage";
import EditPost from "./pages/EditPost";

function AppContent() {
  const { theme, toggleTheme } = useContext(UserContext);

  return (
    <div className="min-h-screen bg-white text-black transition-colors duration-300 dark:bg-gray-900 dark:text-white">
      
      <div className="flex justify-end p-4">
        <button
          onClick={toggleTheme}
          className="rounded-lg border px-4 py-2 transition hover:scale-105"
        >
          {theme === "light" ? "🌙 " : "☀️ "}
        </button>
      </div>

      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<IndexPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/create" element={<CreatePost />} />
          <Route path="/post/:id" element={<PostPage />} />
          <Route path="/edit/:id" element={<EditPost />} />
        </Route>
      </Routes>
    </div>
  );
}

function App() {
  return (
    <UserContextProvider>
      <AppContent />
    </UserContextProvider>
  );
}

export default App;