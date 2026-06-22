/**
 * @fileoverview Manages song upload modal visibility state.
 * Provides a Zustand store for opening and closing the upload modal globally.
 * @author Maruf Bepary
 */

import { create } from "zustand";
import type { ModalStore } from "../types/player/modal-store";

/**
 * Hook for managing the song upload modal visibility state.
 * Uses Zustand for global modal state management.
 * Allows components to open the upload modal for adding new songs to the app.
 *
 * @returns Object containing modal state and control methods.
 *   - isOpen: Boolean indicating if the upload modal is currently open
 *   - onOpen: Function to display the upload modal
 *   - onClose: Function to hide the upload modal
 * @see useAuthModal for the authentication modal state
 * @author Maruf Bepary
 */
const useUploadModal = create<ModalStore>((set) => ({
  isOpen: false, // initial modal is closed
  onOpen: () => set({ isOpen: true }), // open modal
  onClose: () => set({ isOpen: false }), // close modal
}));

export default useUploadModal;
