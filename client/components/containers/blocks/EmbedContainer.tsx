import Embed from "@/components/molecules/editor/Embed";
import { useUpdateCommonBlockFields } from "@/hooks/useUpdateCommonBlockFields";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

type EmbedContainerProp = {
  selectedBlockData: {
    optionalConfig: {
      embed: string;
    };
  };
};

export default function EmbedContainer({
  selectedBlockData,
}: EmbedContainerProp) {
  const { optionalConfig } = selectedBlockData;
  const searchParams = useSearchParams();
  const blockId = searchParams.get("block_id") as string;
  const { mutate } = useUpdateCommonBlockFields(blockId, "statement");
  const [embedUrl, setEmbedUrl] = useState(optionalConfig?.embed);

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
