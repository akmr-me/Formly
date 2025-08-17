import { MinAndMaxCharacters } from "@/components/molecules/editor/MinAndMaxCharacters";
import { LongTextTextSize } from "./LongTextTextSize";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useUpdateCommonBlockFields } from "@/hooks/useUpdateCommonBlockFields";
import { useDebouncedCallback } from "use-debounce";
import { DefaultDebounceTime } from "@/constants";
import { toast } from "sonner";

type LongTextCustomFieldsContainerProps = {
  selectedBlockData: {
    optionalConfig?: {
      minCharacterLength?: number;
      maxCharacterLength?: number;
      textBoxSize?: string;
    };
  };
};

export default function LongTextCustomFieldsContainer({
  selectedBlockData,
}: LongTextCustomFieldsContainerProps) {
  const [minCharacterLength, setMinCharacterLength] = useState<
    number | null | undefined
  >();
  const [maxCharacterLength, setMaxCharacterLength] = useState<
    number | null | undefined
  >();

  const searchParams = useSearchParams();
  const blockId = searchParams.get("block_id") as string;
  const { mutate } = useUpdateCommonBlockFields(blockId, "longText");

  // Initialize state from selectedBlockData
  useEffect(() => {
    const minLength =
      selectedBlockData?.optionalConfig?.minCharacterLength ?? null;
    const maxLength =
      selectedBlockData?.optionalConfig?.maxCharacterLength ?? null;

    setMinCharacterLength(minLength);
    setMaxCharacterLength(maxLength);
  }, [selectedBlockData]);

  const handleUpdateMinCharacterLength = useDebouncedCallback(
    (value: number) => {
      const currentValue =
        selectedBlockData?.optionalConfig?.minCharacterLength ?? null;
      if (value === currentValue) return;

      if (
        value !== null &&
        maxCharacterLength !== null &&
        value > Number(maxCharacterLength)
      ) {
        toast.error(
          "Minimum characters cannot be greater than maximum characters"
        );
        return;
      }

      mutate({
        optionalConfig: {
          minCharacterLength: value || null,
        },
      });
    },
    DefaultDebounceTime
  );

  const handleUpdateMaxCharacterLength = useDebouncedCallback(
    (value: number) => {
      const currentValue =
        selectedBlockData?.optionalConfig?.maxCharacterLength ?? null;
      if (value === currentValue) return;

      if (
        value !== null &&
        minCharacterLength !== null &&
        value < Number(minCharacterLength)
      ) {
        toast.error(
          "Maximum characters cannot be less than minimum characters"
        );
        return;
      }

      mutate({
        optionalConfig: {
          maxCharacterLength: value || null,
        },
      });
    },
    DefaultDebounceTime
  );

  const handleMinCharacterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value =
      typeof e.target.value === "string"
        ? parseInt(e.target.value)
        : e.target.value;
    setMinCharacterLength(value);
    handleUpdateMinCharacterLength(value);
  };

  const handleMaxCharacterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value =
      typeof e.target.value === "string"
        ? parseInt(e.target.value)
        : e.target.value;

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
