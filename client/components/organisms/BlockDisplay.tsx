import { BlockType } from "@/types";
import BlockDisplayLayout from "./display/BlockDisplayLayout";
import StatementDisplayContainer from "../containers/display/StatementDisplayContainer";

const BlockDisplayMap: Record<string, React.FC<T>> = {
  statement: StatementDisplayContainer,
};

type BlockDisplayProps = {
  selectedBlockData: BlockType;
  backgroundColor?: string;
  triggerShakeTitleInput: () => void;
  triggerShakeButtonTextInput: () => void;
};

export default function BlockDisplay({
  selectedBlockData,
  backgroundColor = "#b59a94",
  triggerShakeTitleInput,
  triggerShakeButtonTextInput,
}: BlockDisplayProps) {
  const coverImageUrl =
    (selectedBlockData?.coverImageOrigin || "") +
    (selectedBlockData?.coverImagePath || "");
  const coverImageLayout = selectedBlockData?.coverImageLayout || "stack";

  const backgroundStyle =
    coverImageLayout === "wallpaper" && coverImageUrl
      ? {
          backgroundImage: `url("${encodeURI(coverImageUrl)}")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }
      : { backgroundColor };

  const BlockDisplayComponent = BlockDisplayMap[selectedBlockData.type] || null;

  return (
    <div
      className="flex-1 bg-gray-100 flex items-center justify-center mt-2 rounded-2xl p-4 flex-col overflow-y-auto scrollbar-hide"
      style={backgroundStyle}
    >
      <BlockDisplayLayout
        title={selectedBlockData.title}
        buttonText={selectedBlockData.buttonText}
        description={selectedBlockData.descriptionHtml}
        textAlign={selectedBlockData.textAlign}
        imageUrl={coverImageUrl}
        imageLayout={coverImageLayout}
        onButtonClick={triggerShakeButtonTextInput}
        onHeaderClick={triggerShakeTitleInput}
      >
        {Boolean(BlockDisplayComponent) && (
          <BlockDisplayComponent selectedBlockData={selectedBlockData} />
        )}
      </BlockDisplayLayout>
    </div>
  );
}
