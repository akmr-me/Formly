import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { AlignCenter, AlignLeft } from "lucide-react";

type AlignProps = { textAlign: "center" | "left" };

export default function TextAlign({ textAlign }: AlignProps) {
  return (
    <div>
      <Label className="text-sm font-semibold text-gray-700 mb-2 block">
        Text align
      </Label>
      <div className="flex space-x-2">
        <Button
          variant="outline"
          size="sm"
          className={`p-2 cursor-pointer ${
            textAlign === "left" ? "bg-gray-200 border-gray-400" : ""
          }`}
        >
          <AlignLeft className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          className={`p-2 cursor-pointer ${
            textAlign === "center" ? "bg-gray-200 border-gray-400" : ""
          }`}
        >
          <AlignCenter className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
