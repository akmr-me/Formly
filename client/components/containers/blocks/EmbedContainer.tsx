import Embed from "@/components/molecules/editor/Embed";
import { DefaultDebounceTime } from "@/constants";
import { useUpdateCommonBlockFields } from "@/hooks/useUpdateCommonBlockFields";
import { isValidUrl } from "@/lib/utils";
import { BlockType } from "@/types";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { useDebouncedCallback } from "use-debounce";

type EmbedContainerProp = {
  selectedBlockData: BlockType;
};

export default function EmbedContainer({
  selectedBlockData,
}: EmbedContainerProp) {
  const { optionalConfig } = selectedBlockData;
  const searchParams = useSearchParams();
  const blockId = searchParams.get("block_id") as string;
  const { mutate } = useUpdateCommonBlockFields(blockId, "statement");
  const [embedUrl, setEmbedUrl] = useState(optionalConfig?.embed);

  const debouncedEmbedUrlUpdate = useDebouncedCallback((value: string) => {
    if (isValidUrl(value)) mutate({ optionalConfig: { embed: value } });
    else toast.error("Not a valid url");
  }, DefaultDebounceTime);

  const handleEmbedUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmbedUrl(value);
  };

  const handleUpdateEmbedUrl = () => {
    if (embedUrl == selectedBlockData.optionalConfig?.embed) return;
    mutate({ optionalConfig: { embed: embedUrl } });
  };

  //   In case of fetched from db/network
  useEffect(() => {
    setEmbedUrl(selectedBlockData.optionalConfig?.embed);
  }, [selectedBlockData.optionalConfig?.embed]);

  return (
    <Embed
      value={embedUrl}
      onChange={handleEmbedUrlChange}
      handleUpdateEmbedUrl={handleUpdateEmbedUrl}
    />
  );
}
