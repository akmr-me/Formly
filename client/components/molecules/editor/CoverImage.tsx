import React, { useState, useRef } from "react";
import { Label } from "@radix-ui/react-label";
import { Button } from "@/components/ui/button";
import { Upload, X, FileImage, AlertCircle } from "lucide-react";
import { allowedTypes } from "@/constants/blockTypes";

export default function CoverImage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  // Allowed file types

  const maxSize = 5 * 1024 * 1024; // 5MB

  const validateFile = (file) => {
    if (!allowedTypes.includes(file.type)) {
      setError("Please select a valid image file (JPEG, PNG, GIF, WebP)");
      return false;
    }

    if (file.size > maxSize) {
      setError("File size must be less than 5MB");
      return false;
    }

    setError("");
    return true;
  };

  const handleFileSelect = (file) => {
    if (validateFile(file)) {
      setSelectedFile(file);

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div>
      <Label className="text-sm font-semibold text-gray-700 mb-2 block">
        Cover Image
      </Label>

      {/* File Input (Hidden) */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInputChange}
        className="hidden"
      />

      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg text-center transition-colors cursor-pointer ${
          dragActive
            ? "border-blue-400 bg-blue-50"
            : selectedFile
            ? "border-green-400 bg-green-50"
            : "border-gray-300 hover:border-gray-400"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        {previewUrl ? (
          // Preview Image
          <div className="relative p-4">
            <img
              src={previewUrl}
              alt="Cover preview"
              className="max-h-40 mx-auto rounded-lg shadow-sm"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                removeFile();
              }}
              className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 w-8 h-8"
            >
              <X className="w-4 h-4" />
            </Button>
            <div className="mt-2 text-sm text-gray-600">
              {selectedFile?.name}
            </div>
            <div className="text-xs text-gray-400">
              {(selectedFile?.size / 1024 / 1024).toFixed(2)} MB
            </div>
          </div>
        ) : (
          // Upload Prompt
          <div className="p-8">
            <div className="text-xs text-gray-400">Select Image</div>
          </div>
        )}
      </div>
    </div>
  );
}
