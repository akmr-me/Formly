import ChooseBlockModal, {
  ChooseBlockModalProps,
} from "@/components/organisms/ChooseBlockModal";
import { CreateNewBlockDataMap } from "@/constants";
import { formBlocks } from "@/constants/blockTypes";
import { useCreateNewBlock } from "@/hooks/blocks/useCreateNewBlock";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function ChooseBlockModalContainer(
  props: Omit<
    ChooseBlockModalProps,
    "selectedBlockData" | "selectedBlock" | "setSelectedBlock"
  >
) {
  const params = useParams();
  const formId = params.formId as string;
  const [selectedBlock, setSelectedBlock] = useState<string>("0");
  const { mutate, isPending } = useCreateNewBlock(formId);

  const selectedBlockData = formBlocks.find(
    (block) => block.id === selectedBlock
  );

  const handleCreateNewBlock = () => {
    if (!selectedBlockData?.type) {
      toast.error("Please select a block type first.");
      return;
    }
    const defaultData = CreateNewBlockDataMap[selectedBlockData.type];
    console.log("defaultData", defaultData);
    mutate(
      { ...defaultData },
      {
        onSuccess() {
          // close modal
          props.setIsOpen(false);
        },
      }
    );
  };
  return (
    <ChooseBlockModal
      {...props}
      selectedBlockData={selectedBlockData}
      selectedBlock={selectedBlock}
      setSelectedBlock={setSelectedBlock}
      onCreateNewBlock={handleCreateNewBlock}
    />
  );
}
