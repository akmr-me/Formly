import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export function RequiredFieldCheckbox({ checked, onChange, className = "" }) {
  return (
    <div className="flex items-start space-x-3">
      <Checkbox
        checked={checked}
        onChange={onChange}
        className={`mt-0.5 ${className}`}
        onCheckedChange={onChange}
      />
      <div className="space-y-1">
        <Label className="text-gray-700 font-medium">Required field</Label>
        <p className="text-sm text-gray-500">
          If checked, users will be required to complete this field.
        </p>
      </div>
    </div>
  );
}
