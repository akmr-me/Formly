import { BlockType } from "@/types";
import BlockDisplayLayout from "./display/BlockDisplayLayout";

type BlockDisplayProps = {
  selectedBlockData: BlockType;
  backgroundColor?: string;
};

export default function BlockDisplay({
  selectedBlockData,
  backgroundColor = "#b59a94",
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

  return (
    <div
      className="flex-1 bg-gray-100 flex items-center justify-center p-8 mt-2 rounded-2xl flex-col"
      style={backgroundStyle}
    >
      <BlockDisplayLayout
        title={selectedBlockData.title}
        buttonText={selectedBlockData.buttonText}
        description={selectedBlockData.descriptionHtml}
        textAlign={selectedBlockData.textAlign}
        imageUrl={coverImageUrl}
        imageLayout={coverImageLayout}
      >
        {null}
      </BlockDisplayLayout>
    </div>
  );
}
