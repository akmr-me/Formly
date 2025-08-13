import { DefaultDebounceTime, SupportedQuillEditorFormats } from "@/constants";
import { UpdateBlockPayload } from "@/hooks/useUpdateCommonBlockFields";
import { BlockType } from "@/types";
import { UseMutateFunction } from "@tanstack/react-query";
import React, { useState, useRef, useCallback, useEffect } from "react";
import ReactQuill, { Quill } from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { useDebouncedCallback } from "use-debounce";

interface DescriptionPropsType {
  mutate: UseMutateFunction<any, Error, Partial<UpdateBlockPayload>, unknown>;
  selectedBlockData: BlockType;
}

interface QuillRange {
  index: number;
  length: number;
}

type InputMode = "link" | "video" | null;

const Description: React.FC<DescriptionPropsType> = ({
  mutate,
  selectedBlockData,
}) => {
  const [value, setValue] = useState<string>(
    selectedBlockData.descriptionHtml || ""
  );
  const [showInput, setShowInput] = useState<boolean>(false);
  const [inputMode, setInputMode] = useState<InputMode>(null);
  const [inputUrl, setInputUrl] = useState<string>("");
  const [inputRange, setInputRange] = useState<QuillRange | null>(null);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  const quillRef = useRef<ReactQuill | null>(null);

  useEffect(() => {
    setIsInitialized(true);
  }, []);

  const extractYouTubeId = (url: string): string | null => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  // video handler
  const videoHandler = useCallback(() => {
    if (!quillRef.current) return;

    const quill = quillRef.current.getEditor();
    const range = quill.getSelection();

    if (range !== null) {
      setInputRange(range);
      setInputMode("video");
      setShowInput(true);
      setInputUrl("");
    }
  }, []);

  // link handler
  const linkHandler = useCallback(() => {
    if (!quillRef.current) return;

    const quill = quillRef.current.getEditor();
    const range = quill.getSelection();

    if (range) {
      setInputRange(range);
      setInputMode("link");
      setShowInput(true);

      const format = quill.getFormat(range);
      setInputUrl((format.link as string) || "");
    }
  }, []);

  const applyInput = useCallback(() => {
    if (!inputRange || !quillRef.current || !inputUrl.trim()) {
      cancelInput();
      return;
    }

    const quill = quillRef.current.getEditor();
    quill.setSelection(inputRange);

    if (inputMode === "link") {
      quill.format("link", inputUrl);
    } else if (inputMode === "video") {
      const videoId = extractYouTubeId(inputUrl);
      if (videoId) {
        const embedUrl = `https://www.youtube.com/embed/${videoId}`;
        quill.insertEmbed(inputRange.index, "video", embedUrl);
      } else {
        alert("Please enter a valid YouTube URL");
        return;
      }
    }

    cancelInput();
  }, [inputRange, inputUrl, inputMode]);

  const cancelInput = useCallback(() => {
    setShowInput(false);
    setInputUrl("");
    setInputRange(null);
    setInputMode(null);
  }, []);

  const handleInputKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        applyInput();
      } else if (e.key === "Escape") {
        e.preventDefault();
        cancelInput();
      }
    },
    [applyInput, cancelInput]
  );

  const modules = {
    toolbar: {
      container: [
        ["bold", "italic"],
        ["link", "video"],
      ],
      handlers: {
        video: videoHandler,
        link: linkHandler,
      },
    },
  };

  const handleChange = useCallback(
    (content: string, delta: any, source: string, editor: any) => {
      if (!isInitialized || source !== "user") {
        return;
      }

      console.log("handleChange called - source:", source);
      setValue(content);
      debouncedDescriptionUpdate(content, delta);

      console.log("HTML Content:", content);
      console.log("Plain Text:", editor.getText());
      console.log("Delta (Rich Content):", editor.getContents());
    },
    [isInitialized]
  );

  const debouncedDescriptionUpdate = useDebouncedCallback(
    (html: string, delta: any) => {
      console.log("Saving content:", html);
      const updateData: Partial<UpdateBlockPayload> = {};

      if (delta) {
        updateData.descriptionHtml = html;
        updateData.descriptionDelta = delta;
      }

      if (Object.keys(updateData).length > 0) {
        mutate(updateData);
      }
    },
    DefaultDebounceTime
  );

  const getInputPlaceholder = (): string => {
    return inputMode === "video" ? "Enter YouTube URL..." : "Enter link URL...";
  };

  useEffect(() => {
    setValue(selectedBlockData.descriptionHtml || value);
  }, [selectedBlockData.descriptionHtml]);

  return (
    <div>
      <label className="block mb-2 font-semibold text-gray-700">
        Description
      </label>
      <div className="quill-container relative">
        {showInput && (
          <div className="absolute custom-input-toolbar bg-gray-100 border border-gray-300 p-1 flex items-center gap-2 w-full z-10">
            <input
              type="text"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              placeholder={getInputPlaceholder()}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              autoFocus
              onKeyDown={handleInputKeyDown}
            />
            <button
              onClick={applyInput}
              className="bg-gray-600 text-white px-3 py-2 rounded-md text-sm hover:bg-gray-700 flex items-center justify-center"
              title="Apply"
            >
              ✓
            </button>
            <button
              onClick={cancelInput}
              className="bg-gray-400 text-white px-3 py-2 rounded-md text-sm hover:bg-gray-500 flex items-center justify-center"
              title="Cancel"
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
          formats={SupportedQuillEditorFormats}
          placeholder="Enter your description here..."
          className={showInput ? "no-top-border" : ""}
        />
      </div>

      <style jsx>{`
        .quill-container .ql-toolbar {
          background-color: #f3f4f6 !important;
          border-radius: 8px 8px 0 0;
          border-bottom: 1px solid #d1d5db;
          ${showInput ? "display: none;" : ""}
        }

        .quill-container .ql-container {
          border-radius: 0 0 8px 8px;
          background-color: white;
        }

        .quill-container.no-top-border .ql-container {
          border-top: none;
          border-radius: 0 0 8px 8px;
        }

        .custom-input-toolbar + .ql-container {
          border-top: none;
          border-radius: 0 0 8px 8px;
        }

        .custom-input-toolbar {
          border-bottom: 1px solid #d1d5db;
          border-radius: 8px 8px 0 0;
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
      `}</style>
    </div>
  );
};

export default Description;
