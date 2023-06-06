# **Actions Directory**

Actions in general are responsible for fetching data and performing business logic related to that data. In the context of a React application, actions can include functions that communicate with an API to fetch or manipulate data. Actions help to abstract the data-fetching logic away from the components, promoting a clean separation of concerns. The below actions are using Supabase client to communicate with a database.

## **getLikedSongs.ts**
The `getLikedSongs` action is responsible for retrieving all songs liked by the currently authenticated user. It first gets the current user session, then fetches all records from the "liked_songs" table that match the current user's ID. It orders the songs based on the "created_at" field in descending order. The return value is an array of liked songs.

## **getSongsByTitle.ts**
The `getSongsByTitle` action is used to fetch songs from the database based on their title. It first checks whether a title has been provided. If no title has been provided, it fetches all songs from the database. If a title is provided, it fetches songs whose title includes the provided title. It orders the songs based on the "created_at" field in descending order. The return value is an array of songs.

## **getSongsByUserId.ts**
The `getSongsByUserId` action fetches songs from the database that match a given user ID. This action first gets the current user session and then fetches songs from the "songs" table where the user_id field matches the current user's ID. It orders the songs based on the "created_at" field in descending order. The return value is an array of songs.

## **getSongs.ts**
The `getSongs` action is a general action used to fetch all songs from the database. It does this by querying the "songs" table and selecting all records. It orders the songs based on the "created_at" field in descending order. The return value is an array of songs.