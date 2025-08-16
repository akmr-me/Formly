import Address from "@/components/organisms/Address";
import { AddressData, AddressFieldConfig, BlockType } from "@/types";
import { useEffect, useState } from "react";

type AddressBlockContainerProps = {
  selectedBlockData: BlockType;
  className?: string;
  defaultValue?: Record<string, string>;
};

const AddressBlockContainer = ({
  className = "",
  selectedBlockData,
  defaultValue,
}: AddressBlockContainerProps) => {
  const [addressData, setAddressData] = useState<AddressData>({
    address: "",
    addressLine2: "",
    city: "",
    state: "",
    zip: "",
    country: "",
  });
  console.log({ defaultValue });
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

  useEffect(() => {
    if (defaultValue) {
      setAddressData(defaultValue);
    }
  }, [defaultValue]);

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
                  name={`${selectedBlockData.id}.${config.id}`}
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
