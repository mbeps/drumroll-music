"use client";

import useAuthModal from "@/hooks/useAuthModal";
import { useUser } from "@/hooks/useUser";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "react-hot-toast";
import { BiSearch } from "react-icons/bi";
import { FaUserAlt } from "react-icons/fa";
import { HiHome } from "react-icons/hi";
import { RxCaretLeft, RxCaretRight } from "react-icons/rx";
import { twMerge } from "tailwind-merge";
import { Button } from "@/components/ui/button";
import { useSupabaseClient } from "@/providers/SupabaseProvider";
import { SidebarTrigger } from "@/components/ui/sidebar";

interface HeaderProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Header component to be displayed on top of the page.
 * Has a gradient background and a navigation bar.
 * Responsive depending on the screen size:
 * - Desktop: shows back and forward buttons
 * - Mobile: shows home and search buttons
 * - Both: shows login and signup buttons
 * @param children (React.ReactNode): items to be rendered inside the header
 * @param className (string): additional styling classes
 * @returns (React.FC): Header component with children inside
 */
const Header: React.FC<HeaderProps> = ({ children, className }) => {
  const router = useRouter();
  const { onOpen } = useAuthModal();
  const supabaseClient = useSupabaseClient();
  const { user } = useUser();

  /**
   * Handles logout event.
   * Signs out the user and refreshes the page.
   */
  const handleLogout = async () => {
    const { error } = await supabaseClient.auth.signOut();
    // TODO: reset playing songs
    router.refresh();

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Logged Out");
    }
  };

  return (
    <div
      className={twMerge(
        `
				h-fit 
				bg-background
				p-4 border-b border-border
				`,
        className
      )}
    >
      <div className="w-full mb-4 flex items-center justify-between">
        <div className="flex items-center gap-x-4">
          <SidebarTrigger className="md:hidden" />
          {/* Desktop View */}
          <div className="hidden md:flex gap-x-2 items-center">
          <button
            onClick={() => router.back()}
            className="
              rounded-full 
              bg-white 
              border border-border
              flex 
              items-center 
              justify-center 
              cursor-pointer 
              hover:bg-neutral-100 
              transition
            "
          >
            <RxCaretLeft className="text-black" size={35} />
          </button>
          <button
            onClick={() => router.forward()}
            className="
              rounded-full 
              bg-white 
              border border-border
              flex 
              items-center 
              justify-center 
              cursor-pointer 
              hover:bg-neutral-100 
              transition
            "
          >
            <RxCaretRight className="text-black" size={35} />
          </button>
        </div>
        {/* Mobile View */}
        <div className="flex md:hidden gap-x-2 items-center">
          <button
            onClick={() => router.push("/")}
            className="
              rounded-full 
              p-2 
              bg-white 
              border border-border
              flex 
              items-center 
              justify-center 
              cursor-pointer 
              hover:bg-neutral-100 
              transition
            "
          >
            <HiHome className="text-black" size={20} />
          </button>
          <button
            onClick={() => router.push("/search")}
            className="
              rounded-full
              p-2 
              bg-white 
              border border-border
              flex 
              items-center 
              justify-center 
              cursor-pointer 
              hover:bg-neutral-100 
              transition
            "
          >
            <BiSearch className="text-black" size={20} />
          </button>
        </div>
        </div>
        {/*  */}
        <div className="flex justify-between items-center gap-x-4">
          {user ? (
            <div className="flex gap-x-4 items-center">
              <Button onClick={handleLogout} className="px-6 py-2">
                Logout
              </Button>
              <Button
                onClick={() => router.push("/account")}
              >
                <FaUserAlt />
              </Button>
            </div>
          ) : (
            <>
              <div>
                <Button
                  onClick={onOpen}
                  variant="ghost"
                  className="
                    font-medium
                  "
                >
                  Sign up
                </Button>
              </div>
              <div>
                <Button onClick={onOpen} className="px-6 py-2">
                  Log in
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
      {children}
    </div>
  );
};
export default Header;
