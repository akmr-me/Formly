import AddressControl from "@/components/molecules/editor/AddressControle";
import { DefaultDebounceTime } from "@/constants";
import { useUpdateCommonBlockFields } from "@/hooks/useUpdateCommonBlockFields";
import { AddressFieldConfig, BlockType } from "@/types";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";

export default function AddressCustomFieldsContainer({
  selectedBlockData,
}: {
  selectedBlockData: BlockType;
}) {
  const AddressOptionalConfig = selectedBlockData.optionalConfig as Record<
    string,
    AddressFieldConfig
  >;
  const AddressFieldsKeys = Object.values(AddressOptionalConfig)
    .sort((a, b) => a.order - b.order)
    .map((config) => config.id);

  const [openAddressFieldId, setOpenAddressFieldId] = useState<string | null>(
    null
  );

  const { mutate } = useUpdateCommonBlockFields(
    selectedBlockData.id,
    "address"
  );

  const debouncedAddressConfigUpdate = useDebouncedCallback(
    (value: AddressFieldConfig) => {
      mutate({ optionalConfig: { [value.id]: value } });
    },
    DefaultDebounceTime
  );

  const handleVisibilityChange = (fieldId: string) => {
    console.log(`Toggle visibility for ${fieldId}`);
    const isVisible = !AddressOptionalConfig[fieldId].visible;
    // Api call here

    mutate({
      optionalConfig: {
        [fieldId]: { ...AddressOptionalConfig[fieldId], visible: isVisible },
      },
    });
    console.log(AddressOptionalConfig[fieldId]);
  };

  const handleOpenSettings = (fieldId: string) => {
    if (fieldId === openAddressFieldId) {
      setOpenAddressFieldId(null);
      return;
    }
    setOpenAddressFieldId(fieldId);
    console.log(`Open settings for ${fieldId}`);
  };

  const handleAddressConfigChange = (addressConfig: AddressFieldConfig) => {
    console.log(`Field ${addressConfig.id} changed to:`, addressConfig);
    debouncedAddressConfigUpdate(addressConfig);
  };

  return AddressFieldsKeys.map((addressField) => {
    const config = AddressOptionalConfig[addressField];
    return (
      <AddressControl
        key={config.id}
        config={config}
        showControl={true}
        onChange={handleAddressConfigChange}
        onToggleVisibility={() => handleVisibilityChange(config.id)}
        onOpenSettings={() => handleOpenSettings(config.id)}
        editConfig={config.id === openAddressFieldId ? config : null}
      />
    );
  });
}
