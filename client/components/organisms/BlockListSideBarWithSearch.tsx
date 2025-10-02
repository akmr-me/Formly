import { Input } from "../ui/input";
import { useState } from "react";
import { formBlocks } from "@/constants/blockTypes";
import { ArrowRight } from "lucide-react";
import BlockInfoCreateNewBlockContainer from "../containers/blocks/BlockInfoCreateNewBlockContainer";

type BlockListSideBarWithSearchProps = {
  selectedBlock: string;
  setSelectedBlock: React.Dispatch<React.SetStateAction<string>>;
};

export default function BlockListSideBarWithSearch({
  selectedBlock,
  setSelectedBlock,
}: BlockListSideBarWithSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredBlocks = formBlocks.filter((block) =>
    block.label.toLowerCase().includes(searchQuery.toLowerCase())
  );
  return (
    <div className="relative w-70 flex flex-col h-full">
      {/* Fixed Search Input */}

      {/* Scrollable Block Types List */}
      <div className="flex-1 overflow-y-auto p-4 scrollbar-hide">
        <div className="border-b fixed w-64 z-10">
          <Input
            placeholder="Search blocks.."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white"
          />
        </div>
        <div className="h-14" />
        <div className="space-y-2">
          {filteredBlocks.map((block) => (
            <BlockInfoCreateNewBlockContainer
              key={block.id}
              {...block}
              position={Number(block.id)}
              selectedBlockid={selectedBlock}
              onClickHandler={setSelectedBlock}
              HoverComponent={<ArrowRight />}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
