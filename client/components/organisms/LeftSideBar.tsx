import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import BlockInfo from "../molecules/BlockInfo";
import { formBlocks } from "@/constants/blockTypes";
import BlockDropdownMenu from "../molecules/DropDownBlockMenu";
import { useState } from "react";

type LeftSideBarProps = {
  selectedBlock: number;
  setSelectedBlock: React.Dispatch<React.SetStateAction<number>>;
  handleOpenChooseBlockModal: () => void;
};

export default function LeftSideBar({
  selectedBlock,
  setSelectedBlock,
  handleOpenChooseBlockModal,
}: LeftSideBarProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const handleDuplicate = () => {
    console.log("Block duplicated!");
    alert("Block duplicated!");
  };

  const handleDelete = () => {
    console.log("Block deleted!");
    alert("Block deleted!");
  };
  return (
    <div className="w-65 bg-white border-r border-gray-200 overflow-y-auto">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-800">Blocks</h3>
          <Button
            size="sm"
            className="w-6 h-6 rounded-full p-0"
            onClick={handleOpenChooseBlockModal}
          >
            <Plus className="w-3 h-3" />
          </Button>
        </div>

        <div className="space-y-2">
          {formBlocks.map((block) => (
            <BlockInfo
              key={block.id}
              {...block}
              setSelectedBlock={setSelectedBlock}
              selectedBlock={selectedBlock}
              dropdownOpen={dropdownOpen}
              HoverComponent={
                <BlockDropdownMenu
                  onDuplicate={handleDuplicate}
                  onDelete={handleDelete}
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
