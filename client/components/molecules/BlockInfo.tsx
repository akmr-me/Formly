import { BlockType } from "@/types";
import { useState } from "react";

type BlockInfoProps = BlockType & {
  selectedBlock: number;
  setSelectedBlock: React.Dispatch<React.SetStateAction<number>>;
  key: number;
  HoverComponent: React.ReactNode;
  dropdownOpen?: boolean;
};

export default function BlockInfo({
  key,
  id,
  label,
  type,
  parentType,
  selectedBlock,
  setSelectedBlock,
  icon,
  color,
  HoverComponent = null,
  dropdownOpen,
}: BlockInfoProps) {
  const [show, setShow] = useState(false);
  const colorClass = color.includes("#") ? `bg-[${color}]` : color;

  return (
    <div
      key={key}
      className={`p-3 rounded-lg flex justify-between cursor-pointer transition-all ${colorClass} ${
        selectedBlock === id ? "ring-2 ring-blue-500" : ""
      }`}
      onClick={() => setSelectedBlock(id)}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      <div className="flex items-center space-x-2">
        <span className="text-sm">{icon}</span>
        <span className="text-sm font-medium">
          {id}. {label || "Untitled"}
        </span>
      </div>
      {
        <div onClick={(e) => e.stopPropagation()}>
          {(show || dropdownOpen) && HoverComponent}
        </div>
      }
    </div>
  );
}
