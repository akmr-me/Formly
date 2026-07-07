import { BlockType } from "@/types";
import BlockDisplayLayout from "./display/BlockDisplayLayout";
import StatementDisplayContainer from "../containers/display/StatementDisplayContainer";
import { DefaultBlockData } from "@/constants";
import {
  DateInput,
  LongText,
  NumberInput,
  TextInput,
  URLInput,
} from "../molecules/block/InputBlock";
import AddressBlockContainer from "../containers/blocks/custom/AddressBlockContainer";
import SelectBlock from "../molecules/block/SelectBlock";

const BlockDisplayMap: Record<
  string,
  React.FC<{ selectedBlockData: BlockType; placeholder?: string }>
> = {
  statement: StatementDisplayContainer,
  shortText: TextInput,
  longText: LongText,
  number: NumberInput,
  websiteUrl: URLInput,
  date: DateInput,
  address: AddressBlockContainer,
  single: SelectBlock,
  multi: SelectBlock,
  dropdown: SelectBlock,
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
  const defaultDisplayData = getDefaultDisplayData(
    DefaultBlockData[selectedBlockData.type as keyof typeof DefaultBlockData]
  );

  const title = selectedBlockData.title || defaultDisplayData.displayQuestion;

  return (
    <div
      className="flex-1 bg-gray-100 flex justify-center mt-2 rounded-2xl p-8 flex-col h-full"
      style={backgroundStyle}
    >
      <BlockDisplayLayout
        title={title}
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
                defaultDisplayData.displayPlaceholder
              }
            />
          </div>
        )}
      </BlockDisplayLayout>
    </div>
  );
}

function getDefaultDisplayData(blockDefaults: unknown) {
  if (!blockDefaults || typeof blockDefaults !== "object") {
    return {};
  }

  const defaults = blockDefaults as {
    displayQuestion?: string;
    displayPlaceholder?: string;
  };

  return {
    displayQuestion: defaults.displayQuestion,
    displayPlaceholder: defaults.displayPlaceholder,
  };
}
