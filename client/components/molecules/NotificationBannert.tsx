import React, { useState } from "react";
import { X } from "lucide-react";

type NotificationBannerProps = {
  message: string;
  defaultVisible: boolean;
};
const NotificationBanner = ({
  message,
  defaultVisible,
}: NotificationBannerProps) => {
  const [isVisible, setIsVisible] = useState(defaultVisible);

  if (!isVisible) return null;

  return (
    <div className="w-full bg-slate-700 text-white px-4 py-3 absolute top-1">
      <div className="flex items-center justify-center text-center">
        <p className="text-sm font-medium">{message}</p>
        <button
          onClick={() => setIsVisible(false)}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-600 rounded transition-colors"
          aria-label="Dismiss notification"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default NotificationBanner;
