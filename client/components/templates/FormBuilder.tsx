"use client";

import React, { useCallback, useState } from "react";
import BlockDisplayHeader from "@/components/organisms/BlockDisplayHeder";
import BlockDisplay from "@/components/organisms/BlockDisplay";
import Editor from "@/components/organisms/Editor";
import MobileWarning from "@/components/molecules/MobileWarning";
import { useSearchParams } from "next/navigation";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getBlockById } from "@/services/block";
import { LoaderCircle } from "lucide-react";
import LeftSideBarContainer from "../containers/LeftSideBarContainer";
import FormBuilderHeaderContainer from "../containers/FormBuilderHeaderContainer";
import ChooseBlockModalContainer from "../containers/blocks/ChooseBlockModalContainer";
import { BlockType } from "@/types";
import { cn } from "@/lib/utils";

const FormBuilder = () => {
  const searchParams = useSearchParams();
  const blockId = searchParams.get("block_id");

  const {
    data: blockData,
    isLoading,
    isError,
    error,
  } = useQuery<{ data: BlockType }>({
    queryKey: ["block", blockId],
    queryFn: () => getBlockById(blockId as string),
    enabled: !!blockId,
    placeholderData: keepPreviousData,
  });

  const selectedBlockData = blockData?.data ?? {};

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [shouldShakeTitleInput, setShouldShakeTitleInput] = useState(false);
  const [shouldShakeButtonTextInput, setShouldShakeButtonTextInput] =
    useState(false);

  const handleOpenChooseBlockModal = () => setIsModalOpen(true);
  console.log({ isModalOpen });
  const triggerShakeTitleInput = useCallback(() => {
    setShouldShakeTitleInput(true);
    setTimeout(() => setShouldShakeTitleInput(false), 500);
  }, []);

  const triggerShakeButtonTextInput = useCallback(() => {
    setShouldShakeButtonTextInput(true);
    setTimeout(() => setShouldShakeButtonTextInput(false), 500);
  }, []);

  return (
    <div className="relative h-screen flex flex-col bg-gray-50">
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-50 transition-opacity duration-300">
          <LoaderCircle className="animate-spin text-black w-12 h-12" />
        </div>
      )}

      <MobileWarning />

      <div className="hidden md:flex flex-col h-screen">
        <FormBuilderHeaderContainer />

        <div className="flex flex-1 overflow-hidden">
          <LeftSideBarContainer
            handleOpenChooseBlockModal={handleOpenChooseBlockModal}
          />

          <div className="flex-1 flex flex-col p-2 bg-white justify-between relative">
            <ChooseBlockModalContainer
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              setIsOpen={setIsModalOpen}
            />
            <BlockDisplayHeader
              handleOpenChooseBlockModal={handleOpenChooseBlockModal}
            />
            <div
              className={cn(
                "h-full relative overflow-hidden",
                isLoading && "opacity-50"
              )}
            >
              <BlockDisplay
                selectedBlockData={selectedBlockData as BlockType}
                triggerShakeButtonTextInput={triggerShakeButtonTextInput}
                triggerShakeTitleInput={triggerShakeTitleInput}
              />
            </div>
          </div>

          {/* Right Sidebar */}
          {isModalOpen ? (
            <div className="w-95 bg-white border-l border-gray-200 overflow-y-auto" />
          ) : (
            <Editor
              selectedBlockData={selectedBlockData as BlockType}
              shouldShakeButtonTextInput={shouldShakeButtonTextInput}
              shouldShakeTitleInput={shouldShakeTitleInput}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default FormBuilder;
