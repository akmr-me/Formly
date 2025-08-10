import InputWithLabel from "../molecules/editor/InputWithLabel";
import Description from "../molecules/editor/Description";
import Embed from "../molecules/editor/Embed";
import TextAlign from "../molecules/editor/TextAlign";
import CoverImage from "../molecules/editor/CoverImage";
import { ImageLayout } from "../molecules/editor/ImageLayout";

export default function Editor() {
  return (
    <div className="w-95 bg-white border-l border-gray-200 overflow-y-auto">
      <div className="p-4 space-y-6">
        {/* Title Section */}
        <InputWithLabel title="Title" value="Title" setValue={() => {}} />

        {/* Description Section */}
        <Description />

        {/* Embed Section */}
        <Embed />

        {/* Text Align Section */}
        <TextAlign />

        {/* Button Text Section */}
        <InputWithLabel title="Title" value="Title" setValue={() => {}} />

        {/* Cover Image Section */}
        <CoverImage />
        <ImageLayout />
      </div>
    </div>
  );
}
