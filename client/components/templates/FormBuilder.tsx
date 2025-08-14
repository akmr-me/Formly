"use client";
import React, { useState } from "react";
import BlockDisplayHeader from "@/components/organisms/BlockDisplayHeder";
import BlockDisplay from "@/components/organisms/BlockDisplay";
import Editor from "@/components/organisms/Editor";
import MobileWarning from "@/components/molecules/MobileWarning";
import FormBuilderHeader from "@/components/organisms/FormBuilderHeader";
import ChooseBlockModal from "../organisms/ChooseBlockModal";
import { formBlocks } from "@/constants/blockTypes";
import { useSearchParams } from "next/navigation";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getBlockById } from "@/services/block";
import { LoaderCircle } from "lucide-react";
import LeftSideBarContainer from "../containers/LeftSideBarContainer";
import FormBuilderHeaderContainer from "../containers/FormBuilderHeaderContainer";

const FormBuilder = () => {
  const searchParams = useSearchParams();
  const blockId = searchParams.get("block_id");

  const {
    data: selectedBlockData = {},
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["block", blockId],
    queryFn: () => getBlockById(blockId as string),
    placeholderData: keepPreviousData,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [shouldShakeTitleInput, setShouldShakeTitleInput] = useState(false);
  const [shouldShakeButtonTextInput, setShouldShakeButtonTextInput] =
    useState(false);

  const handleOpenChooseBlockModal = () => setIsModalOpen(true);

  const triggerShakeTitleInput = () => {
    setShouldShakeTitleInput(true);
    setTimeout(() => setShouldShakeTitleInput(false), 500);
  };

  const triggerShakeButtonTextInput = () => {
    setShouldShakeButtonTextInput(true);
    setTimeout(() => setShouldShakeButtonTextInput(false), 500);
  };

  return (
    <div className="relative h-screen flex flex-col bg-gray-50">
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50 transition-opacity duration-300">
          <LoaderCircle className="animate-spin text-white w-12 h-12" />
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
            <ChooseBlockModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              blockTypes={formBlocks}
            />
            <BlockDisplayHeader
              handleOpenChooseBlockModal={handleOpenChooseBlockModal}
            />
            <div className="h-full relative overflow-hidden">
              <BlockDisplay
                selectedBlockData={selectedBlockData}
                triggerShakeButtonTextInput={triggerShakeButtonTextInput}
                triggerShakeTitleInput={triggerShakeTitleInput}
              />
            </div>
          </div>

          {/* Right Sidebar */}
          <Editor
            selectedBlockData={selectedBlockData}
            shouldShakeButtonTextInput={shouldShakeButtonTextInput}
            shouldShakeTitleInput={shouldShakeTitleInput}
          />
        </div>
      </div>
    </div>
  );
};

export default FormBuilder;
