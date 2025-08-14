export type BlockType = {
  id: string;
  type: BlockTypeEnum;
  parentType?: string;
  label: string;
  title: string;
  text: string;
  color: string;
  icon: string;
  description: string;
  titleLabel?: string;
  titleDefaultValue?: string;
  defaultButtonText?: string;
  buttonText: string;
  defaultPlaceholder?: string;
  textAlign: TextAlignType;
  descriptionHtml?: string;
  descriptionDelta?: Record<string, unknown>;
  coverImageLayout?: CoverImageLayout;
  coverImageOrigin?: string;
  coverImagePath?: string;
  position: number;
  optionalConfig?: Record<string, unknown>;
};

export type TextAlignType = "center" | "left";
// export type CoverImageLayout = "stack" | "split" | "wallpaper";

export type DefaultBlockDataType = {
  type: BlockTypeEnum;
  titleLabel: string;
  title: string;
  buttonText: string;
  formId: string;
  textAlign: TextAlignType;
  position: number;
};
export const BlockTypeEnum = {
  STATEMENT: "statement",
  SHORT_TEXT: "shortText",
  LONG_TEXT: "longText",
  NUMBER: "number",
  WEBSITE_URL: "websiteUrl",
  SINGLE_SELECT: "single",
  MULTI_SELECT: "multi",
  DROPDOWN: "dropdown",
  DATE: "date",
  ADDRESS: "address",
} as const;
export type BlockTypeEnum = (typeof BlockTypeEnum)[keyof typeof BlockTypeEnum];
export const AlignType = {
  LEFT: "left",
  CENTER: "center",
  RIGHT: "right",
} as const;
export type AlignType = (typeof AlignType)[keyof typeof AlignType];
export const TitleLabelType = {
  TITLE: "Title",
  QUESTION: "Question",
} as const;
export type TitleLabelType =
  (typeof TitleLabelType)[keyof typeof TitleLabelType];
export const PublishStatusType = {
  PUBLISH: "publish",
  DRAFT: "draft",
} as const;
export type PublishStatusType =
  (typeof PublishStatusType)[keyof typeof PublishStatusType];
export const CoverImageLayout = {
  STACK: "stack",
  SPLIT: "split",
  WALLPAPER: "wallpaper",
} as const;
export type CoverImageLayout =
  (typeof CoverImageLayout)[keyof typeof CoverImageLayout];
export const ValueType = {
  STRING: "STRING",
  NUMBER: "NUMBER",
  DATE: "DATE",
  JSON: "JSON",
} as const;
export type ValueType = (typeof ValueType)[keyof typeof ValueType];
