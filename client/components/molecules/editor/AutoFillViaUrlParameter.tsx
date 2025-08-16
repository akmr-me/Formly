import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { HelpCircle } from "lucide-react";
import CustomTooltip from "../CustomTooltip";

interface AutoFillURLParameterProps {
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  tooltipContent?: string;
}

export function AutoFillURLParameter({
  placeholder,
  value,
  onChange,
  className = "",
  tooltipContent = "This field will be automatically filled using URL parameters",
}: AutoFillURLParameterProps) {
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
