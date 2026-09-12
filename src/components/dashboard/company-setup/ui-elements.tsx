import { ChevronDown } from "lucide-react";
import { type ChangeEvent, type ComponentProps, forwardRef } from "react";

import { cn } from "@/lib/utils";
export const FormLabel = ({
  className,
  htmlFor,
  ...props
}: ComponentProps<"label">) => {
  const Component = htmlFor ? "label" : "div";
  return (
    <Component
      className={cn(
        "mb-2 block text-base font-normal text-gray-900",
        className,
      )}
      htmlFor={htmlFor}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      {...(props as any)}
    />
  );
};

export const FormInput = forwardRef<HTMLInputElement, ComponentProps<"input">>(
  ({ className, onChange, type, ...props }, ref) => {
    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
      if (type !== "file") {
        event.currentTarget.value = event.currentTarget.value.toUpperCase();
      }
      onChange?.(event);
    };

    return (
      <input
        ref={ref}
        type={type}
        onChange={handleChange}
        className={cn(
          "h-12 w-full rounded-md border-0 bg-gray-100 px-4 py-2 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-600 focus:outline-hidden",
          className,
        )}
        {...props}
      />
    );
  },
);
FormInput.displayName = "FormInput";

export const FormSelect = forwardRef<
  HTMLSelectElement,
  ComponentProps<"select">
>(({ className, children, ...props }, ref) => {
  return (
    <div className="relative">
      <select
        ref={ref}
        className={cn(
          "h-12 w-full appearance-none rounded-md border-0 bg-gray-100 px-4 py-2 pr-10 text-gray-900 focus:ring-2 focus:ring-blue-600 focus:outline-hidden",
          props.value === "" && "text-gray-400",
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
        <ChevronDown className="h-5 w-5" />
      </div>
    </div>
  );
});
FormSelect.displayName = "FormSelect";

export const FormTextarea = forwardRef<
  HTMLTextAreaElement,
  ComponentProps<"textarea">
>(({ className, onChange, ...props }, ref) => {
  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    event.currentTarget.value = event.currentTarget.value.toUpperCase();
    onChange?.(event);
  };

  return (
    <textarea
      ref={ref}
      onChange={handleChange}
      className={cn(
        "min-h-[120px] w-full rounded-md border-0 bg-gray-100 px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-600 focus:outline-hidden",
        className,
      )}
      {...props}
    />
  );
});
FormTextarea.displayName = "FormTextarea";

export const NextButton = ({
  className,
  children,
  ...props
}: ComponentProps<"button">) => {
  return (
    <button
      className={cn(
        "h-12 w-full cursor-pointer rounded-xl bg-[#006BE5] text-center text-lg leading-[1.2] tracking-[2%] text-white capitalize shadow-[-4px_4px_0px_0px_#000000] transition-colors hover:bg-[#0055B8]",
        className,
      )}
      {...props}
    >
      {children || "Next"}
    </button>
  );
};
