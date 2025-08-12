import React, { useState, useRef, useEffect } from "react";
import { Label } from "@radix-ui/react-label";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { allowedTypes } from "@/constants/blockTypes";
import apiClient from "@/lib/apiClient";
import Image from "next/image";

interface CoverImageProps {
  onUploadComplete?: (imageUrl: string) => void;
  uploadEndpoint?: string;
  type: string;
  imageUrl?: string;
  coverImageLayout?: string;
}

interface UploadState {
  isUploading: boolean;
  progress: number;
  error: string;
}

const CoverImage: React.FC<CoverImageProps> = ({
  onUploadComplete,
  uploadEndpoint = "/api/upload",
  type,
  imageUrl,
  coverImageLayout = "stack",
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(imageUrl || null);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [uploadState, setUploadState] = useState<UploadState>({
    isUploading: false,
    progress: 0,
    error: "",
  });

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const maxSize = 5 * 1024 * 1024; // 5MB

  const validateFile = (file: File): boolean => {
    if (!allowedTypes.includes(file.type)) {
      setUploadState((prev) => ({
        ...prev,
        error: "Please select a valid image file (JPEG, PNG, GIF, WebP)",
      }));
      return false;
    }

    if (file.size > maxSize) {
      setUploadState((prev) => ({
        ...prev,
        error: "File size must be less than 5MB",
      }));
      return false;
    }

    setUploadState((prev) => ({ ...prev, error: "" }));
    return true;
  };

  const uploadFile = async (file: File): Promise<void> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);
    formData.append("coverImageLayout", coverImageLayout);

    try {
      setUploadState({ isUploading: true, progress: 0, error: "" });

      const response = await apiClient.patch(uploadEndpoint, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadState((prev) => ({ ...prev, progress }));
          }
        },
      });

      // Assuming the API returns { url: "uploaded-image-url" }
      const uploadedUrl = response.data.url;
      setUploadState({ isUploading: false, progress: 100, error: "" });

      if (onUploadComplete) {
        onUploadComplete(uploadedUrl);
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Upload failed. Please try again.";
      setUploadState({
        isUploading: false,
        progress: 0,
        error: errorMessage,
      });
    }
  };

  const handleFileSelect = async (file: File): Promise<void> => {
    if (validateFile(file)) {
      setSelectedFile(file);

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setPreviewUrl(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);

      // Start upload
      await uploadFile(file);
    }
  };

  const handleFileInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

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
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const removeFile = (): void => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setUploadState({ isUploading: false, progress: 0, error: "" });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    apiClient.delete(uploadEndpoint).then(() => {
      onUploadComplete && onUploadComplete("");
    });
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

  useEffect(() => {
    setPreviewUrl(imageUrl);
  }, [imageUrl]);
  console.log({ imageUrl });
  return (
    <div>
      <Label className="text-sm font-semibold text-gray-700 mb-2 block">
        Cover Image
      </Label>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInputChange}
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
                  removeFile();
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
