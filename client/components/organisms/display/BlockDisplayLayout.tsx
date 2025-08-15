import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { TextAlignType } from "@/types";
import Image from "next/image";
export type BlockDisplayLayoutProps = {
  title?: string;
  description?: string;
  buttonText?: string;
  onButtonClick?: () => void;
  onHeaderClick?: () => void;
  children: React.ReactNode;
  textAlign: TextAlignType;
  imageUrl?: string;
  imageLayout?: string;
  displayLayoutSize?: string;
  required?: boolean;
};
export default function BlockDisplayLayout({
  title,
  description,
  buttonText,
  onButtonClick = () => {},
  onHeaderClick = () => {},
  children,
  textAlign,
  imageUrl,
  imageLayout,
  displayLayoutSize,
  required,
}: BlockDisplayLayoutProps) {
  console.log({ title, description, buttonText });
  return (
    <div
      className={cn(
        "rounded-2xl p-16 max-w-4xl w-full h-full flex flex-col justify-center overflow-y-auto scrollbar-hide",
        textAlign === "center" && "text-center",
        textAlign === "left" && "text-left",
        displayLayoutSize === "small" && "p-4"
      )}
    >
      <div className="w-auto max-h-64">
        {imageLayout === "stack" && imageUrl && (
          <Image
            src={imageUrl || ""}
            alt="Cover preview"
            className={cn(
              "max-h-64 w-auto",
              textAlign === "center" && "mx-auto"
            )}
            crossOrigin="anonymous"
            width={400}
            height={300}
          />
        )}
      </div>
      <h1
        className={cn(
          "text-4xl font-bold text-black mb-8 relative w-fit",
          displayLayoutSize === "small" && "text-xl"
        )}
        onClick={onHeaderClick}
      >
        {title}

        {required && (
          <span className="absolute -top-1 -right-1 text-red-500 text-lg font-bold">
            *
          </span>
        )}
      </h1>

      {description && (
        <div className="mb-8 max-w-2xl">
          <div
            className={cn(
              "text-lg text-gray-700 leading-relaxed",
              displayLayoutSize === "small" && "text-sm"
            )}
            dangerouslySetInnerHTML={{ __html: description }}
          />
        </div>
      )}
      <div>{children}</div>
      <div>
        <Button
          className={cn(
            "bg-black text-white px-8 py-4 rounded-md hover:bg-gray-800 text-lg font-medium",
            displayLayoutSize === "small" && "text-sm",
            displayLayoutSize === "small" && "px-4 py-2",
            displayLayoutSize === "small" && "font-semibold"
          )}
          onClick={onButtonClick}
          type="submit"
        >
          {buttonText}
        </Button>
      </div>
    </div>
  );
}
