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

  const { mutate, isPending } = useUpdateCommonBlockFields(blockId, type);

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
    setIsRequired(selectedBlockData.required || "");
  }, [selectedBlockData.required]);
  useEffect(() => {
    setUrlParameter(selectedBlockData.urlParameter || "");
  }, [selectedBlockData.urlParameter]);

  const UrlParameterPlaceholder = DefaultBlockData[type]?.urlParamsPlaceholder;
  const UrlParameterTooltipText = DefaultBlockData[type]?.urlParamsTooltip;

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
          placeholder={UrlParameterPlaceholder}
          value={urlParameter}
          tooltipContent={UrlParameterTooltipText}
          onChange={(e) => {
            setUrlParameter(e.target.value);
            debouncedUrlParameterUpdate(e.target.value);
          }}
        />
      )}
    </div>
  );
}
