import "react-quill/dist/quill.snow.css";
import { useState } from "react";
import { Navigate } from "react-router-dom";
import Editor from "../Editor";
import { apiUrl } from "../config";

export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState("");
  const [redirect, setRedirect] = useState(false);
  async function createNewPost(ev) {
    const data = new FormData();
    data.set("title", title);
    data.set("summary", summary);
    data.set("content", content);
    data.set("file", files[0]);
    ev.preventDefault();
    const response = await fetch(apiUrl("/post"), {
      method: "POST",
      body: data,
      credentials: "include",
    });
    if (response.ok) {
      setRedirect(true);
    }
  }

  if (redirect) {
    return <Navigate to={"/"} />;
  }
  return (
  <div className="min-h-screen bg-white px-4 py-12">
    <div className="max-w-2xl mx-auto">

      {/* Page Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-2"
            style={{ fontFamily: 'Georgia, serif' }}>
          Write your story
        </h1>
        <p className="text-sm text-gray-600 tracking-widest uppercase">
          Draft
        </p>
      </div>

      <form className="space-y-6" onSubmit={createNewPost}>

        {/* Title */}
        <div>
          <label className="block text-xs font-medium text-gray-500 uppercase tracking-widest mb-2">
            Title
          </label>
          <input
            type="text"
            placeholder="Your story begins here..."
            value={title}
            onChange={(ev) => setTitle(ev.target.value)}
            className="w-full px-0 py-3 text-3xl font-semibold text-gray-900 bg-transparent border-0 border-b border-gray-200 placeholder-gray-200 focus:outline-none focus:border-gray-900 transition-all duration-200"
            style={{ fontFamily: 'Georgia, serif' }}
          />
        </div>

        {/* Summary */}
        <div>
          <label className="block text-xs font-medium text-gray-500 uppercase tracking-widest mb-2">
            Summary
          </label>
          <input
            type="text"
            placeholder="A short description of your story..."
            value={summary}
            onChange={(ev) => setSummary(ev.target.value)}
            className="w-full px-4 py-3 text-sm text-gray-900 bg-gray-50 border border-gray-200 rounded-xl placeholder-gray-300 focus:outline-none focus:border-gray-900 focus:bg-white transition-all duration-200"
          />
        </div>

        {/* Cover Image */}
        <div>
          <label className="block text-xs font-medium text-gray-500 uppercase tracking-widest mb-2">
            Cover Image
          </label>
          <label className="flex items-center gap-3 w-full px-4 py-4 bg-gray-50 border border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-gray-400 hover:bg-gray-100 transition-all duration-200 group">
            <svg className="w-5 h-5 text-gray-300 group-hover:text-gray-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-sm text-gray-300 group-hover:text-gray-500 transition-colors">
              Click to upload a cover image
            </span>
            <input
              type="file"
              className="hidden"
              onChange={(ev) => setFiles(ev.target.files)}
            />
          </label>
        </div>

        {/* Editor */}
        <div>
          <label className="block text-xs font-medium text-gray-500 uppercase tracking-widest mb-2">
            Content
          </label>
          <div className="border border-gray-200 rounded-xl overflow-hidden focus-within:border-gray-900 transition-all duration-200">
            <Editor value={content} onChange={setContent} />
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          
          <button
            type="submit"
            className="px-8 py-3 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-black transition-colors duration-200 tracking-wide"
          >
            Publish Story
          </button>
        </div>

      </form>
    </div>
  </div>
);
}
