export type BlockType = {
  id: number;
  type: string;
  parentType?: string;
  label: string;
  title?: string;
  text: string;
  color: string;
  icon: string;
  description: string;
  titleLabel?: string;
  titleDefaultValue?: string;
  defaultButtonText?: string;
  buttonText?: string;
  defaultPlaceholder?: string;
  textAlign: "left" | "center";
  descriptionHtml?: string;
  descriptionDelta?: any;
};

export type TextAlignType = "center" | "left";
