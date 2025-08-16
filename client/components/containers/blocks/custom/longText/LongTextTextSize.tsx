import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUpdateCommonBlockFields } from "@/hooks/useUpdateCommonBlockFields";
import { useSearchParams } from "next/navigation";
import { Label } from "@/components/ui/label";

type LongTextTextSizeProps = {
  selectedBlockData: {
    optionalConfig?: {
      textBoxSize?: string;
      minCharacterLength?: number;
      maxCharacterLength?: number;
    };
  };
};
const TextSizeOptions = [
  { value: "small", label: "Small" },
  { value: "medium", label: "Medium" },
  { value: "large", label: "Large" },
  { value: "extraLarge", label: "Extra Large" },
];

export function LongTextTextSize({ selectedBlockData }: LongTextTextSizeProps) {
  const searchParams = useSearchParams();
  const blockId = searchParams.get("block_id") as string;
  const { mutate } = useUpdateCommonBlockFields(blockId, "longText");

  // Derive current value directly from props
  const currentValue =
    selectedBlockData?.optionalConfig?.textBoxSize || "medium";

  const handleValueChange = (value: string) => {
    // Only mutate if value actually changed
    console.log({ value });
    if (value !== currentValue) {
      mutate({ optionalConfig: { textBoxSize: value } });
    }
  };

  return (
    <>
      <Label className="mb-1">Text Box Size</Label>
      <Select value={currentValue} onValueChange={handleValueChange}>
        <SelectTrigger className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {TextSizeOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  );
}
