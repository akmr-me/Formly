import { Button } from "@/components/ui/button";

export default function Statement({
  title = "Hey there 😊",
  description = "",
  buttonText = "Let's start",
  onButtonClick = () => {},
}) {
  return (
    <div className="rounded-2xl p-16 max-w-4xl w-full text-center shadow-lg h-full flex flex-col justify-center">
      <h1 className="text-4xl font-bold text-black mb-8">{title}</h1>

      {description && (
        <div className="mb-8 max-w-2xl mx-auto">
          <div
            className="text-lg text-gray-700 leading-relaxed text-left"
            dangerouslySetInnerHTML={{ __html: description }}
          />
        </div>
      )}
      <div>
        <Button
          className="bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 text-lg font-medium"
          onClick={onButtonClick}
        >
          {buttonText}
        </Button>
      </div>
    </div>
  );
}
