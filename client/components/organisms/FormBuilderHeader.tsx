import {
  ArrowLeft,
  BarChart3,
  Code2,
  Eye,
  Link2,
  Crown,
  LogOut,
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
  onLogout: () => void;
  formId?: string;
  onOpenEmbed?: () => void;
  canEmbed?: boolean;
};

export default function FormBuilderHeader({
  onPublish,
  formStatus,
  isPublishing,
  formUrl,
  responsesUrl,
  onLogout,
  formId,
  onOpenEmbed,
  canEmbed = false,
}: FormBuilderHeaderProps) {
  return (
    <header className="grid min-h-16 grid-cols-[1fr_auto_1fr] items-center gap-4 border-b border-gray-200 bg-white px-4 py-3">
      <div className="flex min-w-0 items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
        </Button>
        <div className="min-w-0">
          <h1 className="truncate text-lg font-semibold">Formly</h1>
          {formId && (
            <p className="truncate text-xs text-gray-500">Form {formId}</p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-center">
        <Button
          variant="secondary"
          size="sm"
          className="cursor-not-allowed text-blue-600"
          disabled
        >
          <Eye className="w-4 h-4" />
          Build
        </Button>
      </div>

      <div className="flex min-w-0 items-center justify-end gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href={responsesUrl}>
            <BarChart3 className="w-4 h-4" />
            Responses
          </Link>
        </Button>
        <Button variant="ghost" size="icon" asChild>
          <Link href={formUrl || ""} target="_blank">
            <Link2 className="w-4 h-4" />
          </Link>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onOpenEmbed}
          disabled={!canEmbed}
          title={
            canEmbed
              ? "Copy embed code"
              : "Publish the form to enable embedding"
          }
        >
          <Code2 className="w-4 h-4" />
          Embed
        </Button>
        <Button
          className="bg-black text-white hover:bg-gray-800"
          onClick={onPublish}
          disabled={isPublishing || formStatus === "publish"}
        >
          <Crown className="w-4 h-4" />
          {isPublishing ? "Publishing..." : "Publish"}
        </Button>
        <Button variant="ghost" size="sm" onClick={onLogout}>
          <LogOut className="w-4 h-4" />
          Logout
        </Button>
      </div>
    </header>
  );
}
