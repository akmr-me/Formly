import { formBlocks } from "@/constants/blockTypes";
import { BlockType, BlockTypeEnum } from "@/types";
import { useState } from "react";

export type BlockInfoProps = BlockType & {
  HoverComponent: React.ReactNode;
  dropdownOpen?: boolean;
  position?: number;
  id: string;
  label: string;
  icon: string;
  required?: boolean; // Added required prop
  onClickHandler?: (id: string) => void;
  onDoubleClickHandler?: () => void;
  selectedBlockId?: string;
  type: BlockTypeEnum;
};

export default function BlockInfo({
  id,
  label,
  position,
  icon,
  color,
  required = false,
  HoverComponent = null,
  dropdownOpen,
  onClickHandler,
  // onDoubleClickHandler,
  selectedBlockId,
  type,
}: BlockInfoProps) {
  const [show, setShow] = useState(false);
  const colorClass = color.includes("#") ? `bg-[${color}]` : color;
  const Icon = icon || formBlocks.find((b) => b.type === type)?.icon;

  return (
    <div
      className={`p-3 rounded-md flex justify-between cursor-pointer transition-all relative ${colorClass} ${
        selectedBlockId === id ? "ring-2 ring-blue-500" : ""
      }`}
      onClick={() => onClickHandler && onClickHandler(id)}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {required && (
        <span className="absolute -top-3 -right-0.5 text-red-500 text-xl font-bold">
          *
        </span>
      )}

      <div className="flex items-center space-x-2">
        <span className="text-sm">{Icon}</span>
        <span className="text-sm font-medium">
          {position}. {label}
        </span>
      </div>

      <div
        onClick={(e) => e.stopPropagation()}
        className="relative h-full min-h-full"
      >
        {(show || dropdownOpen) && (
          <div className="absolute top-0 right-1">{HoverComponent}</div>
        )}
      </div>
    </div>
  );
}
