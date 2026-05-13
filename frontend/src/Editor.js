import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export default function Editor({ value, onChange }) {
  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
      ['link', 'image'],
      ['clean'],
    ],
  };

  return (
    <div className="editor-wrapper">
      <style>{`
        .editor-wrapper .ql-toolbar {
          border: none !important;
          border-bottom: 1px solid #e5e7eb !important;
          padding: 10px 16px !important;
          background-color: #f9fafb;
          font-family: sans-serif;
        }
        .editor-wrapper .ql-container {
          border: none !important;
          font-family: Georgia, serif;
          font-size: 16px;
          color: #111827;
        }
        .editor-wrapper .ql-editor {
          min-height: 280px;
          padding: 20px;
          line-height: 1.8;
        }
        .editor-wrapper .ql-editor.ql-blank::before {
          color: #d1d5db;
          font-style: italic;
          font-family: Georgia, serif;
        }
        .editor-wrapper .ql-toolbar button:hover .ql-stroke,
        .editor-wrapper .ql-toolbar button.ql-active .ql-stroke {
          stroke: #111827 !important;
        }
        .editor-wrapper .ql-toolbar button:hover .ql-fill,
        .editor-wrapper .ql-toolbar button.ql-active .ql-fill {
          fill: #111827 !important;
        }
        .editor-wrapper .ql-toolbar .ql-picker-label:hover,
        .editor-wrapper .ql-toolbar .ql-picker-item:hover {
          color: #111827 !important;
        }
      `}</style>

      <ReactQuill
        value={value}
        theme="snow"
        onChange={onChange}
        modules={modules}
        placeholder="Tell your story..."
      />
    </div>
  );
}