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

const FormBuilder = () => {
  const [selectedBlock, setSelectedBlock] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenChooseBlockModal = () => setIsModalOpen(true);

  const selectedBlockData = formBlocks.find(
    (block) => block.id === selectedBlock
  );

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Mobile Warning */}
      <MobileWarning />

      {/* Desktop Layout */}
      <div className="hidden md:flex flex-col h-screen">
        {/* Main Header */}
        <FormBuilderHeader />

        <div className="flex flex-1 overflow-hidden">
          {/* Left Sidebar */}
          <LeftSideBar
            selectedBlock={selectedBlock}
            setSelectedBlock={setSelectedBlock}
            handleOpenChooseBlockModal={handleOpenChooseBlockModal}
          />

          {/* Center Content */}
          <div className="flex-1 flex flex-col p-2 bg-white justify-between relative">
            <ChooseBlockModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              blockTypes={formBlocks}
            />
            {/* Center Header */}
            <BlockDisplayHeader
              handleOpenChooseBlockModal={handleOpenChooseBlockModal}
            />

            {/* Main Block Area */}
            <BlockDisplay selectedBlockData={selectedBlockData} />
          </div>

          {/* Right Sidebar */}
          <Editor />
        </div>
      </div>
    </div>
  );
};

export default FormBuilder;
