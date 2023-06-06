import { forwardRef } from "react";
import { twMerge } from "tailwind-merge";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

/**
 * Button component that is used to display a button.
 * Uses the props of the native button.
 *
 * @param children (React.ReactNode): content that is displayed in the button
 * @param className (string): additional styles
 * @returns (React.ReactNode): the button and its content
 */
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, disabled, type = "button", ...props }, ref) => {
    return (
      <button
        type={type}
        className={twMerge(
          `
        w-full 
        rounded-xl
        bg-red-500
        border
        border-transparent
        px-3 
        py-3 
        disabled:cursor-not-allowed 
        disabled:opacity-50
        text-white
        font-bold
        hover:opacity-75
        transition
      `,
          disabled && "opacity-75 cursor-not-allowed",
          className
        )}
        disabled={disabled}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
