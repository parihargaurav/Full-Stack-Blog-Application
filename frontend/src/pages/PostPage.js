import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom"; 
import { formatISO9075 } from "date-fns";
import { UserContext } from "../UserContext";

import ClapButton from "../components/ClapButton";
import RepostButton from "../components/RepostButton";
import CommentsSection from "../components/CommentsSection";
import { apiUrl, imageUrl } from "../config";

export default function PostPage() {
  const [postInfo, setPostInfo] = useState(null);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const { userInfo } = useContext(UserContext);
  const { id } = useParams();
  const navigate = useNavigate(); 

  useEffect(() => {
    fetch(apiUrl(`/post/${id}`)).then((response) => {
      response.json().then((postInfo) => {
        setPostInfo(postInfo);
      });
    });
  }, [id]);

  if (!postInfo) return <p>Loading post...</p>;

  const isLoggedIn = userInfo && userInfo.id;

  const userClaps = isLoggedIn
    ? postInfo?.clappedBy?.find((c) => c.user.toString() === userInfo.id)
        ?.count || 0
    : 0;

  const hasReposted = isLoggedIn
    ? postInfo?.reposts?.includes(userInfo.id) || false
    : false;

  //  single guard function used by all protected actions
  const checkAuth = () => {
    if (!userInfo) {
      setShowLoginDialog(true);
      return false;
    }
    return true;
  };

  const closeLoginDialog = () => setShowLoginDialog(false);
  const goToLogin = () => navigate("/login");

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      {/* Title */}
      <h1 className="mb-6 text-5xl font-extrabold leading-tight text-gray-900">
        {postInfo.title}
      </h1>

      {/* Author + Date */}
      <div className="mb-8 flex items-center gap-3 border-b pb-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200 text-lg font-bold text-gray-700">
          {postInfo.author.username[0].toUpperCase()}
        </div>
        <div className="flex flex-col">
          <span className="font-medium text-gray-900">
            {postInfo.author.username}
          </span>
          <time className="text-sm text-gray-500">
            {formatISO9075(new Date(postInfo.createdAt))}
          </time>
        </div>
      </div>

      {/* Edit Button */}
      {userInfo?.id === postInfo.author._id && (
        <div className="mb-8">
          <Link
            to={`/edit/${postInfo._id}`}
            className="inline-flex items-center gap-2 rounded-full border border-gray-300 px-5 py-2 text-sm font-medium text-gray-700 transition hover:border-black hover:text-black"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
              />
            </svg>
            Edit post
          </Link>
        </div>
      )}

      {/* Cover Image */}
      <div className="mb-10 overflow-hidden rounded-2xl">
        <img
          src={imageUrl(postInfo.cover)}
          alt=""
          fetchpriority="high"   // tells browser to load this first
          className="h-60 w-full object-cover"
        />
      </div>

      {/* Content */}
      <div
        className="
          prose 
          prose-lg 
          max-w-none 
          prose-headings:font-bold
          prose-p:text-gray-800
          prose-p:leading-8
          prose-img:rounded-xl
        "
        dangerouslySetInnerHTML={{ __html: postInfo.content }}
      />

      {/* Clap + Repost buttons */}
      <div className="mt-8 flex items-center gap-6 pt-6 border-t border-gray-200">
        <ClapButton
          postId={postInfo._id}
          initialClaps={postInfo.claps}
          initialUserClaps={userClaps}
          checkAuth={checkAuth} 
        />
        <RepostButton
          postId={postInfo._id}
          initialCount={postInfo.repostCount}
          initialReposted={hasReposted}
          checkAuth={checkAuth} 
        />
      </div>

      {/* Comments section */}
      <CommentsSection
        postId={postInfo._id}
        currentUserId={userInfo?.id}
        checkAuth={checkAuth} 
      />

      {showLoginDialog ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Login required
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              Please login to interact with this post. You can login now or cancel and continue browsing.
            </p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={closeLoginDialog}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={goToLogin}
                className="px-4 py-2 bg-gray-900 text-white rounded-xl hover:bg-black transition-colors duration-200"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}