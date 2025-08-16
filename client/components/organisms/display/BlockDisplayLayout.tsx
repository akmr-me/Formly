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
        "rounded-2xl p-16 max-w-4xl w-full h-full grid overflow-y-auto scrollbar-hide",
        textAlign === "center" && "text-center",
        textAlign === "left" && "text-left",
        displayLayoutSize === "small" && "p-4"
      )}
    >
      <div className="place-self-center self-start w-full">
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
        <div className={cn(textAlign === "center" && "mx-auto")}>
          <h1
            // TODO: removed w-fit
            className={cn(
              "text-4xl font-bold text-black relative w-fit py-6",
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
        </div>

        {validDescription && (
          <div className="my-4 max-w-2xl">
            <div
              className={cn(
                "text-lg text-gray-700 leading-relaxed",
                displayLayoutSize === "small" && "text-sm"
              )}
              dangerouslySetInnerHTML={{ __html: validDescription }}
            />
          </div>
        )}
        <div>{children}</div>
        <div>
          <Button
            className={cn(
              "bg-black text-white px-8 py-4 rounded-md hover:bg-gray-800 text-lg font-medium mt-8",
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
    </div>
  );
}
