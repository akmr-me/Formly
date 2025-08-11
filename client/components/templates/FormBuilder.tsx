"use client";
import React, { useState } from "react";
import BlockDisplayHeader from "@/components/organisms/BlockDisplayHeder";
import BlockDisplay from "@/components/organisms/BlockDisplay";
import Editor from "@/components/organisms/Editor";
import MobileWarning from "@/components/organisms/MobileWarning";
import FormBuilderHeader from "@/components/organisms/FormBuilderHeader";
import LeftSideBar from "@/components/organisms/LeftSideBar";
import ChooseBlockModal from "../organisms/ChooseBlockModal";
import { formBlocks } from "@/constants/blockTypes";
import { useSearchParams } from "next/navigation";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getBlockById } from "@/services/block";
import { LoaderCircle } from "lucide-react";

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
  console.log(selectedBlockData);
  const [selectedBlock, setSelectedBlock] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenChooseBlockModal = () => setIsModalOpen(true);

  return (
    <div className="relative h-screen flex flex-col bg-gray-50">
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50 transition-opacity duration-300">
          <LoaderCircle className="animate-spin text-white w-12 h-12" />
        </div>
      )}

      <MobileWarning />

      <div className="hidden md:flex flex-col h-screen">
        <FormBuilderHeader />

        <div className="flex flex-1 overflow-hidden">
          <LeftSideBar
            selectedBlock={selectedBlock}
            setSelectedBlock={setSelectedBlock}
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

            <BlockDisplay selectedBlockData={selectedBlockData} />
          </div>

          {/* Right Sidebar */}
          <Editor selectedBlockData={selectedBlockData} />
        </div>
      </div>
    </div>
  );
};

export default FormBuilder;
