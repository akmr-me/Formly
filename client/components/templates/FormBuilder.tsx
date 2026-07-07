"use client";

import React, { useCallback, useEffect, useState } from "react";
import BlockDisplayHeader from "@/components/organisms/BlockDisplayHeder";
import BlockDisplay from "@/components/organisms/BlockDisplay";
import Editor from "@/components/organisms/Editor";
import MobileWarning from "@/components/molecules/MobileWarning";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getBlockById } from "@/services/block";
import { LoaderCircle } from "lucide-react";
import LeftSideBarContainer from "../containers/LeftSideBarContainer";
import FormBuilderHeaderContainer from "../containers/FormBuilderHeaderContainer";
import ChooseBlockModalContainer from "../containers/blocks/ChooseBlockModalContainer";
import { BlockType } from "@/types";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthProvider";
import { getFormWithBlocks } from "@/services/form";

const FormBuilder = () => {
  const searchParams = useSearchParams();
  const params = useParams();
  const router = useRouter();
  const formId = params.formId as string;
  const blockId = searchParams.get("block_id");
  const { user, isLoading: isAuthLoading } = useAuth();

  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.replace("/login");
    }
  }, [isAuthLoading, router, user]);

  const {
    data: blockData,
    isLoading,
  } = useQuery<{ data: BlockType }>({
    queryKey: ["block", blockId],
    queryFn: () => getBlockById(blockId as string),
    enabled: !!blockId && !!user,
    placeholderData: keepPreviousData,
  });
  const { data: formData, isLoading: isFormBlocksLoading } = useQuery({
    queryKey: ["forms", formId, "blocks"],
    queryFn: () => getFormWithBlocks(formId),
    enabled: !!formId && !!user,
  });

  const firstBlockId = formData?.data?.blocks?.[0]?.id;

  useEffect(() => {
    if (!blockId && firstBlockId) {
      router.replace(`/form/${formId}/build?block_id=${firstBlockId}`);
    }
  }, [blockId, firstBlockId, formId, router]);

  const selectedBlockData = blockData?.data;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [shouldShakeTitleInput, setShouldShakeTitleInput] = useState(false);
  const [shouldShakeButtonTextInput, setShouldShakeButtonTextInput] =
    useState(false);

  const handleOpenChooseBlockModal = () => setIsModalOpen(true);
  const triggerShakeTitleInput = useCallback(() => {
    setShouldShakeTitleInput(true);
    setTimeout(() => setShouldShakeTitleInput(false), 500);
  }, []);

  const triggerShakeButtonTextInput = useCallback(() => {
    setShouldShakeButtonTextInput(true);
    setTimeout(() => setShouldShakeButtonTextInput(false), 500);
  }, []);

  if (isAuthLoading || !user) {
    return (
      <div className="flex h-screen items-center justify-center text-sm text-gray-500">
        Checking your session...
      </div>
    );
  }

  const isResolvingBlock = !blockId || isFormBlocksLoading || !selectedBlockData;

  if (isResolvingBlock) {
    return (
      <div className="relative flex h-screen flex-col bg-gray-50">
        <MobileWarning />
        <div className="hidden h-screen flex-col md:flex">
          <FormBuilderHeaderContainer />
          <div className="flex flex-1 items-center justify-center text-sm text-gray-500">
            {isFormBlocksLoading || firstBlockId
              ? "Opening your form..."
              : "This form does not have any blocks yet."}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex h-screen flex-col bg-gray-50">
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-50 transition-opacity duration-300">
          <LoaderCircle className="animate-spin text-black w-12 h-12" />
        </div>
      )}

      <MobileWarning />

      <div className="hidden h-screen flex-col md:flex">
        <FormBuilderHeaderContainer />

        <div className="flex flex-1 overflow-hidden">
          <LeftSideBarContainer
            handleOpenChooseBlockModal={handleOpenChooseBlockModal}
          />

          <div className="relative flex flex-1 flex-col justify-between bg-white p-2">
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
            <div className="w-72 border-l border-gray-200 bg-white" />
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
