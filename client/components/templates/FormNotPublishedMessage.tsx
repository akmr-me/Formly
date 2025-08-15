import React from "react";

const FormNotPublishedMessage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h1 className="text-2xl font-semibold text-gray-800 mb-3">
          This form is not published yet.
        </h1>
        <p className="text-gray-500 text-base">
          If you are the form owner then please publish it from dashboard.
        </p>
      </div>
    </div>
  );
};

export default FormNotPublishedMessage;
