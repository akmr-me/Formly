import { MinAndMaxCharacters as MinAndMaxNumbers } from "@/components/molecules/editor/MinAndMaxCharacters";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useUpdateCommonBlockFields } from "@/hooks/useUpdateCommonBlockFields";
import { useDebouncedCallback } from "use-debounce";
import { DefaultDebounceTime } from "@/constants";
import { toast } from "sonner";

interface NumberCustomFieldsContainerProps {
  selectedBlockData: {
    optionalConfig?: {
      minNumberLength?: number;
      maxNumberLength?: number;
    };
  };
}

export default function NumberCustomFieldsContainer({
  selectedBlockData,
}: NumberCustomFieldsContainerProps) {
  const [minNumberLength, setMinNumberLength] = useState<number | null>();
  const [maxNumberLength, setMaxNumberLength] = useState<number | null>();

  const searchParams = useSearchParams();
  const blockId = searchParams.get("block_id") as string;
  const { mutate } = useUpdateCommonBlockFields(blockId, "number");

  // Initialize state from selectedBlockData
  useEffect(() => {
    const minLength = selectedBlockData?.optionalConfig?.minimumNumber;
    const maxLength = selectedBlockData?.optionalConfig?.maximumNumber;

    setMinNumberLength(minLength);
    setMaxNumberLength(maxLength);
  }, [selectedBlockData]);

  const handleUpdateMinNumberLength = useDebouncedCallback((value: number) => {
    const currentValue =
      selectedBlockData?.optionalConfig?.minNumberLength ?? null;
    if (value === currentValue) return;

    if (value !== null && maxNumberLength !== null && value > maxNumberLength) {
      toast.error("Minimum number should be less than maximum number.");
      return;
    }

    mutate({
      optionalConfig: {
        minimumNumber: value || null,
      },
    });
  }, DefaultDebounceTime);

  const handleUpdateMaxNumberLength = useDebouncedCallback((value: number) => {
    console.log("debound called", value);
    const currentValue =
      selectedBlockData?.optionalConfig?.maxNumberLength ?? null;
    if (value === currentValue) return;

    if (value !== null && minNumberLength !== null && value < minNumberLength) {
      toast.error("Maximum number should be greater than minimum number.");
      return;
    }
    console.log("mutacalled");
    mutate({
      optionalConfig: {
        maximumNumber: value || null,
      },
    });
  }, DefaultDebounceTime);

  const handleMinNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value =
      typeof e.target.value === "string"
        ? parseInt(e.target.value)
        : e.target.value;
    setMinNumberLength(value);
    handleUpdateMinNumberLength(value);
  };

  const handleMaxNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value =
      typeof e.target.value === "string"
        ? parseInt(e.target.value)
        : e.target.value;

    setMaxNumberLength(value);
    handleUpdateMaxNumberLength(value);
  };

  return (
    <div className="space-x-6 flex">
      <MinAndMaxNumbers
        label="Minimum Number"
        placeholder=""
        value={minNumberLength}
        onChange={handleMinNumberChange}
        info=""
      />

      <MinAndMaxNumbers
        label="Maximum Number"
        placeholder=""
        value={maxNumberLength}
        onChange={handleMaxNumberChange}
        info=""
      />
    </div>
  );
}
