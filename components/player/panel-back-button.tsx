import { ChevronLeft, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Navigation button for dismissing or navigating back in player panels.
 * Renders either a back chevron or close X icon based on context.
 *
 * @author Maruf Bepary
 */

interface PanelBackButtonProps {
  /**
   * Callback function for button click interaction.
   */
  onClick: () => void;
  /**
   * Selects whether to show a back chevron or a close X.
   */
  iconType?: "back" | "close";
  /**
   * Optional custom aria-label for accessibility.
   */
  ariaLabel?: string;
  /**
   * Additional Tailwind utility classes.
   */
  className?: string;
}

/**
 * Reusable navigation button for player panels.
 * Provides a consistent appearance for dismissal and back navigation within tabs.
 * 
 * @param props - PanelBackButton props
 * @returns React functional component
 * @author Maruf Bepary
 */
const PanelBackButton = ({
  onClick,
  iconType = "back",
  ariaLabel,
  className
}: PanelBackButtonProps) => {
  const Icon = iconType === "back" ? ChevronLeft : X;
  const defaultLabel = iconType === "back" ? "Back" : "Close";

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onClick}
      aria-label={ariaLabel || defaultLabel}
      className={cn(
        "h-8 w-8 bg-neutral-100 hover:bg-neutral-300 p-2 rounded-md transition duration-200 shrink-0",
        className
      )}
    >
      <Icon size={20} />
    </Button>
  );
};

export default PanelBackButton;
