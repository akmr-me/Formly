import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { AlignCenter, AlignLeft } from "lucide-react";

export default function TextAlign() {
  return (
    <div>
      <Label className="text-sm font-semibold text-gray-700 mb-2 block">
        Text align
      </Label>
      <div className="flex space-x-2">
        <Button variant="outline" size="sm" className="p-2">
          <AlignLeft className="w-4 h-4" />
        </Button>
        <Button variant="outline" size="sm" className="p-2">
          <AlignCenter className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
