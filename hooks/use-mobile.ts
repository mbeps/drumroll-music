/**
 * @fileoverview Responsive mobile viewport detection hook.
 * Uses media queries to determine if the current viewport matches mobile breakpoint.
 * @author Maruf Bepary
 */

import * as React from "react"

const MOBILE_BREAKPOINT = 768

/**
 * Detects if the current viewport width is within the mobile breakpoint.
 * Uses a media query listener to track window size changes and updates dynamically.
 * Useful for responsive components that need to render differently on mobile vs. desktop.
 *
 * @returns Boolean indicating if the viewport width is less than MOBILE_BREAKPOINT (768px).
 * @example
 * ```tsx
 * const isMobile = useIsMobile();
 * 
 * return (
 *   <div>
 *     {isMobile ? <MobileNavigation /> : <DesktopNavigation />}
 *   </div>
 * );
 * ```
 * @author Maruf Bepary
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}
