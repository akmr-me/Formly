import {
  ArrowLeft,
  Eye,
  Settings,
  Share,
  Undo2,
  Redo2,
  Link2,
  Crown,
} from "lucide-react";
import { Button } from "../ui/button";
import { PublishStatusType } from "@/types";
import Link from "next/link";

type FormBuilderHeaderProps = {
  onPublish: () => void;
  formStatus: PublishStatusType;
  isPublishing: boolean;
  formUrl: string;
};

export default function FormBuilderHeader({
  onPublish,
  formStatus,
  isPublishing,
  formUrl,
}: FormBuilderHeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <ArrowLeft className="w-5 h-5 text-gray-600" />
        <h1 className="text-lg font-semibold">My Form</h1>
      </div>

      <div className="flex items-center space-x-2">
        <Button
          variant="secondary"
          size="sm"
          className="text-blue-600 flex flex-col cursor-not-allowed"
          disabled
        >
          <Eye className="w-4 h-4 mr-1" />
          Build
        </Button>
        <Button variant="ghost" size="sm" disabled>
          <Settings className="w-4 h-4 mr-1" />
          Integrate
        </Button>
        <Button variant="ghost" size="sm" disabled>
          <Share className="w-4 h-4 mr-1" />
          Share
        </Button>
        <Button variant="ghost" size="sm" disabled>
          <Eye className="w-4 h-4 mr-1" />
          Results
        </Button>
      </div>
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="sm" disabled>
          <Undo2 className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="sm" disabled>
          <Redo2 className="w-4 h-4" />
        </Button>
        <Link
          // variant="ghost"
          // size="sm"
          type="link"
          href={formUrl || ""}
          target="_blank"
        >
          <Link2 className="w-4 h-4" />
        </Link>
        <Button variant="ghost" size="sm" disabled>
          <Share className="w-4 h-4" />
        </Button>
        <Button
          className="bg-black text-white hover:bg-gray-800"
          onClick={onPublish}
          disabled={isPublishing || formStatus === "publish"}
        >
          <Crown className="w-4 h-4 mr-1" />
          {isPublishing ? "Publishing..." : "Publish"}
        </Button>{" "}
      </div>
    </header>
  );
}
