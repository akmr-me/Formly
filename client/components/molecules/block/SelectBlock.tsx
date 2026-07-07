import { BlockType } from "@/types";

type SelectBlockProps = {
  selectedBlockData: BlockType;
  name?: string;
  required?: boolean;
  defaultValue?: string | string[];
};

export default function SelectBlock({
  selectedBlockData,
  name,
  required,
  defaultValue,
}: SelectBlockProps) {
  const options = getSelectOptions(selectedBlockData);
  const selectedValues = Array.isArray(defaultValue)
    ? defaultValue
    : typeof defaultValue === "string"
      ? [defaultValue]
      : [];

  if (selectedBlockData.type === "dropdown") {
    return (
      <select
        name={name}
        required={required}
        defaultValue={typeof defaultValue === "string" ? defaultValue : ""}
        className="w-full max-w-md rounded-lg border border-gray-300 bg-white px-4 py-3 text-left text-gray-900 shadow-sm outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
      >
        <option value="" disabled>
          Select an option
        </option>
        {options.map((option) => (
          <option key={option.id} value={option.value}>
            {option.value}
          </option>
        ))}
      </select>
    );
  }

  const inputType = selectedBlockData.type === "multi" ? "checkbox" : "radio";

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-3">
      {options.map((option) => (
        <label
          key={option.id}
          className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-300 bg-white px-4 py-3 text-left text-gray-900 shadow-sm transition hover:border-gray-900"
        >
          <input
            type={inputType}
            name={name}
            value={option.value}
            required={selectedBlockData.type === "single" ? required : false}
            defaultChecked={selectedValues.includes(option.value)}
            className="h-4 w-4 accent-gray-900"
          />
          <span>{option.value}</span>
        </label>
      ))}
    </div>
  );
}

function getSelectOptions(selectedBlockData: BlockType) {
  const options = selectedBlockData.optionalConfig?.options;
  const optionLabels =
    Array.isArray(options) && options.every((option) => typeof option === "string")
      ? options
      : ["Option 1", "Option 2"];

  return optionLabels
    .map((value) => value.trim())
    .filter(Boolean)
    .map((value, index) => ({
      id: `${index}-${value}`,
      value,
    }));
}
