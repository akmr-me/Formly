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
  const validDescription =
    description && description !== "<p><br></p>" ? description : "";
  return (
    <div
      className={cn(
        "rounded-2xl max-w-4xl w-full h-full grid overflow-y-auto scrollbar-hide m-auto",
        displayLayoutSize === "small" ? "p-4" : "p-6 sm:p-10 lg:p-16",
        textAlign === "center" && "text-center",
        textAlign === "left" && "text-left"
      )}
    >
      <div
        className={cn(
          "place-self-center self-start w-full m-auto",
          textAlign === "center" && "text-center",
          textAlign === "left" && "text-left"
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
        <div className={cn(textAlign === "center" && "justify-center flex")}>
          <h1
            id="form-block-title"
            className={cn(
              "font-bold text-black w-fit py-6",
              displayLayoutSize === "small"
                ? "text-xl"
                : "text-2xl sm:text-3xl lg:text-4xl"
            )}
            onClick={onHeaderClick}
          >
            {title}
            {required && <span className="ml-1 text-red-500">*</span>}
          </h1>
        </div>

        {validDescription && (
          <div className="my-4 max-w-2xl">
            <div
              className={cn(
                "text-gray-700 leading-relaxed",
                displayLayoutSize === "small" ? "text-sm" : "text-base sm:text-lg"
              )}
              dangerouslySetInnerHTML={{ __html: validDescription }}
            />
          </div>
        )}
        <div
          className={cn(
            "flex w-full",
            textAlign === "center" && "justify-center",
            textAlign === "left" && "justify-start"
          )}
        >
          {children}
        </div>
        <div
          className={cn(
            "flex w-full",
            textAlign === "center" && "justify-center",
            textAlign === "left" && "justify-start"
          )}
        >
          <Button
            className={cn(
              "px-8 py-4 text-lg font-medium mt-8",
              displayLayoutSize === "small" && "px-4 py-2 text-sm font-semibold"
            )}
            onClick={onButtonClick}
            type="submit"
          >
            {buttonText}
          </Button>
        </div>
      </div>
    </div>
  );
}
