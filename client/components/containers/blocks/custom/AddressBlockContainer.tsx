import Address from "@/components/organisms/Address";
import { AddressData, AddressFieldConfig, BlockType } from "@/types";
import { useState } from "react";

type AddressBlockContainerProps = {
  selectedBlockData: BlockType;
  className?: string;
};

const AddressBlockContainer = ({
  className = "",
  selectedBlockData,
}: AddressBlockContainerProps) => {
  const [addressData, setAddressData] = useState<AddressData>({
    address: "",
    addressLine2: "",
    city: "",
    state: "",
    zip: "",
    country: "",
  });

  const handleFieldChange = (fieldId: string, newValue: string) => {
    setAddressData((prev) => ({ ...prev, [fieldId]: newValue }));
  };

  console.log("from adress", { selectedBlockData });
  const AddressOptionalConfig = selectedBlockData.optionalConfig || {};
  const AddressFieldsKeys = Object.values(
    AddressOptionalConfig as Record<string, AddressFieldConfig>
  )
    .sort((a, b) => a.order - b.order)
    .map((config) => config.id);

  return (
    <div className={`max-w-2xl mx-auto p-6 bg-transparent ${className}`}>
      <div className="space-y-6">
        <div className="flex flex-wrap -mx-2">
          {AddressFieldsKeys.map((addressField) => {
            const config = AddressOptionalConfig[
              addressField
            ] as AddressFieldConfig;
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
