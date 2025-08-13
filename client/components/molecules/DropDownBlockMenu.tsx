import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical, Copy, Trash2 } from "lucide-react";

type BlockDropdownMenuProps = {
  onDuplicate: () => void;
  onDelete: () => void;
  setDropdownOpen: (open: boolean) => void;
};

const BlockDropdownMenu = ({
  onDuplicate,
  onDelete,
  setDropdownOpen,
}: BlockDropdownMenuProps) => {
  return (
    <DropdownMenu onOpenChange={setDropdownOpen}>
      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
        <Button
          variant="ghost"
          size="sm"
          className="h-4 w-6 p-0 hover:bg-gray-200 rounded cursor-pointer"
        >
          <MoreVertical className="h-4 w-4 text-gray-600" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-40 bg-white border border-gray-200 shadow-lg rounded-md"
      >
        <DropdownMenuItem
          onClick={(e) => {
            e.stopPropagation();
            onDuplicate();
          }}
          className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
        >
          {/* <Copy className="h-4 w-4" /> */}
          Duplicate
          {/* <span className="text-gray-400 text-xs ml-auto">Ctrl Shift D</span> */}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer"
        >
          {/* <Trash2 className="h-4 w-4" /> */}
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default BlockDropdownMenu;
