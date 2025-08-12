import { DefaultDebounceTime } from "@/constants";
import { UpdateBlockPayload } from "@/hooks/useUpdateCommonBlockFields";
import { BlockType } from "@/types";
import { UseMutateFunction } from "@tanstack/react-query";
import React, { useState, useRef } from "react";
import ReactQuill, { Quill } from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { useDebouncedCallback } from "use-debounce";

type DescriptionPropsType = {
  mutate: UseMutateFunction<any, Error, Partial<UpdateBlockPayload>, unknown>;
  selectedBlockData: BlockType;
};

export default function Description({
  mutate,
  selectedBlockData,
}: DescriptionPropsType) {
  const [value, setValue] = useState(selectedBlockData.descriptionHtml || "");
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [linkRange, setLinkRange] = useState(null);
  const quillRef = useRef();

  // Custom video handler for YouTube embeds
  const videoHandler = () => {
    const url = prompt("Enter YouTube URL:");
    if (url) {
      const quill = quillRef.current.getEditor();
      const range = quill.getSelection();

      // Extract video ID from YouTube URL
      let videoId = "";
      const regExp =
        /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
      const match = url.match(regExp);

      if (match && match[2].length === 11) {
        videoId = match[2];
        const embedUrl = `https://www.youtube.com/embed/${videoId}`;
        quill.insertEmbed(range.index, "video", embedUrl);
      } else {
        setShowLinkInput(true);
      }
    }
  };

  // Custom link handler
  const linkHandler = () => {
    const quill = quillRef.current.getEditor();
    const range = quill.getSelection();

    if (range) {
      setLinkRange(range);
      setShowLinkInput(true);

      // Get existing link if text is already linked
      const format = quill.getFormat(range);
      if (format.link) {
        setLinkUrl(format.link);
      } else {
        setLinkUrl("");
      }
    }
  };

  // Apply link
  const applyLink = () => {
    if (linkRange && quillRef.current) {
      const quill = quillRef.current.getEditor();
      quill.setSelection(linkRange);

      if (linkUrl.trim()) {
        quill.format("link", linkUrl);
      } else {
        quill.format("link", false); // Remove link
      }
    }

    setShowLinkInput(false);
    setLinkUrl("");
    setLinkRange(null);
  };

  // Cancel link input
  const cancelLink = () => {
    setShowLinkInput(false);
    setLinkUrl("");
    setLinkRange(null);
  };

  const modules = {
    toolbar: {
      container: [
        ["bold", "italic"], // Bold + Italic
        ["link", "video"], // Link + YouTube/video embed
      ],
      handlers: {
        video: videoHandler,
        link: linkHandler,
      },
    },
  };

  const formats = ["bold", "italic", "link", "video"];

  const handleChange = (content, delta, source, editor) => {
    console.log("handle changed is called");
    setValue(content);
    debouncedDescriptionUpdate(content, delta);

    // Log all the values you might need
    console.log("HTML Content:", content);
    console.log("Plain Text:", editor.getText());
    console.log("Delta (Rich Content):", editor.getContents());
    console.log("Current State Value:", content);
  };

  const debouncedDescriptionUpdate = useDebouncedCallback(
    (html: string, delta) => {
      console.log("Save title:", html);
      const updateData = {};
      if (delta) updateData.descriptionHtml = html;
      if (delta) updateData.descriptionDelta = delta;
      if (Object.keys(updateData).length) mutate(updateData);
    },
    DefaultDebounceTime
  );

  return (
    <div>
      <label className="block mb-2 font-semibold text-gray-700">
        Description
      </label>
      <div className="quill-container relative">
        {/* Custom Link Input Toolbar */}
        {showLinkInput && (
          <div className="absolute custom-link-toolbar bg-gray-100 border border-gray-300 p-1 flex items-center gap-2 w-full">
            <input
              type="text"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="Enter link URL..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  applyLink();
                } else if (e.key === "Escape") {
                  cancelLink();
                }
              }}
            />
            <button
              onClick={applyLink}
              className="bg-gray-600 text-white px-3 py-2 rounded-md text-sm hover:bg-gray-700 flex items-center justify-center"
            >
              ✓
            </button>
            <button
              onClick={cancelLink}
              className="bg-gray-400 text-white px-3 py-2 rounded-md text-sm hover:bg-gray-500 flex items-center justify-center"
            >
              ✕
            </button>
          </div>
        )}

        <ReactQuill
          ref={quillRef}
          theme="snow"
          value={value}
          onChange={handleChange}
          modules={modules}
          formats={formats}
          placeholder="Enter your description here..."
          className={showLinkInput ? "no-top-border" : ""}
        />
      </div>

      <style jsx>{`
        .quill-container .ql-toolbar {
          background-color: #f3f4f6 !important;
          border-radius: 8px 8px 0 0;
          border-bottom: 1px solid #d1d5db;
          ${showLinkInput ? "display: none;" : ""}
        }

        .quill-container .ql-container {
          border-radius: 0 0 8px 8px;
          background-color: white;
        }

        .quill-container.no-top-border .ql-container {
          border-top: none;
          border-radius: 0 0 8px 8px;
        }

        .custom-link-toolbar + .ql-container {
          border-top: none;
          border-radius: 0 0 8px 8px;
        }

        .quill-container .ql-editor {
          min-height: 80px;
          line-height: 1.5;
          padding: 12px 15px;
        }

        .quill-container .ql-toolbar .ql-formats {
          margin-right: 15px;
        }

        .quill-container .ql-toolbar button:hover {
          background-color: #e5e7eb;
        }

        .quill-container .ql-toolbar button.ql-active {
          background-color: #ddd6fe;
          color: #7c3aed;
        }

        /* Replace video icon with YouTube icon */
        .ql-toolbar button.ql-video .ql-stroke {
          display: none;
        }

        .ql-toolbar button.ql-video::before {
          content: "📺";
          font-size: 14px;
          line-height: 1;
        }

        /* Custom link input toolbar styling */
        .custom-link-toolbar {
          border-bottom: 1px solid #d1d5db;
        }
      `}</style>
    </div>
  );
}
