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
import SelectBlock from "../molecules/block/SelectBlock";

const PreviewBlockMap: Record<
  BlockTypeEnum,
  React.FC<{
    selectedBlockData: BlockType;
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
  single: SelectBlock,
  multi: SelectBlock,
  dropdown: SelectBlock,
};

export default function SelectedBlockPreview({
  type,
}: {
  type: BlockTypeEnum;
}) {
  const PreviewBlock = PreviewBlockMap[type || ""] || null;
  const displayDefaults = getPreviewDisplayDefaults(DefaultBlockData[type]);
  const selectedBlockData = createPreviewBlockData(type, displayDefaults);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 w-full pointer-events-none opacity-50">
      <BlockDisplayLayout
        title={displayDefaults.displayTitle}
        buttonText={"Next ✔️"}
        description={displayDefaults.displayDescription}
        textAlign={"left"}
        imageUrl={""}
        imageLayout={""}
        displayLayoutSize="small"
      >
        {Boolean(PreviewBlock) && (
          <PreviewBlock
            selectedBlockData={selectedBlockData}
            // disabled
            placeholder={displayDefaults.displayPlaceholder}
          />
        )}
      </BlockDisplayLayout>
    </div>
  );
}

function getPreviewDisplayDefaults(blockDefaults: unknown) {
  const defaults =
    blockDefaults && typeof blockDefaults === "object"
      ? (blockDefaults as {
          displayTitle?: string;
          displayQuestion?: string;
          displayDescription?: string;
          displayPlaceholder?: string;
        })
      : {};

  return {
    displayTitle: defaults.displayTitle ?? defaults.displayQuestion ?? "",
    displayDescription: defaults.displayDescription ?? "",
    displayPlaceholder: defaults.displayPlaceholder ?? "",
  };
}

function createPreviewBlockData(
  type: BlockTypeEnum,
  defaults: ReturnType<typeof getPreviewDisplayDefaults>
): BlockType {
  return {
    id: "preview",
    type,
    label: "",
    title: defaults.displayTitle,
    text: "",
    color: "",
    icon: "",
    description: defaults.displayDescription,
    buttonText: "Next",
    textAlign: "left",
    position: 0,
    placeholder: defaults.displayPlaceholder,
    optionalConfig: {
      options: ["Option 1", "Option 2"],
      selectType: type,
    },
  };
}
