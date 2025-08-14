import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function PlaceholderInput({
  placeholder,
  value,
  onChange,
  className = "",
}) {
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
