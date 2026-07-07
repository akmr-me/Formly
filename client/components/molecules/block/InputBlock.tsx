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
      <div className="w-full max-w-xl">
        <input
          ref={ref}
          type="text"
          className={`block w-full border-0 border-b-2 border-gray-600 bg-transparent px-0 py-3 text-lg outline-none transition placeholder:text-gray-700 focus:border-gray-900 focus:ring-0 ${className}`}
          placeholder={placeholder}
          onChange={onChange}
          {...props}
          {...(value !== undefined ? { value } : {})}
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
      <div className="w-full max-w-xl">
        <input
          ref={ref}
          type="number"
          className={`block w-full border-0 border-b-2 border-gray-600 bg-transparent px-0 py-3 text-lg outline-none transition placeholder:text-gray-700 focus:border-gray-900 focus:ring-0 ${className}`}
          placeholder={placeholder}
          onChange={onChange}
          min={min}
          max={max}
          step={step}
          {...props}
          {...(value !== undefined ? { value } : {})}
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
    <div className="w-full max-w-xl">
      <Textarea
        ref={ref}
        placeholder={placeholder}
        onChange={onChange}
        className={`min-h-32 w-full resize-none rounded-none border-0 border-b-2 border-gray-600 bg-transparent px-0 py-3 text-lg outline-none transition placeholder:text-gray-700 focus:border-gray-900 focus:ring-0 ${className}`}
        {...props}
        {...(value !== undefined ? { value } : {})}
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
      <div className="w-full max-w-xl">
        <input
          ref={ref}
          type="url"
          className={`block w-full border-0 border-b-2 border-gray-600 bg-transparent px-0 py-3 text-lg outline-none transition placeholder:text-gray-700 focus:border-gray-900 focus:ring-0 ${className}`}
          placeholder={placeholder}
          onChange={onChange}
          {...props}
          {...(value !== undefined ? { value } : {})}
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
      <div className="w-full max-w-xl">
        <input
          ref={ref}
          type="date"
          className={`block w-full border-0 border-b-2 border-gray-600 bg-transparent px-0 py-3 text-lg outline-none transition placeholder:text-gray-700 focus:border-gray-900 focus:ring-0 ${className}`}
          placeholder={placeholder}
          onChange={onChange}
          min={min}
          max={max}
          {...props}
          {...(value !== undefined ? { value } : {})}
        />
      </div>
    );
  }
);
DateInput.displayName = "DateInput";
