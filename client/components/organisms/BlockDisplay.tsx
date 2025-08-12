import { BlockType } from "@/types";
import BlockDisplayLayout from "./display/BlockDisplayLayout";

type BlockDisplayProps = {
  selectedBlockData: BlockType;
  backgroundColor?: string;
};
export default function BlockDisplay({
  selectedBlockData,

  backgroundColor = "#b59a94",
}: BlockDisplayProps) {
  console.log("slected bloc", selectedBlockData);
  return (
    <div
      className="flex-1 bg-gray-100 flex items-center justify-center p-8 mt-2 rounded-2xl flex-col"
      style={{ backgroundColor }}
    >
      <BlockDisplayLayout
        title={selectedBlockData.title}
        description={selectedBlockData.description}
        buttonText={selectedBlockData.buttonText}
      >
        {null}
      </BlockDisplayLayout>
    </div>
  );
}
