import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import CustomTooltip from "../CustomTooltip";
import { EmbedAddButtonHoverText, EmbedInputPlaceholder } from "@/constants";

interface EmbedProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleUpdateEmbedUrl: () => void;
}

export default function Embed({
  value,
  onChange,
  handleUpdateEmbedUrl,
}: EmbedProps) {
  const [showInput, setShowInput] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowInput(false);
      }
    };

    if (showInput) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showInput]);

  useEffect(() => {
    if (!showInput) handleUpdateEmbedUrl();
  }, [showInput]);

  return (
    <div ref={containerRef}>
      <div className="flex items-center justify-between mb-2">
        <Label className="text-sm font-semibold text-gray-700">Embed</Label>
        <CustomTooltip hoverContent={<span>{EmbedAddButtonHoverText}</span>}>
          <Button size="sm" className="p-1" onClick={() => setShowInput(true)}>
            <Plus className="w-4 h-4" />
          </Button>
        </CustomTooltip>
      </div>
      {showInput && (
        <Input
          ref={inputRef}
          value={value}
          onChange={onChange}
          autoFocus
          placeholder={EmbedInputPlaceholder}
        />
      )}
    </div>
  );
}
