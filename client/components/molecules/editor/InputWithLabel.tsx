import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";

type titleProps = {
  title: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  shouldShakeInput: boolean;
};
export default function InputWithLabel({
  title,
  value,
  onChange,
  shouldShakeInput,
}: titleProps) {
  return (
    <div>
      <Label className="text-sm font-semibold text-gray-700 mb-2 block">
        {title}
      </Label>
      <Input
        value={value}
        className="w-full"
        onChange={onChange}
        style={{
          animation: shouldShakeInput ? "shake 0.5s ease-in-out" : "none",
        }}
      />
      <style jsx>{`
        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-5px);
          }
          75% {
            transform: translateX(5px);
          }
        }
      `}</style>
    </div>
  );
}
