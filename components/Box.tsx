import { twMerge } from "tailwind-merge";

interface BoxProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Box component that is used to display content in a box.
 * Gives a nice background to the content.
 * @param children (React.ReactNode): content that is displayed in the box
 * @param className (string): additional styles
 * @returns (React.ReactNode): the box and its content
 */
const Box: React.FC<BoxProps> = ({ children, className }) => {
  return (
    <div
      className={twMerge(
        `
        bg-neutral-900 
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
