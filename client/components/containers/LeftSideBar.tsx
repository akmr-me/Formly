import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import BlockInfo from "../molecules/BlockInfo";
import { useState } from "react";
import { BlockType } from "@/types";
import BlockDropdownMenuContainer from "./BlockDropDownMenuContainer";
import CustomTooltip from "../molecules/CustomTooltip";
import { AddNewBlockHoverText } from "@/constants";
import BlockInfoLeftSidebarContainer from "./blocks/BlockInfoLeftSidebarContainer";

type LeftSideBarProps = {
  formBlocks: BlockType[];
  handleOpenChooseBlockModal: () => void;
};

export default function LeftSideBar({
  handleOpenChooseBlockModal,
  formBlocks,
}: LeftSideBarProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div className="w-65 bg-white border-r border-gray-200 overflow-y-auto">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-800">Blocks</h3>
          <CustomTooltip hoverContent={<span>{AddNewBlockHoverText}</span>}>
            <Button
              size="sm"
              className="w-6 h-6 rounded-full p-0"
              onClick={handleOpenChooseBlockModal}
            >
              <Plus className="w-3 h-3" />
            </Button>
          </CustomTooltip>
        </div>

        <div className="space-y-2">
          {formBlocks.map((block: BlockType, index: number) => (
            <BlockInfoLeftSidebarContainer
              key={block.id}
              {...block}
              label={block.title}
              position={index + 1}
              required={block.required}
              dropdownOpen={dropdownOpen}
              HoverComponent={
                <BlockDropdownMenuContainer
                  blockId={block.id}
                  setDropdownOpen={setDropdownOpen}
                />
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
}
