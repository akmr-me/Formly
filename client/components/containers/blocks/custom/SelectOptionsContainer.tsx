import { DefaultDebounceTime } from "@/constants";
import { useUpdateCommonBlockFields } from "@/hooks/useUpdateCommonBlockFields";
import { BlockType } from "@/types";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

type SelectOptionsContainerProps = {
  selectedBlockData: BlockType;
};

export default function SelectOptionsContainer({
  selectedBlockData,
}: SelectOptionsContainerProps) {
  const searchParams = useSearchParams();
  const blockId = searchParams.get("block_id") as string;
  const { mutate } = useUpdateCommonBlockFields(blockId, selectedBlockData.type);
  const currentOptionsText = useMemo(
    () => getOptionsText(selectedBlockData),
    [selectedBlockData]
  );
  const [optionsText, setOptionsText] = useState(currentOptionsText);

  useEffect(() => {
    setOptionsText(currentOptionsText);
  }, [currentOptionsText]);

  const debouncedOptionsUpdate = useDebouncedCallback((value: string) => {
    const options = value
      .split("\n")
      .map((option) => option.trim())
      .filter(Boolean);

    mutate({
      optionalConfig: {
        options,
        selectType: selectedBlockData.type,
      },
    });
  }, DefaultDebounceTime);

  return (
    <label className="block text-sm font-medium text-gray-700">
      Options
      <textarea
        value={optionsText}
        onChange={(event) => {
          setOptionsText(event.target.value);
          debouncedOptionsUpdate(event.target.value);
        }}
        rows={5}
        className="mt-2 w-full resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
        placeholder={"Option 1\nOption 2"}
      />
      <span className="mt-1 block text-xs text-gray-500">
        Add one option per line.
      </span>
    </label>
  );
}

function getOptionsText(selectedBlockData: BlockType) {
  const options = selectedBlockData.optionalConfig?.options;
  if (Array.isArray(options) && options.every((option) => typeof option === "string")) {
    return options.join("\n");
  }
  return "Option 1\nOption 2";
}
