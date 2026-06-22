import Sidebar from "@/components/sidebar/sidebar";
import "./globals.css";
import { Figtree } from "next/font/google";
import SupabaseProvider from "@/providers/supabase-provider";
import UserProvider from "@/providers/user-provider";
import ModalProvider from "@/providers/modal-provider";
import { Toaster } from "@/components/ui/sonner";
import Player from "@/components/player/player";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import PlayerLayoutWrapper from "@/components/player/player-layout-wrapper";
import MobileBottomNav from "@/components/mobile-nav/mobile-bottom-nav";
import { LoggingProvider } from "@/providers/logging-provider";

const font = Figtree({ subsets: ["latin"] });

export const revalidate = 0; // prevent caching

/**
 * Metadata for the app.
 * This layout is used for all pages hence the metadata is applied to all pages.
 */
export const metadata = {
  title: "Drumroll Music",
  description: "A music streaming platform",
};

/**
 * Root layout component for the application.
 * Provides global providers, navigation sidebar, and the persistent audio player.
 *
 * @param props - Component properties.
 * @param props.children - Child elements to be rendered within the layout.
 */
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={font.className}>
        <LoggingProvider>
          <TooltipProvider>
            <Toaster />
            <SupabaseProvider>
              <UserProvider>
                <ModalProvider />
                <SidebarProvider>
                  <Sidebar />
                  <SidebarInset>
                    <PlayerLayoutWrapper>{children}</PlayerLayoutWrapper>
                  </SidebarInset>
                </SidebarProvider>
                <Player />
                <MobileBottomNav />
              </UserProvider>
            </SupabaseProvider>
          </TooltipProvider>
        </LoggingProvider>
      </body>
    </html>
  );
}
