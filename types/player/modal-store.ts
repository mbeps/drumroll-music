/**
 * State management contract for modal components using Zustand.
 * Provides standard interface for controlling modal visibility and behavior.
 * Implemented by hook stores that manage specific modal states.
 * @interface ModalStore
 * @property {boolean} isOpen - Current visibility state of the modal
 * @property {() => void} onOpen - Function to open/show the modal
 * @property {() => void} onClose - Function to close/hide the modal
 * @example
 * const authModal: ModalStore = {
 *   isOpen: false,
 *   onOpen: () => setIsOpen(true),
 *   onClose: () => setIsOpen(false)
 * };
 */
export interface ModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}
