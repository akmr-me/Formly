import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { UpdateBlockPayload } from "@/hooks/useUpdateCommonBlockFields";
import { TextAlignType } from "@/types";
import { UseMutateFunction } from "@tanstack/react-query";
import { AlignCenter, AlignLeft } from "lucide-react";
import { useEffect, useState } from "react";

type AlignProps = {
  textAlign: TextAlignType;
  mutate: UseMutateFunction<any, Error, Partial<UpdateBlockPayload>, unknown>;
};

export default function TextAlign({ textAlign, mutate }: AlignProps) {
  const [align, setAlign] = useState(textAlign || "left");

  const handleUpdateAlign = (newAlign: TextAlignType) => {
    setAlign(newAlign);
    mutate({ textAlign: newAlign });
  };

  useEffect(() => {
    setAlign(textAlign);
  }, [textAlign]);

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
            align === "left" ? "bg-gray-200 border-gray-400" : ""
          }`}
          onClick={() => handleUpdateAlign("left")}
        >
          <AlignLeft className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          className={`p-2 cursor-pointer ${
            align === "center" ? "bg-gray-200 border-gray-400" : ""
          }`}
          onClick={() => handleUpdateAlign("center")}
        >
          <AlignCenter className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
