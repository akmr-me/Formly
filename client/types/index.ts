export type BlockType = {
  id: string;
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
  descriptionDelta?: Record<string, unknown>;
  coverImageLayout?: CoverImageLayout;
};

export type TextAlignType = "center" | "left";
export type CoverImageLayout = "stack" | "split" | "wallpaper";
