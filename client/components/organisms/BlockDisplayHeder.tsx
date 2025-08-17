import { Plus } from "lucide-react";
import { Button } from "../ui/button";

type BlockDisplayHeaderProps = {
  handleOpenChooseBlockModal: () => void;
};

export default function BlockDisplayHeader({
  handleOpenChooseBlockModal,
}: BlockDisplayHeaderProps) {
  return (
    <div className="bg-gray-300 border-b border-gray-200 px-4 py-3 flex items-center space-x-4 rounded-4xl w-full">
      <div className="flex items-center">
        <Button
          variant="outline"
          size="sm"
          onClick={handleOpenChooseBlockModal}
        >
          <Plus className="w-4 h-4 mr-1" />
          Add Block
        </Button>
      </div>
    </div>
  );
}
