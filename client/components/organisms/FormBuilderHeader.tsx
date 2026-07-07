import {
  ArrowLeft,
  BarChart3,
  Eye,
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
  responsesUrl: string;
};

export default function FormBuilderHeader({
  onPublish,
  formStatus,
  isPublishing,
  formUrl,
  responsesUrl,
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
      </div>
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href={responsesUrl}>
            <BarChart3 className="w-4 h-4 mr-1" />
            Responses
          </Link>
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
        <Button
          className="bg-black text-white hover:bg-gray-800 ml-5"
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
