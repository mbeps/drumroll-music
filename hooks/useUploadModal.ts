import { create } from "zustand";

interface UploadModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

/**
 * Manages the state of the song upload modal:
 * - `isOpen`: whether the modal is open or not
 * - `onOpen`: function to open the modal
 * - `onClose`: function to close the modal
 */
const useUploadModal = create<UploadModalStore>((set) => ({
  isOpen: false, // initial modal is closed
  onOpen: () => set({ isOpen: true }), // open modal
  onClose: () => set({ isOpen: false }), // close modal
}));

export default useUploadModal;
