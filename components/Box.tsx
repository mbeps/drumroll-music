import { twMerge } from "tailwind-merge";

interface BoxProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * A layout container component that provides consistent card-like styling.
 * Used across the application to wrap content sections with a dedicated background
 * and standard padding, ensuring visual consistency in the Drumroll Music UI.
 *
 * @author Maruf Bepary
 * @param children The content to be rendered inside the box.
 * @param className Optional additional Tailwind CSS classes for custom styling.
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
