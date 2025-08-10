import { Code, Palette, Plus, Play, Settings, Eye, Crown } from "lucide-react";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";

type BlockDisplayHeaderProps = {
  handleOpenChooseBlockModal: () => void;
};

export default function BlockDisplayHeader({
  handleOpenChooseBlockModal,
}: BlockDisplayHeaderProps) {
  return (
    <div className="bg-gray-300 border-b border-gray-200 px-4 py-3 flex items-center space-x-4 rounded-4xl">
      <div className="flex items-center">
        <Button
          variant="outline"
          size="sm"
          onClick={handleOpenChooseBlockModal}
        >
          <Plus className="w-4 h-4 mr-1" />
          Add Block
        </Button>

        <Separator orientation="vertical" className="mx-0.5 h-full" />

        <Button variant="ghost" size="sm">
          <Palette className="w-4 h-4 mr-1" />
          Design
        </Button>

        <Separator orientation="vertical" className="mx-0.5 h-full" />

        <Button variant="ghost" size="sm">
          <Code className="w-4 h-4 mr-1" />
          Logic
        </Button>
        <Separator orientation="vertical" className="mx-0.5 h-full" />

        <Button variant="ghost" size="sm">
          <Play className="w-4 h-4" />
        </Button>
        <Separator orientation="vertical" className="mx-0.5 h-full" />

        <Button variant="ghost" size="sm">
          <Settings className="w-4 h-4" />
        </Button>

        <Button variant="ghost" size="sm">
          <Eye className="w-4 h-4" />
        </Button>
      </div>

      <div className="ml-auto">
        <Button className="bg-red-500 hover:bg-red-600 text-white">
          <Crown className="w-4 h-4 mr-1" />
          Buy PRO
        </Button>
      </div>
    </div>
  );
}
