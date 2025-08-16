import { useState } from "react";
import CoverImage, {
  type UploadState,
} from "@/components/molecules/editor/CoverImage";
import {
  allowedTypes,
  MaxSizeImageError,
  ValidImageTypeError,
} from "@/constants";
import apiClient from "@/lib/apiClient";
import { CoverImageLayout } from "@/types";

type CoverImageContainerProps = {
  onUploadComplete?: (imageUrl: string) => void;
  uploadEndpoint: string;
  type: string;
  imageUrl?: string;
  coverImageLayout?: CoverImageLayout;
};

export default function CoverImageContainer({
  onUploadComplete,
  uploadEndpoint,
  type,
  imageUrl,
  coverImageLayout = "stack",
}: CoverImageContainerProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadState, setUploadState] = useState<UploadState>({
    isUploading: false,
    progress: 0,
    error: "",
  });
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const maxSize = 5 * 1024 * 1024; // 5MB

  const uploadFile = async (file: File): Promise<void> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);
    // coverImageLayout default value is set to null at db level so we need to set it to stack
    formData.append("coverImageLayout", coverImageLayout ?? "stack");

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

      const uploadedUrl = response.data.url;
      setUploadState({ isUploading: false, progress: 100, error: "" });

      if (onUploadComplete) {
        onUploadComplete(uploadedUrl);
      }
    } catch (error) {
      const errorMessage =
        (error as { response?: { data?: { message?: string } } }).response?.data
          ?.message || "Upload failed. Please try again.";
      setUploadState({
        isUploading: false,
        progress: 0,
        error: errorMessage,
      });
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
  //
  const handleFileSelect = async (file: File): Promise<void> => {
    if (validateFile(file)) {
      setSelectedFile(file);

      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setPreviewUrl(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
      await uploadFile(file);
    }
  };
  const validateFile = (file: File): boolean => {
    if (!allowedTypes.includes(file.type)) {
      setUploadState((prev) => ({
        ...prev,
        error: ValidImageTypeError,
      }));
      return false;
    }

    if (file.size > maxSize) {
      setUploadState((prev) => ({
        ...prev,
        error: MaxSizeImageError,
      }));
      return false;
    }

    setUploadState((prev) => ({ ...prev, error: "" }));
    return true;
  };
  const removeFile = (): void => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setUploadState({ isUploading: false, progress: 0, error: "" });
    apiClient.delete(uploadEndpoint).then(() => {
      onUploadComplete && onUploadComplete("");
    });
  };
  console.log({ uploadState });
  return (
    <CoverImage
      {...{
        onFileSelect: handleFileSelect,
        removeFile,
        onFileInputChange: handleFileInputChange,
        selectedFile,
        uploadState,
        imageUrl,
        previewUrl,
        setPreviewUrl,
      }}
    />
  );
}
