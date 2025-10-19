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
import Button from "./Button";
import { useSupabaseClient } from "@/providers/SupabaseProvider";

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
				bg-gradient-to-b 
				from-rose-900
				p-6
				`,
        className
      )}
    >
      <div className="w-full mb-4 flex items-center justify-between">
        {/* Desktop View */}
        <div className="hidden md:flex gap-x-2 items-center">
          <button
            onClick={() => router.back()}
            className="
              rounded-lg 
              bg-black 
              flex 
              items-center 
              justify-center 
              cursor-pointer 
              hover:opacity-75 
              transition
            "
          >
            <RxCaretLeft className="text-white" size={35} />
          </button>
          <button
            onClick={() => router.forward()}
            className="
              rounded-lg 
              bg-black 
              flex 
              items-center 
              justify-center 
              cursor-pointer 
              hover:opacity-75 
              transition
            "
          >
            <RxCaretRight className="text-white" size={35} />
          </button>
        </div>
        {/* Mobile View */}
        <div className="flex md:hidden gap-x-2 items-center">
          <button
            onClick={() => router.push("/")}
            className="
              rounded-lg 
              p-2 
              bg-black 
              flex 
              items-center 
              justify-center 
              cursor-pointer 
              hover:opacity-75 
              transition
            "
          >
            <HiHome className="text-white" size={20} />
          </button>
          <button
            onClick={() => router.push("/search")}
            className="
              rounded-lg
              p-2 
              bg-black 
              flex 
              items-center 
              justify-center 
              cursor-pointer 
              hover:opacity-75 
              transition
            "
          >
            <BiSearch className="text-white" size={20} />
          </button>
        </div>
        {/*  */}
        <div className="flex justify-between items-center gap-x-4">
          {user ? (
            <div className="flex gap-x-4 items-center">
              <Button onClick={handleLogout} className="bg-black px-6 py-2">
                Logout
              </Button>
              <Button
                onClick={() => router.push("/account")}
                className="bg-black"
              >
                <FaUserAlt />
              </Button>
            </div>
          ) : (
            <>
              <div>
                <Button
                  onClick={onOpen}
                  className="
                    bg-transparent 
                    text-neutral-300 
                    font-medium
                  "
                >
                  Sign up
                </Button>
              </div>
              <div>
                <Button onClick={onOpen} className="bg-black px-6 py-2">
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
