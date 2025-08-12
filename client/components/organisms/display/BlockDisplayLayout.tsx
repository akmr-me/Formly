import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { TextAlignType } from "@/types";
export type BlockDisplayLayoutProps = {
  title?: string;
  description?: string;
  buttonText?: string;
  onButtonClick?: () => void;
  children: React.ReactNode;
  textAlign: TextAlignType;
};
export default function BlockDisplayLayout({
  title = "",
  description = "",
  buttonText = "",
  onButtonClick = () => {},
  children,
  textAlign,
}: BlockDisplayLayoutProps) {
  return (
    <div
      className={cn(
        "rounded-2xl p-16 max-w-4xl w-full shadow-lg h-full flex flex-col justify-center",
        textAlign === "center" && "text-center",
        textAlign === "left" && "text-left"
      )}
    >
      <h1 className="text-4xl font-bold text-black mb-8">{title}</h1>

      {description && (
        <div className="mb-8 max-w-2xl mx-auto">
          <div
            className="text-lg text-gray-700 leading-relaxed text-left"
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
