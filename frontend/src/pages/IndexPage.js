import Post from "../Post";
import { apiUrl } from "../config";
import { useEffect, useState } from "react";

export default function IndexPage() {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    fetch(apiUrl("/post")).then((response) => {
      response.json().then((posts) => {
        setPosts(posts);
      });
    });
  }, []);
  return (
    <div className="mx-auto max-w-5xl px-6 py-8">
      {posts.map((post) => (
        <Post key = {post._id}{...post} />
      ))}
    </div>
  );
}
