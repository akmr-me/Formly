"use client";
import React from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import NotificationBanner from "../molecules/NotificationBannert";
import { UnpublishedFormMessage } from "@/constants";
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
}) => {
  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <div className={`min-h-screen bg-[#B5979B] flex flex-col ${className}`}>
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
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-4xl">{children}</div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-8 left-8 flex justify-between items-end z-50">
        <div className="flex flex-col gap-2 items-start">
          <div className="bg-black text-white px-3 py-1 rounded text-sm font-medium">
            {poweredByText}
          </div>
        </div>
      </div>
      <div className="fixed bottom-8 right-8 flex justify-between items-end z-50">
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
