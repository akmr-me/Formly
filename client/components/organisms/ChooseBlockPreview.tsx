import { ArrowRight } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export default function ChooseBlockPreview() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 w-full">
      <div className="mb-4">
        <h4 className="text-lg font-medium text-gray-900 mb-2">
          What is your name?
        </h4>
        <div className="relative">
          <Input
            placeholder="Your answer here..."
            className="w-full pr-12"
            disabled
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="text-xs text-gray-400">*</div>
          </div>
        </div>
      </div>

      <Button
        size="sm"
        className="bg-blue-600 hover:bg-blue-700 text-white"
        disabled
      >
        Next
        <ArrowRight className="w-4 h-4 ml-1" />
      </Button>
    </div>
  );
}
