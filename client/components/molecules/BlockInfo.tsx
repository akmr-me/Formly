import { BlockType } from "@/types";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

type BlockInfoProps = BlockType & {
  selectedBlock: number;
  setSelectedBlock: React.Dispatch<React.SetStateAction<number>>;
  key: number;
  HoverComponent: React.ReactNode;
  dropdownOpen?: boolean;
  position?: number;
};

export default function BlockInfo({
  id,
  label,
  position,
  selectedBlock,
  setSelectedBlock,
  icon,
  color,
  HoverComponent = null,
  dropdownOpen,
}: BlockInfoProps) {
  const [show, setShow] = useState(false);
  const colorClass = color.includes("#") ? `bg-[${color}]` : color;

  const router = useRouter();
  const searchParams = useSearchParams();
  const currentBlockId = searchParams.get("block_id") || "No Block ID";

  const handleChangeBlockId = (newBlockId: string) => {
    const pathname = window.location.pathname;
    const currentParams = new URLSearchParams(searchParams.toString());

    currentParams.set("block_id", newBlockId);
    router.push(`${pathname}?${currentParams.toString()}`);
  };

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
          {position}. {label || "Untitled"}
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
