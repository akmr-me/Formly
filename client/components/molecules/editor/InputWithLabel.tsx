import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";

type titleProps = {
  title: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};
export default function InputWithLabel({ title, value, onChange }: titleProps) {
  return (
    <div>
      <Label className="text-sm font-semibold text-gray-700 mb-2 block">
        {title}
      </Label>
      <Input value={value} className="w-full" onChange={onChange} />
    </div>
  );
}
