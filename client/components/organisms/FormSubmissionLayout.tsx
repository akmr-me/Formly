"use client";
import React from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import NotificationBanner from "../molecules/NotificationBannert";
import {
  FormAccentColor,
  FormBackgroundColor,
  UnpublishedFormMessage,
} from "@/constants";
import { cn } from "@/lib/utils";

interface FormLayoutProps {
  children: React.ReactNode;
  currentStep?: number;
  totalSteps?: number;
  showProgress?: boolean;
  poweredByText?: string;
  showNavigation?: boolean;
  onUpClick?: () => void;
  onDownClick?: () => void;
  className?: string;
  formStatus?: "draft" | "publish";
  isEmbed?: boolean;
}

const FormSubmissionLayout: React.FC<FormLayoutProps> = ({
  children,
  currentStep = 1,
  totalSteps = 5,
  showProgress = true,
  poweredByText = "Powered by Formly",
  showNavigation = true,
  onUpClick,
  onDownClick,
  className = "",
  formStatus,
  isEmbed = false,
}) => {
  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <div
      className={cn("min-h-screen flex flex-col", className)}
      style={
        {
          backgroundColor: FormBackgroundColor,
          "--form-accent": FormAccentColor,
        } as React.CSSProperties
      }
    >
      <NotificationBanner
        defaultVisible={formStatus === "draft"}
        message={UnpublishedFormMessage}
      />

      {/* Progress Bar */}
      {showProgress && (
        <div className="w-full bg-gray-400 h-1">
          <div
            className="h-full bg-gray-700 transition-all duration-300 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      )}

      {/* Main Content Area */}
      <div
        className={cn(
          "flex-1 flex items-center justify-center",
          isEmbed ? "p-4" : "p-8"
        )}
      >
        <div className="w-full max-w-4xl">{children}</div>
      </div>

      {/* Bottom Navigation */}
      <div
        className={cn(
          "fixed flex justify-between items-end z-50",
          isEmbed ? "bottom-4 left-4" : "bottom-8 left-8"
        )}
      >
        <div className="flex flex-col gap-2 items-start">
          <div
            className={cn(
              "bg-black text-white rounded text-sm font-medium",
              isEmbed ? "px-2 py-0.5 text-xs" : "px-3 py-1"
            )}
          >
            {poweredByText}
          </div>
        </div>
      </div>
      <div
        className={cn(
          "fixed flex justify-between items-end z-50",
          isEmbed ? "bottom-4 right-4" : "bottom-8 right-8"
        )}
      >
        <div className="flex flex-col gap-2 items-start">
          {showNavigation && (
            <div className="flex gap-1">
              <button
                onClick={onUpClick}
                className="bg-black hover:bg-gray-800 text-white p-2 rounded transition-colors duration-200"
                disabled={!onUpClick}
              >
                <ChevronUp className="w-4 h-4" />
              </button>
              <button
                onClick={onDownClick}
                className={cn(
                  "bg-black hover:bg-gray-800 text-white p-2 rounded transition-colors duration-200",
                  currentStep >= totalSteps && "invisible"
                )}
                disabled={!onDownClick}
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FormSubmissionLayout;
