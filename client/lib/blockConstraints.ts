type BlockConstraints = {
  minNumber?: number;
  maxNumber?: number;
  minLength?: number;
  maxLength?: number;
};

function parseConstraintNumber(value: unknown): number | undefined {
  if (typeof value !== "number" || Number.isNaN(value)) return undefined;
  return value;
}

export function getBlockInputConstraints(
  type: string,
  optionalConfig?: Record<string, unknown>
): BlockConstraints {
  if (!optionalConfig) return {};

  if (type === "number") {
    return {
      minNumber: parseConstraintNumber(optionalConfig.minimumNumber),
      maxNumber: parseConstraintNumber(optionalConfig.maximumNumber),
    };
  }

  if (type === "longText") {
    const minLength = parseConstraintNumber(optionalConfig.minCharacterLength);
    const maxLength = parseConstraintNumber(optionalConfig.maxCharacterLength);

    return {
      minLength: minLength && minLength > 0 ? minLength : undefined,
      maxLength: maxLength && maxLength > 0 ? maxLength : undefined,
    };
  }

  return {};
}
