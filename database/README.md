# **Database Directory**

This directory contains SQL scripts which are responsible for creating tables and managing row level security for the PostgreSQL database used by our Supabase setup. It's crucial in establishing the structure and relations within our database, thereby helping us manage user data and interactions within the application.

## **Entities**

### **Users**

The `users` table stores user-specific data. This includes the unique user ID, the user's full name, avatar URL, billing address, and payment method details. 

The users should only have the ability to view and update their own data. To maintain this privacy and security, row-level security is enabled on the `users` table with policies that allow users to view and update their own data.

Additionally, a trigger function `handle_new_user()` is set up to create a new row in the `users` table automatically whenever a new user signs up via Supabase Auth. 

### **Songs**

The `songs` table manages song-related data. It contains a unique song ID, creation timestamp, song title, paths for song file and image, author name, and the user ID of the user who uploaded the song.

### **Liked Songs**

The `liked_songs` table stores user-song relations, specifically for liked songs. It keeps a record of the user ID and the ID of the song that they've liked along with the timestamp of when the song was liked.

## **Relationships**

There are some key relationships in this database structure:

1. **Users and Songs**: There is a one-to-many relationship between users and songs. A single user can upload many songs. The relationship is captured in the `songs` table through the `user_id` field.

2. **Users and Liked Songs**: There is a many-to-many relationship between users and liked songs. A user can like many songs, and a song can be liked by many users. This relationship is managed through the `liked_songs` table.

This database structure ensures that user data is kept securely, while also making it possible to track the songs they upload and like, providing a seamless music experience on our platform, Drumroll Music.