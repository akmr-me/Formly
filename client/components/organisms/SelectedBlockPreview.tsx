import { BlockType, BlockTypeEnum } from "@/types";
import BlockDisplayLayout from "./display/BlockDisplayLayout";
import { DefaultBlockData } from "@/constants";
import {
  LongText,
  NumberInput,
  TextInput,
  URLInput,
} from "../molecules/block/InputBlock";
import AddressBlockContainer from "../containers/blocks/custom/AddressBlockContainer";

const PreviewBlockMap: Record<
  BlockTypeEnum,
  React.FC<{
    selectedBlockData: BlockType;
    disabled?: boolean;
    placeholder?: string;
  }>
> = {
  statement: () => null,
  shortText: TextInput,
  longText: LongText,
  number: NumberInput,
  websiteUrl: URLInput,
  // Selected Text input for visuals only
  date: TextInput,
  address: AddressBlockContainer,
};

export default function SelectedBlockPreview({
  type,
}: {
  type: BlockTypeEnum;
}) {
  const PreviewBlock = PreviewBlockMap[type || ""] || null;
  const selectedBlockData = DefaultBlockData[type];
  console.log({ selectedBlockData });
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 w-full pointer-events-none opacity-50">
      <BlockDisplayLayout
        title={selectedBlockData.displayTitle}
        buttonText={"Next ✔️"}
        description={selectedBlockData.displayDescription}
        textAlign={"left"}
        imageUrl={""}
        imageLayout={""}
        displayLayoutSize="small"
      >
        {Boolean(PreviewBlock) && (
          <PreviewBlock
            selectedBlockData={selectedBlockData}
            // disabled
            placeholder={selectedBlockData.displayPlaceholder}
          />
        )}
      </BlockDisplayLayout>
    </div>
  );
}
