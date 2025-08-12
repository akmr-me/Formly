import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { TextAlignType } from "@/types";
import Image from "next/image";
export type BlockDisplayLayoutProps = {
  title?: string;
  description?: string;
  buttonText?: string;
  onButtonClick?: () => void;
  children: React.ReactNode;
  textAlign: TextAlignType;
  imageUrl?: string;
  imageLayout?: string;
};
export default function BlockDisplayLayout({
  title = "",
  description = "",
  buttonText = "",
  onButtonClick = () => {},
  children,
  textAlign,
  imageUrl,
  imageLayout,
}: BlockDisplayLayoutProps) {
  console.log("text alignt", { textAlign });
  return (
    <div
      className={cn(
        "rounded-2xl p-16 max-w-4xl w-full shadow-lg h-full flex flex-col justify-center",
        textAlign === "center" && "text-center",
        textAlign === "left" && "text-left"
      )}
    >
      <div className="w-auto max-h-64">
        {imageLayout === "stack" && (
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
      <h1 className="text-4xl font-bold text-black mb-8">{title}</h1>

      {description && (
        <div className="mb-8 max-w-2xl">
          <div
            className="text-lg text-gray-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: description }}
          />
        </div>
      )}
      <div>{children}</div>
      <div>
        <Button
          className="bg-black text-white px-8 py-4 rounded-lg hover:bg-gray-800 text-lg font-medium"
          onClick={onButtonClick}
        >
          {buttonText}
        </Button>
      </div>
    </div>
  );
}
