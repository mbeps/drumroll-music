/**
 * Function signature for initiating playback of a song by ID.
 * Used throughout UI components to trigger music playback with queue setup.
 * Typically wired to track selection clicks and button handlers.
 * @type {(id: number) => void}
 * @param {number} id - The song ID to play
 * @example
 * const handlePlay: OnPlayFn = (songId) => {
 *   playSound();
 *   setupQueue(songId);
 * };
 */
export type OnPlayFn = (id: number) => void;
