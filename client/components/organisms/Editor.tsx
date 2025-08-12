import InputWithLabel from "../molecules/editor/InputWithLabel";
import Description from "../molecules/editor/Description";
import Embed from "../molecules/editor/Embed";
import TextAlign from "../molecules/editor/TextAlign";
import CoverImage from "../molecules/editor/CoverImage";
import { ImageLayout } from "../molecules/editor/ImageLayout";
import { BlockType } from "@/types";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { DefaultDebounceTime } from "@/constants";

type EditorProp = {
  selectedBlockData: BlockType;
};

export default function Editor({ selectedBlockData }: EditorProp) {
  const {
    title: defaultTitle,
    buttonText: defaultButtonText,
    textAlign,
  } = selectedBlockData || {};

  const [title, setTitle] = useState<string>(defaultTitle || "");
  const [buttonText, setButtonText] = useState<string>(defaultButtonText || "");

  const debouncedTitleUpdate = useDebouncedCallback((value: string) => {
    console.log("Save title:", value);
  }, DefaultDebounceTime);

  const debouncedButtonTextUpdate = useDebouncedCallback((value: string) => {
    console.log("Save title:", value);
  }, DefaultDebounceTime);

  return (
    <div className="w-95 bg-white border-l border-gray-200 overflow-y-auto">
      <div className="p-4 space-y-6">
        <InputWithLabel
          title="Title"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value); // update immediately for instant input response
            debouncedTitleUpdate(e.target.value);
          }}
        />

        <Description />

        <Embed />

        <TextAlign textAlign={textAlign} />

        <InputWithLabel
          title="Button Text"
          value={buttonText}
          onChange={(e) => {
            setButtonText(e.target.value);
            debouncedButtonTextUpdate(e.target.value);
          }}
        />

        <CoverImage />
        <ImageLayout />
      </div>
    </div>
  );
}
