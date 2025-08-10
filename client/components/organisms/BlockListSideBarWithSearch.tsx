import { BlockType } from "@/types";
import BlockInfo from "../molecules/BlockInfo";
import { Input } from "../ui/input";
import { useState } from "react";

type BlockListSideBarWithSearchProps = {
  selectedBlock: number;
  setSelectedBlock: React.Dispatch<React.SetStateAction<number>>;
  blockTypes: BlockType[];
};

export default function BlockListSideBarWithSearch({
  selectedBlock,
  setSelectedBlock,
  blockTypes,
}: BlockListSideBarWithSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredBlocks = blockTypes.filter((block) =>
    block.label.toLowerCase().includes(searchQuery.toLowerCase())
  );
  return (
    <div className="w-70 overflow-y-auto">
      <div className="p-4">
        {/* Search Input */}
        <div className="mb-4">
          <Input
            placeholder="Search blocks.."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>

        {/* Block Types List */}
        <div className="space-y-2">
          {filteredBlocks.map((block) => (
            <BlockInfo
              key={block.id}
              {...block}
              selectedBlock={selectedBlock}
              setSelectedBlock={setSelectedBlock}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
