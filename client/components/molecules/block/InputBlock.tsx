import { Textarea } from "@/components/ui/textarea";
import { DetailedHTMLProps, TextareaHTMLAttributes, forwardRef } from "react";

interface TextInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  (
    {
      placeholder = "Enter text...",
      value,
      onChange,
      className = "",
      ...props
    },
    ref
  ) => {
    return (
      <div className="text-center space-y-6">
        <input
          ref={ref}
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
);
TextInput.displayName = "TextInput";

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

export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
  (
    {
      placeholder = "Enter a number...",
      value,
      onChange,
      className = "",
      min,
      max,
      step,
      ...props
    },
    ref
  ) => {
    return (
      <div className="text-center space-y-6">
        <input
          ref={ref}
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
);
NumberInput.displayName = "NumberInput";

export const LongText = forwardRef<
  HTMLTextAreaElement,
  DetailedHTMLProps<
    TextareaHTMLAttributes<HTMLTextAreaElement>,
    HTMLTextAreaElement
  >
>(({ placeholder, value, onChange, className = "", ...props }, ref) => {
  return (
    <div className="text-center space-y-6 min-w-xl">
      <Textarea
        ref={ref}
        {...props}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`w-full border-b-2 border-gray-600 bg-transparent focus:outline-none focus:border-gray-800 text-lg ${className}`}
      />
    </div>
  );
});
LongText.displayName = "LongText";

interface URLInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

export const URLInput = forwardRef<HTMLInputElement, URLInputProps>(
  (
    {
      placeholder = "https://example.com",
      value,
      onChange,
      className = "",
      ...props
    },
    ref
  ) => {
    return (
      <div className="text-center space-y-6 mb-4">
        <input
          ref={ref}
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
);
URLInput.displayName = "URLInput";

interface DateInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  min?: string;
  max?: string;
}

export const DateInput = forwardRef<HTMLInputElement, DateInputProps>(
  (
    {
      placeholder = "Select date...",
      value,
      onChange,
      className = "",
      min,
      max,
      ...props
    },
    ref
  ) => {
    return (
      <div className="text-center space-y-6">
        <input
          ref={ref}
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
);
DateInput.displayName = "DateInput";
