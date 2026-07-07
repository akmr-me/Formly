import { useEffect, useState } from "react";
import { AutoFillURLParameter } from "../molecules/editor/AutoFillViaUrlParameter";
import { PlaceholderInput } from "../molecules/editor/PlaceholderInput";
import { RequiredFieldCheckbox } from "../molecules/editor/RequiredFieldCheckbox";
import { useUpdateCommonBlockFields } from "@/hooks/useUpdateCommonBlockFields";
import { useSearchParams } from "next/navigation";
import { BlockType } from "@/types";
import { useDebouncedCallback } from "use-debounce";
import { DefaultBlockData, DefaultDebounceTime } from "@/constants";

const BlockTypeHasRequiredField = [
  "shortText",
  "longText",
  "number",
  "websiteUrl",
  "date",
];
const BlockTypeHasPlaceholder = [
  "shortText",
  "longText",
  "number",
  "websiteUrl",
];
const BlockTypeHasUrlParameter = ["shortText", "number", "websiteUrl", "date"];

export default function OptionalCommonFields({
  selectedBlockData,
}: {
  selectedBlockData: BlockType;
}) {
  const { type } = selectedBlockData;
  const hasPlaceholder = BlockTypeHasPlaceholder.includes(type || "");
  const hasRequired = BlockTypeHasRequiredField.includes(type || "");
  const hasUrlParameter = BlockTypeHasUrlParameter.includes(type || "");
  const searchParams = useSearchParams();
  const blockId = searchParams.get("block_id") as string;

  const [placeholderValue, setPlaceholderValue] = useState(
    "Your answer here..."
  );
  const [isRequired, setIsRequired] = useState(false);
  const [urlParameter, setUrlParameter] = useState("");

  const { mutate } = useUpdateCommonBlockFields(blockId, type);

  // Update placeholder
  const debouncedPlaceholderUpdate = useDebouncedCallback((value: string) => {
    mutate({ placeholder: value });
  }, DefaultDebounceTime);

  // Update isRequired
  const debouncedIsRequiredUpdate = useDebouncedCallback((value: boolean) => {
    mutate({ required: value });
  }, DefaultDebounceTime);

  // Update urlParameter
  const debouncedUrlParameterUpdate = useDebouncedCallback((value: string) => {
    mutate({ urlParameter: value });
  }, DefaultDebounceTime);

  useEffect(() => {
    setPlaceholderValue(selectedBlockData.placeholder || "");
  }, [selectedBlockData.placeholder]);
  useEffect(() => {
    setIsRequired(selectedBlockData.required ?? false);
  }, [selectedBlockData.required]);
  useEffect(() => {
    setUrlParameter(selectedBlockData.urlParameter || "");
  }, [selectedBlockData.urlParameter]);

  const urlParameterConfig = getUrlParameterConfig(DefaultBlockData[type]);

  return (
    <div className="space-y-6">
      {hasPlaceholder && (
        <PlaceholderInput
          placeholder=""
          value={placeholderValue}
          onChange={(e) => {
            setPlaceholderValue(e.target.value);
            debouncedPlaceholderUpdate(e.target.value);
          }}
        />
      )}

      {hasRequired && (
        <RequiredFieldCheckbox
          checked={isRequired}
          onChange={(e: boolean) => {
            console.log(e);
            setIsRequired(e);
            debouncedIsRequiredUpdate(e);
          }}
        />
      )}

      {hasUrlParameter && (
        <AutoFillURLParameter
          placeholder={urlParameterConfig.placeholder}
          value={urlParameter}
          tooltipContent={urlParameterConfig.tooltip}
          onChange={(e) => {
            setUrlParameter(e.target.value);
            debouncedUrlParameterUpdate(e.target.value);
          }}
        />
      )}
    </div>
  );
}

function getUrlParameterConfig(blockDefaults: unknown) {
  if (
    blockDefaults &&
    typeof blockDefaults === "object" &&
    "urlParamsPlaceholder" in blockDefaults
  ) {
    const config = blockDefaults as {
      urlParamsPlaceholder?: string;
      urlParamsTooltip?: string;
    };

    return {
      placeholder: config.urlParamsPlaceholder ?? "",
      tooltip: config.urlParamsTooltip,
    };
  }

  return {
    placeholder: "",
    tooltip: undefined,
  };
}
