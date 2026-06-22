import { twMerge } from "tailwind-merge";

/**
 * Reusable card/container component with consistent styling.
 * Provides a bordered background box used throughout the application for content grouping.
 *
 * @author Maruf Bepary
 */

interface BoxProps {
  /** Content to render inside the box. */
  children: React.ReactNode;
  /** Optional Tailwind classes to override or extend the default box styling. */
  className?: string;
}

/**
 * Renders a styled container with a card-like appearance.
 *
 * @param props - See BoxProps
 * @author Maruf Bepary
 */
const Box: React.FC<BoxProps> = ({ children, className }) => {
  return (
    <div
      className={twMerge(
        `
        bg-card
        border border-border
        text-card-foreground
        rounded-lg 
        h-fit 
        w-full
        `,
        className
      )}
    >
      {children}
    </div>
  );
};

export default Box;
