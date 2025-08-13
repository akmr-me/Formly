import { useDuplicateOrDelete } from "@/hooks/blocks/useDuplicateOrDeleteBlock";
import BlockDropdownMenu from "../molecules/DropDownBlockMenu";

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

  return (
    <BlockDropdownMenu
      onDuplicate={duplicateBlock}
      onDelete={deleteBlock}
      setDropdownOpen={setDropdownOpen}
    />
  );
}
