import InputWithLabel from "../molecules/editor/InputWithLabel";
import Description from "../molecules/editor/Description";
import TextAlign from "../molecules/editor/TextAlign";
import CoverImage from "../molecules/editor/CoverImage";
import { ImageLayout } from "../molecules/editor/ImageLayout";
import { BlockType, TextAlignType } from "@/types";
import React, { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { DefaultDebounceTime } from "@/constants";
import { useUpdateCommonBlockFields } from "@/hooks/useUpdateCommonBlockFields";
import { useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import EmbedContainer from "../containers/blocks/EmbedContainer";
import OptionalCommonFields from "../containers/OptionalCommonFields";
import LongTextCustomFieldsContainer from "../containers/blocks/custom/longText";
import NumberCustomFieldsContainer from "../containers/blocks/custom/number";

const OptionalEditorFieldMap: Record<string, React.FC<T>> = {
  statement: EmbedContainer,
  longText: LongTextCustomFieldsContainer,
  number: NumberCustomFieldsContainer,
};

type EditorProp = {
  selectedBlockData: BlockType;
  shouldShakeTitleInput: boolean;
  shouldShakeButtonTextInput: boolean;
};

export default function Editor({
  selectedBlockData,
  shouldShakeTitleInput,
  shouldShakeButtonTextInput,
}: EditorProp) {
  const {
    title: defaultTitle,
    buttonText: defaultButtonText,
    type,
  } = selectedBlockData || {};

  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const blockId = searchParams.get("block_id") as string;

  const [textAlign, setTextAlign] = useState<TextAlignType>(
    selectedBlockData?.textAlign
  );

  const [title, setTitle] = useState<string>(defaultTitle);
  const [buttonText, setButtonText] = useState<string>(defaultButtonText);

  const { mutate, isPending } = useUpdateCommonBlockFields(blockId, type);

  const debouncedTitleUpdate = useDebouncedCallback((value: string) => {
    mutate({ title: value });
  }, DefaultDebounceTime);

  const debouncedButtonTextUpdate = useDebouncedCallback((value: string) => {
    mutate({ buttonText: value });
  }, DefaultDebounceTime);

  const handleUploadComplete = () => {
    // invalidte cache
    queryClient.invalidateQueries({ queryKey: ["block", blockId] });
  };
  const coverImageUrl =
    (selectedBlockData?.coverImageOrigin || "") +
    (selectedBlockData?.coverImagePath || "");

  const handleUpdateAlign = (newTextAlign: TextAlignType) => {
    setTextAlign(newTextAlign);
    mutate({ textAlign: newTextAlign });
  };

  //

  useEffect(() => {
    setTextAlign(selectedBlockData.textAlign);
  }, [selectedBlockData.textAlign]);

  useEffect(() => {
    if (typeof defaultTitle !== "string") setTitle("");
    else setTitle(defaultTitle);
  }, [defaultTitle]);

  useEffect(() => {
    if (typeof defaultButtonText !== "string") setButtonText("");
    else setButtonText(defaultButtonText);
  }, [defaultButtonText]);

  const OptionalConfigFields = OptionalEditorFieldMap[type];

  return (
    <div className="w-95 bg-white border-l border-gray-200 overflow-y-auto">
      <div className="p-4 space-y-6">
        <InputWithLabel
          title={selectedBlockData?.titleLabel || "Title"}
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            debouncedTitleUpdate(e.target.value);
          }}
          shouldShakeInput={shouldShakeTitleInput}
        />
        <Description mutate={mutate} selectedBlockData={selectedBlockData} />
        {/* Optional editor block fields */}
        {Boolean(OptionalConfigFields && type === "statement") && (
          <OptionalConfigFields selectedBlockData={selectedBlockData} />
        )}
        <TextAlign
          textAlign={textAlign}
          handleUpdateAlign={handleUpdateAlign}
        />
        <InputWithLabel
          title="Button Text"
          value={buttonText}
          onChange={(e) => {
            setButtonText(e.target.value);
            debouncedButtonTextUpdate(e.target.value);
          }}
          shouldShakeInput={shouldShakeButtonTextInput}
        />
        {/* Most common Options fields */}
        <OptionalCommonFields selectedBlockData={selectedBlockData} />

        {/*  */}
        {Boolean(OptionalConfigFields && type !== "statement") && (
          <OptionalConfigFields selectedBlockData={selectedBlockData} />
        )}
        <CoverImage
          onUploadComplete={handleUploadComplete}
          uploadEndpoint={`blocks/${blockId}/upload`}
          type={type}
          imageUrl={coverImageUrl}
          coverImageLayout={selectedBlockData?.coverImageLayout}
        />
        {coverImageUrl && (
          <ImageLayout
            mutate={mutate}
            coverImageLayout={selectedBlockData?.coverImageLayout}
          />
        )}
      </div>
    </div>
  );
}
