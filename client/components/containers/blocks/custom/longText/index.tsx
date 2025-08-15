import { MinAndMaxCharacters } from "@/components/molecules/editor/MinAndMaxCharacters";
import { LongTextTextSize } from "./LongTextTextSize";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useUpdateCommonBlockFields } from "@/hooks/useUpdateCommonBlockFields";
import { useDebouncedCallback } from "use-debounce";
import { DefaultDebounceTime } from "@/constants";

interface LongTextCustomFieldsContainerProps {
  selectedBlockData: {
    optionalConfig?: {
      minCharacterLength?: number;
      maxCharacterLength?: number;
    };
  };
}

export default function LongTextCustomFieldsContainer({
  selectedBlockData,
}: LongTextCustomFieldsContainerProps) {
  const [minCharacterLength, setMinCharacterLength] = useState<number>(0);
  const [maxCharacterLength, setMaxCharacterLength] = useState<number>(0);

  const searchParams = useSearchParams();
  const blockId = searchParams.get("block_id");
  const { mutate } = useUpdateCommonBlockFields(blockId, "longText");

  // Initialize state from selectedBlockData
  useEffect(() => {
    const minLength =
      selectedBlockData?.optionalConfig?.minCharacterLength ?? 0;
    const maxLength =
      selectedBlockData?.optionalConfig?.maxCharacterLength ?? 0;

    setMinCharacterLength(minLength);
    setMaxCharacterLength(maxLength);
  }, [selectedBlockData]);

  const handleUpdateMinCharacterLength = useDebouncedCallback(
    (value: number) => {
      const currentValue =
        selectedBlockData?.optionalConfig?.minCharacterLength ?? 0;
      if (value === currentValue) return;

      mutate({
        optionalConfig: {
          minCharacterLength: value || undefined, // Convert 0 to undefined for "no limit"
        },
      });
    },
    DefaultDebounceTime
  );

  const handleUpdateMaxCharacterLength = useDebouncedCallback(
    (value: number) => {
      const currentValue =
        selectedBlockData?.optionalConfig?.maxCharacterLength ?? 0;
      if (value === currentValue) return;

      mutate({
        optionalConfig: {
          maxCharacterLength: value || undefined, // Convert 0 to undefined for "no limit"
        },
      });
    },
    DefaultDebounceTime
  );

  const handleMinCharacterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value) || 0;
    setMinCharacterLength(value);
    handleUpdateMinCharacterLength(value);
  };

  const handleMaxCharacterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value) || 0;
    setMaxCharacterLength(value);
    handleUpdateMaxCharacterLength(value);
  };

  return (
    <div className="space-y-6">
      <div>
        <LongTextTextSize selectedBlockData={selectedBlockData} />
      </div>

      <MinAndMaxCharacters
        label="Minimum characters"
        placeholder="e.g 30"
        value={minCharacterLength}
        onChange={handleMinCharacterChange}
        info="Leave blank for no minimum limit."
      />

      <MinAndMaxCharacters
        label="Maximum characters"
        placeholder="e.g 300"
        value={maxCharacterLength}
        onChange={handleMaxCharacterChange}
        info="Leave blank for no maximum limit."
      />
    </div>
  );
}
