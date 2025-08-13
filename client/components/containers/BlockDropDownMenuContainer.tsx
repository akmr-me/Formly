import { useDuplicateOrDelete } from "@/hooks/blocks/useDuplicateOrDeleteBlock";
import BlockDropdownMenu from "../molecules/DropDownBlockMenu";
import { useState } from "react";
import ConfirmationDialog from "../organisms/ConfirmationDialog";
import { DeleteConfirmation } from "@/constants";

type BlockDropdownMenuContainerProps = {
  blockId: string;
  setDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function BlockDropdownMenuContainer({
  blockId,
  setDropdownOpen,
}: BlockDropdownMenuContainerProps) {
  const { deleteBlock, deleteLoading, duplicateBlock, duplicateLoading } =
    useDuplicateOrDelete(blockId);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleDelete = async () => {
    setIsDeleteOpen(true);
  };

  return (
    <>
      <BlockDropdownMenu
        onDuplicate={duplicateBlock}
        onDelete={handleDelete}
        setDropdownOpen={setDropdownOpen}
      />{" "}
      <ConfirmationDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        title={DeleteConfirmation.title}
        description={DeleteConfirmation.description}
        confirmText={DeleteConfirmation.confirmText}
        confirmVariant="destructive"
        cancelText={DeleteConfirmation.cancelText}
        onConfirm={deleteBlock}
        isLoading={deleteLoading}
      />
    </>
  );
}
