import { AddressFieldConfig } from "@/types";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

type AddressProps = {
  config: AddressFieldConfig;
  value: string;
  onChange: (value: string) => void;
  name?: string;
};

const Address = ({ config, value, onChange, name }: AddressProps) => {
  if (!config.visible) return null;

  return (
    <div
      className={`space-y-2 ${config.width === "half" ? "w-full" : "w-full"} ${
        !config.visible ? "opacity-50" : ""
      }`}
    >
      <Label htmlFor={config.id} className="text-sm font-medium text-gray-700">
        {config.label}
        {config.required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <Input
        // ref={ref}
        id={config.id}
        type="text"
        placeholder={config.placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={config.required}
        disabled={!config.visible}
        name={name}
        className="w-full px-4 py-3 border-0 border-b-2 border-gray-300 bg-transparent focus:border-gray-600 focus:ring-0 rounded-none"
      />
    </div>
  );
};
export default Address;
