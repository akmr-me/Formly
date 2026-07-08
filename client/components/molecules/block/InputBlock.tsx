import { Textarea } from "@/components/ui/textarea";
import { formTextFieldClass } from "@/lib/formFieldStyles";
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
          className={`${formTextFieldClass} ${className}`}
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
          className={`${formTextFieldClass} ${className}`}
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
        className={`${formTextFieldClass} min-h-32 resize-none rounded-none ${className}`}
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
          className={`${formTextFieldClass} ${className}`}
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
          className={`${formTextFieldClass} ${className}`}
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
