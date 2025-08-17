import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type PlaceholderInputProps = {
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className: string;
};
export function PlaceholderInput({
  placeholder,
  value,
  onChange,
  className,
}: PlaceholderInputProps) {
  return (
    <div className="space-y-2">
      <Label className="text-gray-700 font-medium">Placeholder</Label>
      <Input
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={className}
      />
    </div>
  );
}
