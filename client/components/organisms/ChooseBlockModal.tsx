import React from "react";
import { Button } from "@/components/ui/button";
import { X, ArrowRight } from "lucide-react";
import { BlockType } from "@/types";
import BlockListSideBarWithSearch from "./BlockListSideBarWithSearch";
import SelectedBlockPreview from "./SelectedBlockPreview";
import NoBlockSelected from "./previews/NoBlock";
import PreviewLayout from "./previews/PreviewLayout";

export type ChooseBlockModalProps = {
  isOpen: boolean;
  onClose: () => void;
  selectedBlock: string;
  setSelectedBlock: React.Dispatch<React.SetStateAction<string>>;
  selectedBlockData: BlockType;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onCreateNewBlock?: () => void;
};

const ChooseBlockModal = ({
  isOpen,
  onClose,
  selectedBlock,
  setSelectedBlock,
  selectedBlockData,
  onCreateNewBlock,
}: ChooseBlockModalProps) => {
  if (!isOpen) return null;
  console.log({ selectedBlockData });

  return (
    <div className="absolute inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 px-4 py-2">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl my-2 h-full">
        <div className="flex items-center justify-between p-6 border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-900">
            Choose your block
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="p-1 hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="flex h-[520px]">
          {/* Left Sidebar - Block Types */}
          <BlockListSideBarWithSearch
            selectedBlock={selectedBlock}
            setSelectedBlock={setSelectedBlock}
          />

          {/* Right Content Area - Block Preview */}
          <div className="flex-1 flex flex-col border border-gray-400 rounded-xl mx-4 overflow-y-auto">
            {selectedBlockData ? (
              <>
                {/* Block Preview */}
                <PreviewLayout
                  label={selectedBlockData.label}
                  description={selectedBlockData.description}
                >
                  <SelectedBlockPreview type={selectedBlockData.type} />
                </PreviewLayout>

                {/* Use Block Button */}
                <div className="flex items-center justify-center">
                  <Button
                    className="bg-gray-800 hover:bg-gray-900 text-white py-3 text-lg font-medium"
                    onClick={onCreateNewBlock}
                  >
                    Use this block
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </>
            ) : (
              <NoBlockSelected />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChooseBlockModal;
