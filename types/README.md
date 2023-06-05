# **Types Directory**

Types in TypeScript are used to specify the shape of an object or the type of a variable. This helps ensure that operations on variables are safe, meaning that you're not trying to do something with a variable that's not possible. In a TypeScript project, we usually have one or more `types.ts` file where we define the types used across our application.

## **types_db.ts**
This file defines the structure of the data in the database. It's a TypeScript representation of your database schema. Each table in the database has three interfaces: `Row`, `Insert`, and `Update`.

- `Row` represents a row in the table. Every field in the table is present in this interface.

- `Insert` represents a row to be inserted into the table. Fields that are not required in the table are marked as optional (with the `?` suffix).

- `Update` represents a row to be updated in the table. All fields are optional because you might not want to update every field.

Here are brief explanations of some tables:

- `customers`: This table stores the information related to customers.

- `liked_songs`: This table keeps track of songs liked by users.

- `songs`: This table contains the information related to songs.

- `subscriptions`: This table holds the information about the subscriptions.

## **types.ts**
This file defines the types for various entities in your application.

- `Song`: Represents a song in your application. It includes the id of the song, the user id of the uploader, the author, title, path of the song file, and the path of the image file associated with the song.

- `Product`: Represents a product that can be sold in your application. This includes the id of the product, whether the product is active, the name, description, image associated with the product, and some metadata.

- `Price`: Represents the price of a product. This includes the id of the price, the product id it is associated with, whether it is active, description, amount, currency, type, interval of billing, interval count, trial period days, metadata, and the product associated with the price.

- `Customer`: Represents a customer in your application. This includes the id of the customer and the Stripe customer id.

- `UserDetails`: Represents the details of a user. This includes the id, first name, last name, full name, avatar url, billing address, and payment method.

- `ProductWithPrice`: Represents a product along with its prices. This includes all fields from the Product type, and an array of Prices.

- `Subscription`: Represents a subscription in your application. This includes the id of the subscription, user id, status, metadata, price id, quantity, whether it is set to cancel at period end, created date, start and end of the current period, end date, cancel date, cancel at date, trial start and end dates, and the price of the subscription.