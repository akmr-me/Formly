import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import BlockInfo from "../molecules/BlockInfo";
import { formBlocks } from "@/constants/blockTypes";
import BlockDropdownMenu from "../molecules/DropDownBlockMenu";
import { useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getFormWithBlocks } from "@/services/form";
import { BlockType } from "@/types";
import BlockDropdownMenuContainer from "../containers/BlockDropDownMenuContainer";

const BlockTypeMap = formBlocks.reduce<Record<string, BlockType>>(
  (acc, block) => {
    acc[block.type] = block;
    return acc;
  },
  {}
);
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
  const params = useParams();
  const formId = params.formId as string;
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const { data } = useQuery({
    queryKey: ["forms", formId, "blocks"],
    queryFn: () => getFormWithBlocks(formId),
    enabled: !!formId,
  });

  console.log("formId", formId, data);

  const formBlocks = (data?.blocks || []).map((block: BlockType) => ({
    ...block,
    color: BlockTypeMap[block.type].color,
  }));
  console.log(formBlocks, data);
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
          {formBlocks.map((block: BlockType, index: number) => (
            <BlockInfo
              key={block.id}
              {...block}
              label={block.title}
              position={index + 1}
              setSelectedBlock={setSelectedBlock}
              selectedBlock={selectedBlock}
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
