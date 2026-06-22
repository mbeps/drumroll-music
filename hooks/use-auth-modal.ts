/**
 * @fileoverview Manages authentication modal visibility state.
 * Provides a Zustand store for opening and closing the auth modal globally.
 * @author Maruf Bepary
 */

import { create } from "zustand";
import type { ModalStore } from "../types/player/modal-store";

/**
 * Hook for managing the authentication modal visibility state.
 * Uses Zustand for global modal state management.
 * Allows components to open the auth modal when user authentication is required.
 *
 * @returns Object containing modal state and control methods.
 *   - isOpen: Boolean indicating if the auth modal is currently open
 *   - onOpen: Function to display the auth modal
 *   - onClose: Function to hide the auth modal
 * @see useUploadModal for the upload modal state
 * @author Maruf Bepary
 */
const useAuthModal = create<ModalStore>((set) => ({
  isOpen: false, // initial modal is closed
  onOpen: () => set({ isOpen: true }), // open modal
  onClose: () => set({ isOpen: false }), // close modal
}));

export default useAuthModal;
