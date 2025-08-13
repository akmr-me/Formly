import useUpdateBlockIdInUrl from "@/hooks/useUpdateBlockIdInUrl";
import { BlockType } from "@/types";
import { useState } from "react";

type BlockInfoProps = BlockType & {
  HoverComponent: React.ReactNode;
  dropdownOpen?: boolean;
  position?: number;
  id: string;
  label: string;
  icon: string;
};

export default function BlockInfo({
  id,
  label,
  position,
  icon,
  color,
  HoverComponent = null,
  dropdownOpen,
}: BlockInfoProps) {
  const [show, setShow] = useState(false);
  const { handleChangeBlockId, currentBlockId } = useUpdateBlockIdInUrl();
  const colorClass = color.includes("#") ? `bg-[${color}]` : color;

  return (
    <div
      className={`p-3 rounded-lg flex justify-between cursor-pointer transition-all ${colorClass} ${
        currentBlockId === id ? "ring-2 ring-blue-500" : ""
      }`}
      onClick={() => handleChangeBlockId(id)}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      <div className="flex items-center space-x-2">
        <span className="text-sm">{icon}</span>
        <span className="text-sm font-medium">
          {position}. {label}
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
