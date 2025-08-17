import React, { useState, useRef, useEffect } from "react";
import { Label } from "@radix-ui/react-label";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

import Image from "next/image";

export type CoverImageProps = {
  onUploadComplete?: (imageUrl: string) => void;
  imageUrl?: string;
  uploadState: UploadState;
  selectedFile: File | null;
  onFileSelect: (file: File) => void;
  onFileInputChange: React.ChangeEventHandler<HTMLInputElement>;
  removeFile: () => void;
  previewUrl: string | null;
  setPreviewUrl: React.Dispatch<React.SetStateAction<string | null>>;
};

export type UploadState = {
  isUploading: boolean;
  progress: number;
  error: string;
};

const CoverImage: React.FC<CoverImageProps> = ({
  imageUrl,
  uploadState,
  selectedFile,
  onFileSelect,
  onFileInputChange,
  removeFile,
  previewUrl,
  setPreviewUrl,
}) => {
  console.log({ uploadState });
  const [dragActive, setDragActive] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleDrag = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  };

  const openFileDialog = (): void => {
    if (!uploadState.isUploading) {
      fileInputRef.current?.click();
    }
  };

  const getStatusText = (): string => {
    if (uploadState.error) {
      return uploadState.error;
    }
    if (uploadState.isUploading) {
      return `Uploading... ${uploadState.progress}%`;
    }
    if (previewUrl && !uploadState.isUploading) {
      return "Upload complete";
    }
    return "Select Image";
  };

  const getStatusColor = (): string => {
    if (uploadState.error) return "text-red-500";
    if (uploadState.isUploading) return "text-blue-500";
    if (previewUrl && !uploadState.isUploading) return "text-green-500";
    return "text-gray-400";
  };

  const onRemoveFile = (): void => {
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    removeFile();
    setPreviewUrl(null);
  };

  // Note: this use effect is needed to update the previewUrl when the imageUrl prop changes
  useEffect(() => {
    if (imageUrl == undefined) setPreviewUrl(null);
    else setPreviewUrl(imageUrl);
  }, [imageUrl]);

  return (
    <div>
      <Label className="text-sm font-semibold text-gray-700 mb-2 block">
        Cover Image
      </Label>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={onFileInputChange}
        className="hidden"
        disabled={uploadState.isUploading}
      />

      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg text-center transition-colors ${
          uploadState.isUploading
            ? "border-blue-400 bg-blue-50 cursor-not-allowed"
            : dragActive
            ? "border-blue-400 bg-blue-50 cursor-pointer"
            : selectedFile && !uploadState.error
            ? "border-green-400 bg-green-50 cursor-pointer"
            : uploadState.error
            ? "border-red-400 bg-red-50 cursor-pointer"
            : "border-gray-300 hover:border-gray-400 cursor-pointer"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        {previewUrl && !uploadState.error ? (
          // preview Image
          <div className="relative p-4">
            <Image
              src={previewUrl}
              alt="Cover preview"
              className="max-h-40 mx-auto rounded-lg shadow-sm"
              crossOrigin="anonymous"
              width={400}
              height={300}
            />
            {!uploadState.isUploading && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveFile();
                }}
                className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 w-8 h-8"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        ) : (
          // Upload Prompt
          <div className="p-8">
            <div className={`text-xs ${getStatusColor()}`}>
              {getStatusText()}
            </div>
            {uploadState.isUploading && (
              <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${uploadState.progress}%` }}
                ></div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CoverImage;
