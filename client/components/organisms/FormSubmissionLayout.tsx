"use client";
import React from "react";
import { ChevronUp, ChevronDown } from "lucide-react";

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
}

const FormSubmissionLayout: React.FC<FormLayoutProps> = ({
  children,
  currentStep = 1,
  totalSteps = 5,
  showProgress = true,
  poweredByText = "Powered by Fermion Forms",
  showNavigation = true,
  onUpClick,
  onDownClick,
  className = "",
}) => {
  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <div className={`min-h-screen bg-[#B5979B] flex flex-col ${className}`}>
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
        <div className="w-full max-w-2xl">{children}</div>
      </div>

      {/* Bottom Navigation */}
      <div className="flex items-center justify-between p-6">
        {/* Powered By */}
        <div className="flex items-center">
          <div className="bg-black text-white px-3 py-1 rounded text-sm font-medium">
            {poweredByText}
          </div>
        </div>

        {/* Navigation Arrows */}
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
              className="bg-black hover:bg-gray-800 text-white p-2 rounded transition-colors duration-200"
              disabled={!onDownClick}
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FormSubmissionLayout;
