"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import BlockDisplayLayout from "../organisms/display/BlockDisplayLayout";
import FormSubmissionLayout from "../organisms/FormSubmissionLayout";
import StatementDisplayContainer from "../containers/display/StatementDisplayContainer";
import { getPaginatedPublishedBlocks } from "@/services/form";
import { BlockType } from "@/types";

type PaginatedBlocksResponse = {
  blocks: BlockType;
  totalCount: number;
  totalPages: number;
};

// Map each block type to its corresponding React component
const BlockDisplayMap: Record<
  string,
  React.FC<{ selectedBlockData: BlockType }>
> = {
  statement: StatementDisplayContainer,
};

export default function FormSubmission() {
  const [page, setPage] = useState(1);
  const params = useParams();
  const formId = params.formId as string;

  const { data, isLoading, isError, error } = useQuery<PaginatedBlocksResponse>(
    {
      queryKey: ["forms", formId, "published-blocks", page],
      queryFn: () => getPaginatedPublishedBlocks(formId, page, 1),
      placeholderData: keepPreviousData,
    }
  );

  if (isLoading || !data?.blocks || isError) {
    return error ? JSON.stringify(error) : null;
  }

  const selectedBlockData = data.blocks;

  const coverImageUrl =
    (selectedBlockData.coverImageOrigin || "") +
    (selectedBlockData.coverImagePath || "");
  const coverImageLayout = selectedBlockData.coverImageLayout || "stack";

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

  const handleClickUp = () => setPage((prevPage) => prevPage - 1);
  const handleClickDown = () => setPage((prevPage) => prevPage + 1);

  const BlockDisplayComponent = BlockDisplayMap[selectedBlockData.type] || null;

  return (
    <FormSubmissionLayout
      currentStep={page}
      totalSteps={data.totalPages}
      showNavigation={page > 1}
      onDownClick={handleClickDown}
      onUpClick={handleClickUp}
    >
      <div
        className="flex-1 bg-gray-100 flex items-center justify-center mt-2 rounded-2xl p-4 flex-col overflow-y-auto scrollbar-hide"
        style={backgroundStyle}
      >
        <BlockDisplayLayout
          title={selectedBlockData.title || ""}
          buttonText={selectedBlockData.buttonText || ""}
          description={selectedBlockData.descriptionHtml || ""}
          textAlign={selectedBlockData.textAlign || "left"}
          imageUrl={coverImageUrl}
          imageLayout={coverImageLayout}
          onButtonClick={handleNextOrSubmitButtonClicked}
        >
          {BlockDisplayComponent && (
            <BlockDisplayComponent selectedBlockData={selectedBlockData} />
          )}
        </BlockDisplayLayout>
      </div>
    </FormSubmissionLayout>
  );
}
