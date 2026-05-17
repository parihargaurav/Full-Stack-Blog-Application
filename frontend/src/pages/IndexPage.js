import Post from "../Post";
import { useEffect, useState } from "react";

export default function IndexPage() {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    fetch("http://localhost:4000/post").then((response) => {
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
