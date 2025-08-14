import Iframe from "@/components/molecules/Iframe";
import { BlockType } from "@/types";

type StatementDisplayContainerProps = {
  selectedBlockData: BlockType;
};

export default function StatementDisplayContainer({
  selectedBlockData,
}: StatementDisplayContainerProps) {
  const { optionalConfig } = selectedBlockData || {};
  console.log({ optionalConfig, selectedBlockData });
  if (!optionalConfig?.embed) return null;
  return (
    <div className="flex items-center justify-center pb-4">
      {optionalConfig?.embed !== undefined && (
        <Iframe src={optionalConfig.embed} />
      )}
    </div>
  );
}
