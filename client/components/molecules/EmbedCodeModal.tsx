"use client";

import { Copy, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { getEmbedIframeCode, getEmbedUrl } from "@/lib/embed";

type EmbedCodeModalProps = {
  isOpen: boolean;
  onClose: () => void;
  formId: string;
};

export default function EmbedCodeModal({
  isOpen,
  onClose,
  formId,
}: EmbedCodeModalProps) {
  if (!isOpen) return null;

  const code = getEmbedIframeCode(formId);
  const embedUrl = getEmbedUrl(formId);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      toast.success("Embed code copied!");
    } catch {
      toast.error("Unable to copy embed code");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl rounded-xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Embed form</h2>
            <p className="mt-1 text-sm text-gray-500">
              Paste this iframe on any website to embed your published form.
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-4 px-6 py-5">
          <div>
            <p className="mb-2 text-sm font-medium text-gray-700">Embed URL</p>
            <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 break-all">
              {embedUrl}
            </div>
          </div>

          <div>
            <p className="mb-2 text-sm font-medium text-gray-700">Iframe code</p>
            <textarea
              readOnly
              value={code}
              onFocus={(event) => event.currentTarget.select()}
              className="h-40 w-full resize-none rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 font-mono text-xs text-gray-800 outline-none"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t border-gray-200 px-6 py-4">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={handleCopy}>
            <Copy className="h-4 w-4" />
            Copy embed code
          </Button>
        </div>
      </div>
    </div>
  );
}
