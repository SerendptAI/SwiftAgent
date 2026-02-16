import { ChevronDown } from "lucide-react";
import { ComponentProps, forwardRef } from "react";

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
        "mb-2 block text-sm font-semibold text-gray-900",
        className,
      )}
      htmlFor={htmlFor}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      {...(props as any)}
    />
  );
};

export const FormInput = forwardRef<HTMLInputElement, ComponentProps<"input">>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "h-12 w-full rounded-md border-0 bg-gray-100 px-4 py-2 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-purple-600 focus:outline-hidden",
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
          "h-12 w-full appearance-none rounded-md border-0 bg-gray-100 px-4 py-2 pr-10 text-gray-900 focus:ring-2 focus:ring-purple-600 focus:outline-hidden",
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
