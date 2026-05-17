/* eslint-disable jsx-a11y/anchor-is-valid */
import { format } from "date-fns";
import { Link } from "react-router-dom";

export default function Post({
  _id,
  title,
  summary,
  cover,
  content,
  createdAt,
  author,
  isRepost,
  repostedBy,
  originalPost,
}) {
  // Optional: if you want to show original author when this is a repost
  const displayAuthor = isRepost ? originalPost?.author : author;

  return (
    <article className="mx-auto flex max-w-4xl flex-col gap-6 border-b border-gray-200 py-8 md:flex-row">
      <div className="flex flex-1 flex-col justify-between">
        {/* 👇 Add the repost label here */}
        {isRepost && repostedBy && (
          <p className="text-xs text-gray-400 mb-2 flex items-center gap-1">
            🔁 Reposted by{" "}
            <span className="font-medium text-gray-600">
              {repostedBy.username}
            </span>
          </p>
        )}
        {/* Author */}
        <div className="mb-3 flex items-center gap-2 text-sm text-gray-600">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-300 font-semibold text-gray-700">
            {(displayAuthor?.username || author.username)[0].toUpperCase()}
          </div>
          <span className="font-medium text-gray-800">
            {displayAuthor?.username || author.username}
          </span>
          <span>·</span>
          <time>{format(new Date(createdAt), "MMM dd, yyyy")}</time>
        </div>

        {/* Title + Summary */}
        <Link to={`/post/${_id}`} className="group">
          <h2 className="mb-3 text-2xl font-bold leading-snug text-gray-900 transition group-hover:text-gray-700">
            {title}
          </h2>
          <p className="line-clamp-3 text-base leading-7 text-gray-600">
            {summary}
          </p>
        </Link>
      </div>

      {/* Right Image */}
      <div className="md:w-[240px]">
        <Link to={`/post/${_id}`}>
          <img
            src={"http://localhost:4000/" + cover}
            alt=""
            className="h-[180px] w-full rounded-xl object-cover"
          />
        </Link>
      </div>
    </article>
  );
}
