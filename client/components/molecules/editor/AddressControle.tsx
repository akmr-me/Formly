import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AddressFieldConfig } from "@/types";
import { CheckedState } from "@radix-ui/react-checkbox";
import { Eye, EyeOff, Settings } from "lucide-react";
import { useEffect, useState } from "react";

type AddressControlProps = {
  config: AddressFieldConfig;
  value?: string;
  onChange: (value: AddressFieldConfig) => void;
  showControl?: boolean;
  onToggleVisibility?: (id: string) => void;
  onOpenSettings?: (id: string) => void;
  editConfig?: AddressFieldConfig | null;
};
const AddressControl = ({
  config,
  value,
  onChange,
  showControl,
  onToggleVisibility,
  onOpenSettings,
  editConfig,
}: AddressControlProps) => {
  return (
    <div className={`space-y-2 `}>
      <div className="flex items-center justify-between">
        <Label
          htmlFor={config.id}
          className="text-sm font-medium text-gray-700"
        >
          {config.label}
          {config.required && <span className="text-red-500 ml-1">*</span>}
        </Label>

        <div className="flex items-center space-x-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onToggleVisibility?.(config.id)}
            className="p-1 h-6 w-6"
          >
            {config.visible ? (
              <Eye className="h-3 w-3" />
            ) : (
              <EyeOff className="h-3 w-3" />
            )}
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onOpenSettings?.(config.id)}
            className="p-1 h-6 w-6"
          >
            <Settings className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {editConfig && (
        <EditAddressControle
          config={editConfig}
          // value={value}
          onChange={onChange}
          // showControl={showControl}
          // onToggleVisibility={onToggleVisibility}
          // onOpenSettings={onOpenSettings}
          // editConfig={editConfig}
          // setEditConfig={setEditConfig}
        />
      )}
    </div>
  );
};
export default AddressControl;

type EditAddressControleProps = {
  config: AddressFieldConfig;
  value?: string;
  onChange: (value: AddressFieldConfig) => void;
  showControl?: boolean;
  onToggleVisibility?: (id: string) => void;
  onOpenSettings?: (id: string) => void;
  editConfig?: AddressFieldConfig;
};

function EditAddressControle({
  config,
  // value,
  onChange,
}: EditAddressControleProps) {
  const [editConfig, setEditConfig] = useState(config);
  useEffect(() => {
    setEditConfig(config);
  }, [config]);
  return (
    <div className="space-y-4 bg-gray-200 p-4 rounded-sm">
      <div className="space-y-2">
        <Label htmlFor="label">Label</Label>
        <Input
          id="label"
          value={editConfig.label}
          onChange={(e) => {
            const updatedConfig = { ...editConfig, label: e.target.value };
            setEditConfig(updatedConfig);
            onChange(updatedConfig);
          }}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="placeholder">Placeholder</Label>
        <Input
          id="placeholder"
          value={editConfig.placeholder}
          onChange={(e) => {
            const updatedConfig = {
              ...editConfig,
              placeholder: e.target.value,
            };
            setEditConfig(updatedConfig);
            onChange(updatedConfig);
          }}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="required"
          checked={editConfig.required}
          onCheckedChange={(e) => {
            const updatedConfig = {
              ...editConfig,
              required: e as boolean,
            };
            setEditConfig(updatedConfig);
            onChange(updatedConfig);
          }}
        />
        <Label htmlFor="required">Make this required?</Label>
      </div>
    </div>
  );
}
