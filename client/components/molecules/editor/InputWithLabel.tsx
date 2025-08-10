import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";

type titleProps = {
  title: string;
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
};
export default function InputWithLabel({ title, value, setValue }: titleProps) {
  return (
    <div>
      <Label className="text-sm font-semibold text-gray-700 mb-2 block">
        {title}
      </Label>
      <Input
        value={value}
        className="w-full"
        onChange={(e) => {
          setValue(e.target.value);
        }}
      />
    </div>
  );
}
