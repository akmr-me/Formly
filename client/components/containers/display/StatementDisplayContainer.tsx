import Iframe from "@/components/molecules/Iframe";
import { BlockType } from "@/types";

type StatementDisplayContainerProps = {
  selectedBlockData: BlockType;
};

export default function StatementDisplayContainer({
  selectedBlockData,
}: StatementDisplayContainerProps) {
  const { optionalConfig } = selectedBlockData || {};
  const embed = optionalConfig?.embed;
  if (typeof embed !== "string" || !embed) return null;
  return (
    <div className="flex items-center justify-center pb-4">
      <Iframe src={embed} />
    </div>
  );
}
