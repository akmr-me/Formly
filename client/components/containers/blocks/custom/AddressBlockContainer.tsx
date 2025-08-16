import Address from "@/components/organisms/Address";
import { defaultFieldConfigs } from "@/components/organisms/AddressBlock";
import { Button } from "@/components/ui/button";
import { BlockType } from "@/types";
import { useState } from "react";

type AddressBlockContainerProps = {
  selectedBlockData: BlockType;
  className?: string;
};

const AddressBlockContainer = ({
  className = "",
  selectedBlockData,
}: AddressBlockContainerProps) => {
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
  console.log("from adress", { selectedBlockData });
  // TODO: Prone to errors
  const AddressOptionalConfig = selectedBlockData.optionalConfig;
  const AddressFieldsKeys = Object.values(AddressOptionalConfig)
    .sort((a, b) => a.order - b.order)
    .map((config) => config.id);
  return (
    <div className={`max-w-2xl mx-auto p-6 bg-transparent ${className}`}>
      <div className="space-y-6">
        <div className="flex flex-wrap -mx-2">
          {AddressFieldsKeys.map((addressField) => {
            const config = AddressOptionalConfig[addressField];
            return (
              <div
                key={config.id}
                className={`px-2 mb-6 ${
                  config.width === "half" ? "w-full md:w-1/2" : "w-full"
                }`}
              >
                <Address
                  config={config}
                  value={addressData[config.id]}
                  onChange={(value) => handleFieldChange(config.id, value)}
                  showControl={true}
                  onToggleVisibility={handleToggleVisibility}
                  // onOpenSettings={handleOpenSettings}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AddressBlockContainer;
