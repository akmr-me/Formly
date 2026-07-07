import { Plus } from "lucide-react";
import { Button } from "../ui/button";

type BlockDisplayHeaderProps = {
  handleOpenChooseBlockModal: () => void;
};

export default function BlockDisplayHeader({
  handleOpenChooseBlockModal,
}: BlockDisplayHeaderProps) {
  return (
    <div className="mb-2 flex w-full items-center justify-end rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
      <Button variant="outline" size="sm" onClick={handleOpenChooseBlockModal}>
        <Plus className="w-4 h-4" />
        Add Block
      </Button>
    </div>
  );
}
