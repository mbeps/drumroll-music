/**
 * Playback repeat mode controlling how the queue handles track progression.
 * - `OFF`: No repetition, queue stops after last track
 * - `ALL`: Repeat entire queue when reaching the end
 * - `ONE`: Repeat the current track indefinitely
 * @type {"OFF" | "ALL" | "ONE"}
 * @author Maruf Bepary
 * @example
 * const mode: RepeatMode = "ALL";
 */
export type RepeatMode = "OFF" | "ALL" | "ONE";

/**
 * Array of all valid repeat modes for iteration and validation.
 * Used for UI cycle controls and state machine transitions.
 * Enables type-safe cycling through repeat modes in player controls.
 */
export const REPEAT_MODES: RepeatMode[] = ["OFF", "ALL", "ONE"];
