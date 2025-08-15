"use client";
import { Label } from "@radix-ui/react-label";
import { forwardRef, useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Eye, EyeOff, Settings } from "lucide-react";
import { Input } from "../ui/input";

import { Checkbox } from "../ui/checkbox";
import AddressBlockContainer from "../containers/blocks/custom/AddressBlockContainer";
import AddressControl from "../molecules/editor/AddressControle";

// Types
interface AddressFieldConfig {
  id: string;
  label: string;
  placeholder: string;
  required: boolean;
  visible: boolean;
  type?: "text" | "select";
  options?: string[];
  width?: "full" | "half";
}

interface AddressData {
  address: string;
  addressLine2: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

// Default field configurations
export const defaultFieldConfigs = [
  {
    id: "address",
    label: "Address",
    placeholder: "123 Main St",
    required: true,
    visible: true,
    width: "half",
  },
  {
    id: "addressLine2",
    label: "Address line 2",
    placeholder: "Apt., studio, or floor",
    required: false,
    visible: true,
    width: "half",
  },
  {
    id: "city",
    label: "City",
    placeholder: "San Francisco",
    required: true,
    visible: true,
    width: "half",
  },
  {
    id: "state",
    label: "State",
    placeholder: "California",
    required: true,
    visible: true,
    width: "half",
  },
  {
    id: "zip",
    label: "Zip",
    placeholder: "Zip",
    required: true,
    visible: true,
    width: "full",
  },
  {
    id: "country",
    label: "Country",
    placeholder: "United States",
    required: true,
    visible: true,
    width: "full",
  },
];

// Individual Address Field Component
const AddressField = forwardRef(
  (
    {
      config,
      value,
      onChange,
      showControl,
      onToggleVisibility,
      onOpenSettings,
    },
    ref
  ) => {
    if (!config.visible && !showControl) return null;

    return (
      <div
        className={`space-y-2 ${
          config.width === "half" ? "w-full" : "w-full"
        } ${!config.visible ? "opacity-50" : ""}`}
      >
        <div className="flex items-center justify-between">
          <Label
            htmlFor={config.id}
            className="text-sm font-medium text-gray-700"
          >
            {config.label}
            {config.required && <span className="text-red-500 ml-1">*</span>}
          </Label>

          {showControl && (
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
          )}
        </div>

        <Input
          ref={ref}
          id={config.id}
          type="text"
          placeholder={config.placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={config.required}
          disabled={!config.visible}
          className="w-full px-4 py-3 border-0 border-b-2 border-gray-300 bg-transparent focus:border-gray-600 focus:ring-0 rounded-none"
        />
      </div>
    );
  }
);
AddressField.displayName = "AddressField";

// Field Settings Dialog Component
const FieldSettingsDialog = ({ isOpen, onClose, config, onSave }) => {
  const [editConfig, setEditConfig] = useState(config);

  useEffect(() => {
    setEditConfig(config);
  }, [config]);

  const handleSave = () => {
    if (editConfig) {
      onSave(editConfig);
      onClose();
    }
  };

  if (!editConfig) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Field Settings - {editConfig.label}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="label">Label</Label>
            <Input
              id="label"
              value={editConfig.label}
              onChange={(e) =>
                setEditConfig({ ...editConfig, label: e.target.value })
              }
            />
          </div>

          <div>
            <Label htmlFor="placeholder">Placeholder</Label>
            <Input
              id="placeholder"
              value={editConfig.placeholder}
              onChange={(e) =>
                setEditConfig({ ...editConfig, placeholder: e.target.value })
              }
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="required"
              checked={editConfig.required}
              onChange={(e) =>
                setEditConfig({ ...editConfig, required: e.target.checked })
              }
            />
            <Label htmlFor="required">Make this required?</Label>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Main Address Form Component
const AddressForm = ({
  title = "Please enter your complete address",
  showControls = false,
  className = "",
}) => {
  const [fieldConfigs, setFieldConfigs] = useState(defaultFieldConfigs);
  const [addressData, setAddressData] = useState({
    address: "",
    addressLine2: "",
    city: "",
    state: "",
    zip: "",
    country: "",
  });
  const [settingsDialog, setSettingsDialog] = useState({
    isOpen: false,
    config: null,
  });

  const handleFieldChange = (fieldId, newValue) => {
    setAddressData((prev) => ({ ...prev, [fieldId]: newValue }));
  };

  const handleToggleVisibility = (fieldId) => {
    setFieldConfigs((configs) =>
      configs.map((config) =>
        config.id === fieldId ? { ...config, visible: !config.visible } : config
      )
    );
  };

  const handleOpenSettings = (fieldId) => {
    const config = fieldConfigs.find((c) => c.id === fieldId);
    if (config) {
      setSettingsDialog({ isOpen: true, config });
    }
  };

  const handleSaveFieldConfig = (updatedConfig) => {
    setFieldConfigs((configs) =>
      configs.map((config) =>
        config.id === updatedConfig.id ? updatedConfig : config
      )
    );
  };

  return (
    <div
      className={`max-w-2xl mx-auto p-6 bg-rose-200 min-h-screen ${className}`}
    >
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-900">{title}</h2>
        <Button
          onClick={() => setShowControlsLocal(!showControlsLocal)}
          variant="outline"
          size="sm"
        >
          {showControls ? "Hide Controls" : "Show Controls"}
        </Button>
      </div>

      <div className="space-y-6">
        <div className="flex flex-wrap -mx-2">
          {fieldConfigs.map((config) => (
            <div
              key={config.id}
              className={`px-2 mb-6 ${
                config.width === "half" ? "w-full md:w-1/2" : "w-full"
              }`}
            >
              <AddressField
                config={config}
                value={addressData[config.id]}
                onChange={(value) => handleFieldChange(config.id, value)}
                showControl={true}
                onToggleVisibility={handleToggleVisibility}
                onOpenSettings={handleOpenSettings}
              />
            </div>
          ))}
        </div>
      </div>

      <FieldSettingsDialog
        isOpen={settingsDialog.isOpen}
        onClose={() => setSettingsDialog({ isOpen: false, config: null })}
        config={settingsDialog.config}
        onSave={handleSaveFieldConfig}
      />

      {/* Debug info */}
      <div className="mt-8 p-4 bg-white rounded-lg">
        <h3 className="font-semibold mb-2">Current Address Data:</h3>
        <pre className="text-xs bg-gray-100 p-2 rounded">
          {JSON.stringify(addressData, null, 2)}
        </pre>
      </div>
    </div>
  );
};

// Demo Component
export default function AddressFormDemo() {
  const [showControls, setShowControls] = useState(false);

  return (
    <div className="min-h-fit bg-gray-50">
      {/* <div className="p-4 bg-white border-b">
        <div className="max-w-2xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Address Form Demo</h1>
          <Button
            onClick={() => setShowControls(!showControls)}
            variant={showControls ? "default" : "outline"}
          >
            {showControls ? "Hide Controls" : "Show Controls"}
          </Button>
        </div>
      </div> */}

      {defaultFieldConfigs.map((config) => (
        <AddressControl
          key={config.id}
          config={config}
          showControl={showControls}
          onChange={(value) =>
            console.log(`Field ${config.id} changed to:`, value)
          }
          onOpenSettings={() => console.log(`Open settings for ${config.id}`)}
          onToggleVisibility={() =>
            console.log(`Toggle visibility for ${config.id}`)
          }
        />
      ))}
      <AddressBlockContainer />

      {/* <AddressForm
        showControls={showControls}
        title="Please enter your complete address"
      /> */}
    </div>
  );
}

const DialogContent = ({ children, className }) => (
  <div className={className}>{children}</div>
);
const DialogHeader = ({ children }) => <div className="mb-4">{children}</div>;
const DialogTitle = ({ children }) => (
  <h2 className="text-lg font-semibold">{children}</h2>
);

const Dialog = ({ open, onOpenChange, children }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black/50"
        onClick={() => onOpenChange(false)}
      />
      <div className="relative bg-white rounded-lg p-6 w-full max-w-md mx-4">
        {children}
      </div>
    </div>
  );
};
