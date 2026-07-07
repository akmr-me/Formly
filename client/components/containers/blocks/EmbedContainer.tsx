import Embed from "@/components/molecules/editor/Embed";
import { useUpdateCommonBlockFields } from "@/hooks/useUpdateCommonBlockFields";
import { BlockType } from "@/types";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

type EmbedContainerProp = {
  selectedBlockData: BlockType;
};

export default function EmbedContainer({
  selectedBlockData,
}: EmbedContainerProp) {
  const { optionalConfig } = selectedBlockData;
  const currentEmbedUrl = getEmbedUrl(optionalConfig);
  const searchParams = useSearchParams();
  const blockId = searchParams.get("block_id") as string;
  const { mutate } = useUpdateCommonBlockFields(blockId, "statement");
  const [embedUrl, setEmbedUrl] = useState(currentEmbedUrl);

  const handleEmbedUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmbedUrl(value);
  };

  const handleUpdateEmbedUrl = () => {
    if (embedUrl === currentEmbedUrl) return;
    mutate({ optionalConfig: { embed: embedUrl } });
  };

  //   In case of fetched from db/network
  useEffect(() => {
    setEmbedUrl(currentEmbedUrl);
  }, [currentEmbedUrl]);

  return (
    <Embed
      value={embedUrl}
      onChange={handleEmbedUrlChange}
      handleUpdateEmbedUrl={handleUpdateEmbedUrl}
    />
  );
}

function getEmbedUrl(optionalConfig: BlockType["optionalConfig"]) {
  return typeof optionalConfig?.embed === "string" ? optionalConfig.embed : "";
}
