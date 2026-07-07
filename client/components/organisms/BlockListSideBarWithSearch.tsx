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
    <div className="relative flex h-full w-72 flex-col">
      <div className="border-b border-gray-200 bg-white p-4">
        <Input
          placeholder="Search blocks.."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white"
        />
      </div>

      <div className="scrollbar-hide flex-1 overflow-y-auto p-4">
        <div className="space-y-2">
          {filteredBlocks.map((block) => (
            <BlockInfoCreateNewBlockContainer
              key={block.id}
              {...block}
              position={Number(block.id)}
              selectedBlockId={selectedBlock}
              onClickHandler={setSelectedBlock}
              HoverComponent={<ArrowRight />}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
