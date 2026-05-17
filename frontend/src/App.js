import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { UserContextProvider } from "./UserContext";

// lazy load all pages
const Layout = lazy(() => import("./Layout"));
const IndexPage = lazy(() => import("./pages/IndexPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage"));
const CreatePost = lazy(() => import("./pages/CreatePost"));
const PostPage = lazy(() => import("./pages/PostPage"));
const EditPost = lazy(() => import("./pages/EditPost"));

function App() {
  return (
    <UserContextProvider>
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-screen text-gray-400 text-sm">
            Loading...
          </div>
        }
      >
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
      </Suspense>
    </UserContextProvider>
  );
}

export default App;