export type BlockType = {
  id: number;
  type: string;
  parentType?: string;
  label: string;
  text: string;
  color: string;
  icon: string;
  description: string;
  titleLabel?: string;
  titleDefaultValue?: string;
  defaultButtonText?: string;
  defaultPlaceholder?: string;
};
