import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";

export default function Embed() {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <Label className="text-sm font-semibold text-gray-700">Embed</Label>
        <Button variant="ghost" size="sm" className="p-1">
          <Plus className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
