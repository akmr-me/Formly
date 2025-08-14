import { BlockType } from "@/types";
import BlockDisplayLayout from "./display/BlockDisplayLayout";
import StatementDisplayContainer from "../containers/display/StatementDisplayContainer";
import { DefaultBlockData } from "@/constants";
import {
  LongText,
  NumberInput,
  TextInput,
  URLInput,
} from "../molecules/block/InputBlock";

const BlockDisplayMap: Record<string, React.FC<T>> = {
  statement: StatementDisplayContainer,
  shortText: TextInput,
  longText: LongText,
  number: NumberInput,
  websiteUrl: URLInput,
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
  const DefaultDisplayData = DefaultBlockData[selectedBlockData.type] || {};

  return (
    <div
      className="flex-1 bg-gray-100 flex items-center justify-center mt-2 rounded-2xl p-8 flex-col overflow-hidden h-full"
      style={backgroundStyle}
    >
      <BlockDisplayLayout
        title={selectedBlockData.title || DefaultDisplayData.displayQuestion}
        buttonText={selectedBlockData.buttonText}
        required={selectedBlockData.required}
        description={selectedBlockData.descriptionHtml}
        textAlign={selectedBlockData.textAlign}
        imageUrl={coverImageUrl}
        imageLayout={coverImageLayout}
        onButtonClick={triggerShakeButtonTextInput}
        onHeaderClick={triggerShakeTitleInput}
      >
        {Boolean(BlockDisplayComponent) && (
          <div className="mb-4 pointer-events-none">
            <BlockDisplayComponent
              selectedBlockData={selectedBlockData}
              placeholder={
                selectedBlockData.placeholder ||
                DefaultDisplayData.displayPlaceholder
              }
            />
          </div>
        )}
      </BlockDisplayLayout>
    </div>
  );
}
