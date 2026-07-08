import React from "react";
import { FormBackgroundColor, FormSurfaceColor } from "@/constants";

const FormNotPublishedMessage = () => {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: FormBackgroundColor }}
    >
      <div
        className="text-center max-w-md rounded-2xl px-8 py-10 shadow-sm"
        style={{ backgroundColor: FormSurfaceColor }}
      >
        <h1 className="text-2xl font-semibold text-gray-900 mb-3">
          This form is not published yet.
        </h1>
        <p className="text-gray-600 text-base">
          If you are the form owner then please publish it from dashboard.
        </p>
      </div>
    </div>
  );
};

export default FormNotPublishedMessage;
