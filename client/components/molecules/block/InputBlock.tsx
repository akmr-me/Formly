import { Textarea } from "@/components/ui/textarea";
import { DetailedHTMLProps, TextareaHTMLAttributes } from "react";

interface TextInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}
export function TextInput({
  placeholder = "Enter text...",
  value,
  onChange,
  className = "",
  ...props
}: TextInputProps) {
  return (
    <div className="text-center space-y-6">
      <input
        type="text"
        className={`w-full max-w-md mb-2 mx-auto block px-4 py-3 border-b-2 border-gray-600 bg-transparent focus:outline-none focus:border-gray-800 text-lg ${className}`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        {...props}
      />
    </div>
  );
}

interface NumberInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  placeholder?: string;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  min?: number;
  max?: number;
  step?: number;
}
export function NumberInput({
  placeholder = "Enter a number...",
  value,
  onChange,
  className = "",
  min,
  max,
  step,
  ...props
}: NumberInputProps) {
  return (
    <div className="text-center space-y-6">
      <input
        type="number"
        className={`w-full mb-2 max-w-md mx-auto block px-4 py-3 border-b-2 border-gray-600 bg-transparent focus:outline-none focus:border-gray-800 text-lg ${className}`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        min={min}
        max={max}
        step={step}
        {...props}
      />
    </div>
  );
}

export function LongText({
  placeholder = "Enter text...",
  value,
  onChange,
  className = "",
  ...props
}: DetailedHTMLProps<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  HTMLTextAreaElement
>) {
  return (
    <div className="text-center space-y-6">
      <Textarea
        {...props}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={className}
      />
    </div>
  );
}

interface URLInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

export function URLInput({
  placeholder = "https://example.com",
  value,
  onChange,
  className = "",
  ...props
}: URLInputProps) {
  return (
    <div className="text-center space-y-6 mb-4">
      <input
        type="url"
        className={`w-full max-w-md mx-auto block px-4 py-3 border-b-2 border-gray-600 bg-transparent focus:outline-none focus:border-gray-800 text-lg ${className}`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        {...props}
      />
    </div>
  );
}

interface DateInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  min?: string;
  max?: string;
}

export function DateInput({
  placeholder = "Select date...",
  value,
  onChange,
  className = "",
  min,
  max,
  ...props
}: DateInputProps) {
  return (
    <div className="text-center space-y-6">
      <input
        type="date"
        className={`w-full max-w-md mx-auto block px-4 py-3 border-b-2 border-gray-600 bg-transparent focus:outline-none focus:border-gray-800 text-lg ${className}`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        min={min}
        max={max}
        {...props}
      />
    </div>
  );
}
