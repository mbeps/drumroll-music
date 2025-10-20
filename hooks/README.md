# **Hooks Directory**

This directory contains custom hooks which provide encapsulated and reusable stateful logic that can be shared across components in the application.

## **useAuthModal.ts**
This hook manages the state of the user authentication modal. It returns an object with the modal state (`isOpen`) and two functions to open (`onOpen`) and close (`onClose`) the modal.

## **useDebounce.ts**
This hook provides debounced values. It's useful for delaying search operations that could be expensive as the user types, instead initiating the search after the user pauses their typing.

## **useGetSongById.ts**
This hook fetches a song from the Supabase `songs` table by its ID. It returns an object with loading state (`isLoading`) and the song data (`song`).

## **useLoadImage.ts**
This hook loads the public URL of a song's image from the Supabase storage. It's useful for displaying album cover or song-related images.

## **useLoadSongUrl.ts**
This hook loads the public URL of a song from the Supabase storage. This is essential for playing the actual song file.

## **useOnPlay.ts**
This hook contains the logic for when a song is selected to be played. It ensures that a user is authenticated before playing a song. If not, it opens the auth modal. Once authenticated, it sets the selected song ID and the playlist of song IDs to the player.

## **usePlayer.ts**
This hook manages the state of the music player. It stores the current song ID (`activeId`), the playlist of song IDs (`ids`), and functions to set the current song (`setId`), set the playlist (`setIds`), and reset the player (`reset`).

## **useUploadModal.ts**
This hook manages the state of the song upload modal. Similar to `useAuthModal`, it returns an object with the modal state (`isOpen`) and two functions to open (`onOpen`) and close (`onClose`) the modal.

## **useUser.ts**
This hook retrieves and manages user-related data including access token, user details, and loading state. It makes sure that the necessary data is fetched when a user is logged in, and cleaned up when a user is logged out. The provided context allows for easy access to user data throughout the application.
