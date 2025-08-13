import InputWithLabel from "../molecules/editor/InputWithLabel";
import Description from "../molecules/editor/Description";
import Embed from "../molecules/editor/Embed";
import TextAlign from "../molecules/editor/TextAlign";
import CoverImage from "../molecules/editor/CoverImage";
import { ImageLayout } from "../molecules/editor/ImageLayout";
import { BlockType, TextAlignType } from "@/types";
import { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { DefaultDebounceTime } from "@/constants";
import { useUpdateCommonBlockFields } from "@/hooks/useUpdateCommonBlockFields";
import { useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

type EditorProp = {
  selectedBlockData: BlockType;
};

export default function Editor({ selectedBlockData }: EditorProp) {
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
    console.log("Save title:", value);
    mutate({ title: value });
  }, DefaultDebounceTime);

  const debouncedButtonTextUpdate = useDebouncedCallback((value: string) => {
    console.log("Save title:", value);
    mutate({ buttonText: value });
  }, DefaultDebounceTime);

  useEffect(() => {
    if (typeof defaultTitle !== "string") setTitle("");
    else setTitle(defaultTitle);
  }, [defaultTitle]);

  useEffect(() => {
    if (typeof defaultButtonText !== "string") setButtonText("");
    else setButtonText(defaultButtonText);
  }, [defaultButtonText]);

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

  useEffect(() => {
    setTextAlign(selectedBlockData.textAlign);
  }, [selectedBlockData.textAlign]);

  return (
    <div className="w-95 bg-white border-l border-gray-200 overflow-y-auto">
      <div className="p-4 space-y-6">
        <InputWithLabel
          title="Title"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            debouncedTitleUpdate(e.target.value);
          }}
        />

        <Description mutate={mutate} selectedBlockData={selectedBlockData} />

        <Embed />

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
        />

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
