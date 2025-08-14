import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { HelpCircle } from "lucide-react";
import { useState } from "react";
import CustomTooltip from "../CustomTooltip";

export function AutoFillURLParameter({
  placeholder,
  value,
  onChange,
  className = "",
  tooltipContent = "This field will be automatically filled using URL parameters",
}) {
  const Content = () => (
    <p className="w-60 whitespace-normal break-words">{tooltipContent}</p>
  );
  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <Label className="text-gray-700 font-medium">
          Auto fill via URL parameter
        </Label>
        <CustomTooltip hoverContent={<Content />}>
          <HelpCircle className="h-4 w-4 text-gray-400 cursor-help" />
        </CustomTooltip>
      </div>
      <Input
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={className}
      />
    </div>
  );
}

const Tooltip = ({ children, content }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}
      </div>
      {isVisible && (
        <div className="absolute z-50 px-3 py-1.5 text-sm text-white bg-gray-900 rounded-md shadow-lg -top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
          {content}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
        </div>
      )}
    </div>
  );
};
