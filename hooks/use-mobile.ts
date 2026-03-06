import * as React from "react"

const MOBILE_BREAKPOINT = 768

/**
 * Custom hook that determines if the current viewport width is within the defined mobile breakpoint.
 * 
 * It sets up a media query listener to track changes in the window size and updates the state
 * accordingly. This is useful for responsive components that need to change behavior or
 * rendering based on the device type.
 * 
 * @returns `true` if the current viewport width is less than `MOBILE_BREAKPOINT`, otherwise `false`.
 * 
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
