# **Types Directory**

Types in TypeScript are used to specify the shape of an object or the type of a variable. This helps ensure that operations on variables are safe, meaning that you're not trying to do something with a variable that's not possible. In a TypeScript project, we usually have one or more `types.ts` file where we define the types used across our application.

## **types_db.ts**
This file defines the structure of the data in the database. It's a TypeScript representation of your database schema. Each table in the database has three interfaces: `Row`, `Insert`, and `Update`.

- `Row` represents a row in the table. Every field in the table is present in this interface.

- `Insert` represents a row to be inserted into the table. Fields that are not required in the table are marked as optional (with the `?` suffix).

- `Update` represents a row to be updated in the table. All fields are optional because you might not want to update every field.

Here are brief explanations of the tables represented in the types:

- `liked_songs`: This table keeps track of songs liked by users.

- `songs`: This table contains the information related to songs.

- `users`: This table stores profile information for each user.

## **types.ts**
This file defines the types for various entities in your application.

- `Song`: Represents a song in your application. It includes the id of the song, the user id of the uploader, the author, title, path of the song file, and the path of the image file associated with the song.

- `UserDetails`: Represents the details of a user. This includes the id, full name, avatar url, billing address, and payment method information saved for the user.
