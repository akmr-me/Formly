"use client";
import { useParams } from "next/navigation";
import BlockDisplayLayout from "../organisms/display/BlockDisplayLayout";
import FormSubmissionLayout from "../organisms/FormSubmissionLayout";
import { useState } from "react";
import { getPaginatedPublishedBlocks } from "@/services/form";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import StatementDisplayContainer from "../containers/display/StatementDisplayContainer";

const BlockDisplayMap: Record<string, React.FC<T>> = {
  statement: StatementDisplayContainer,
};

export default function FormSubmission() {
  const [page, setPage] = useState(1);
  const params = useParams();
  const formId = params.formId as string;

  const {
    data: selectedBlockData = {},
    isLoading,
    isError,
    isPlaceholderData,
  } = useQuery({
    queryKey: ["forms", formId, "published-blocks", page],
    queryFn: () => getPaginatedPublishedBlocks(formId, page, 1),
    placeholderData: keepPreviousData,
  });
  //   Get paginated block data from formId
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
      : { backgroundColor: "#b59a94" };

  const handleNextOrSubmitButtonClicked = () => {};

  const BlockDisplayComponent =
    BlockDisplayMap[selectedBlockData?.type] || null;
  return (
    <FormSubmissionLayout>
      <div
        className="flex-1 bg-gray-100 flex items-center justify-center mt-2 rounded-2xl p-4 flex-col overflow-y-auto scrollbar-hide"
        style={backgroundStyle}
      >
        <BlockDisplayLayout
          title={selectedBlockData.title}
          buttonText={selectedBlockData.buttonText}
          description={selectedBlockData.descriptionHtml}
          textAlign={selectedBlockData.textAlign}
          imageUrl={coverImageUrl}
          imageLayout={coverImageLayout}
          onButtonClick={handleNextOrSubmitButtonClicked}
          //   onHeaderClick={triggerShakeTitleInput}
        >
          {Boolean(BlockDisplayComponent) && (
            <BlockDisplayComponent selectedBlockData={selectedBlockData} />
          )}
        </BlockDisplayLayout>
      </div>
    </FormSubmissionLayout>
  );
}
