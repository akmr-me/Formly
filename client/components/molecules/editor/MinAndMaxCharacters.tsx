import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type MinAndMaxCharactersProps = {
  value: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  label?: string;
  placeholder?: string;
  info?: string;
};

export function MinAndMaxCharacters({
  value,
  onChange,
  className = "",
  label = "",
  placeholder,
  info = "",
}: MinAndMaxCharactersProps) {
  return (
    <div className="space-y-2 mb-2">
      <Label>{label}</Label>
      <Input
        type="number"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={className}
        min="0"
      />
      <p className="text-sm text-gray-500">{info}</p>
    </div>
  );
}
