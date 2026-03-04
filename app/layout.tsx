import Sidebar from "@/components/Sidebar/Sidebar";
import "./globals.css";
import { Figtree } from "next/font/google";
import SupabaseProvider from "@/providers/SupabaseProvider";
import UserProvider from "@/providers/UserProvider";
import ModalProvider from "@/providers/ModalProvider";
import { Toaster } from "@/components/ui/sonner";
import Player from "@/components/Player/Player";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import PlayerLayoutWrapper from "@/components/Player/PlayerLayoutWrapper";
import MobileBottomNav from "@/components/MobileNav/MobileBottomNav";

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
 * The layout of the app.
 * This layout is used for all pages hence the layout is applied to all pages.
 * Components that are used in all pages should be placed here.
 * Providers that are used in all pages should be placed here:
 * - SupabaseProvider: provides the Supabase client to all pages
 * - UserProvider: provides the user to all pages
 * - ModalProvider: provides the modals to all pages
 * - Sidebar: the sidebar of the app (contains the navigation)
 * - Player: the player allows the user to play songs from anywhere in the app
 *
 * @param children (React.ReactNode): children of the layout (app)
 * @returns (React.ReactNode): the layout (app)
 */
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={font.className}>
        <TooltipProvider>
          <Toaster/>
          <SupabaseProvider>
            <UserProvider>
              <ModalProvider />
              <SidebarProvider>
                <Sidebar />
                <SidebarInset>
                  <PlayerLayoutWrapper>
                    {children}
                  </PlayerLayoutWrapper>
                </SidebarInset>
              </SidebarProvider>
              <Player />
              <MobileBottomNav />
            </UserProvider>
          </SupabaseProvider>
        </TooltipProvider>
      </body>
    </html>
  );
}
