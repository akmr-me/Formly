import InputWithLabel from "../molecules/editor/InputWithLabel";
import Description from "../molecules/editor/Description";
import Embed from "../molecules/editor/Embed";
import TextAlign from "../molecules/editor/TextAlign";
import CoverImage from "../molecules/editor/CoverImage";
import { ImageLayout } from "../molecules/editor/ImageLayout";
import { BlockType } from "@/types";

type EditorProp = {
  selectedBlockData: BlockType;
};

export default function Editor({ selectedBlockData }: EditorProp) {
  const { title, buttonText, textAlign } = selectedBlockData || {};
  console.log("editor sle", selectedBlockData);
  return (
    <div className="w-95 bg-white border-l border-gray-200 overflow-y-auto">
      <div className="p-4 space-y-6">
        {/* Title Section */}
        <InputWithLabel title="Title" value={title || ""} setValue={() => {}} />

        {/* Description Section */}
        <Description />

        {/* Embed Section */}
        <Embed />

        {/* Text Align Section */}
        <TextAlign textAlign={textAlign} />

        {/* Button Text Section */}
        <InputWithLabel
          title="Button Text"
          value={buttonText || ""}
          setValue={() => {}}
        />

        {/* Cover Image Section */}
        <CoverImage />
        <ImageLayout />
      </div>
    </div>
  );
}
