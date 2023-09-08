<img width="1000" alt="cover" src="https://github.com/mbeps/drumroll-music/assets/58662575/5ce56436-a1f9-4da0-9c8d-76068d9ef912">

---

Welcome to Drumroll Music - a platform dedicated to delivering a streamlined and personal music streaming experience. With Drumroll Music, you can easily sign-in using various methods, upload your favorite songs, like tracks, and listen using our built-in player. Search for songs anytime, anywhere. Simple, intuitive, and focused on what truly matters - your music. Welcome to Drumroll Music, your personal stage for musical enjoyment.

# **Requirements**
These are the requirements needed to run the project:
- Node 18 LTS
- Next.JS 13
- Supabase V2

# **Features**
## **Authentication**
The system has several key user authentication and account management features designed to ensure that users have a seamless and secure experience:
- Users can sign up using email and password
- Users can log in using email and password
- Users can sign up and log in using third party providers (Google and GitHub)
- Users can log out 
- Users can reset their passwords

## **Music Streaming**
The system has several music management features designed for users to enjoy their music online:
- Users can upload their music 
- Users can like songs
- Users can play songs using the built in player whether they are logged in or not
- Users can search for songs 

# **Stack**
These are the main technologies that were used in this project:
## **Front-End**
- [**TypeScript**](https://www.typescriptlang.org/): TypeScript is a superset of JavaScript that adds optional static typing and other features to make the development of large-scale JavaScript applications easier and more efficient. TypeScript enables developers to catch errors earlier in the development process, write more maintainable code, and benefit from advanced editor support.
- [**Next.js**](https://nextjs.org/): Next.js is a popular React framework for building server-side rendered (SSR) and statically generated web applications. It provides a set of tools and conventions that make it easy to build modern, performant web applications that can be easily deployed to a variety of hosting environments.
- [**Tailwind CSS**](https://tailwindcss.com/):  a highly customizable, low-level CSS framework, provides utility classes that help us build out custom designs efficiently and responsively.
- [**Radix UI**](https://www.radix-ui.com/): Radix UI is a low-level, unstyled, and headless (renderless) UI component library. By being headless, Radix UI allows developers to create user interfaces with complete design freedom, providing functionality without dictating style. It delivers accessibility out-of-the-box, and works well with popular frameworks like React, thus fitting seamlessly into modern front-end development workflows.

## **Back-End**
- [**Supabase**](https://supabase.io/): Supabase is a powerful open-source alternative to Google's Firebase. It provides a suite of tools and services that make it easy to build and scale complex applications, including real-time databases, authentication and authorization, storage, serverless functions, and more. Supabase uses PostgreSQL as its underlying database, providing a robust and reliable data layer for your application.
- [**PostgreSQL**](https://www.postgresql.org/): PostgreSQL is a powerful, open-source object-relational database system that uses and extends the SQL language combined with many features that safely store and scale the most complicated data workloads. PostgreSQL is known for its proven architecture, strong reliability, data integrity, and correctness. It's highly scalable both in the sheer quantity of data it can manage and in the number of concurrent users it can accommodate. It's utilized as the primary database for the Supabase services, bringing advanced functionalities and stability.

# **Running Application Locally**
These are simple steps to run the application locally. For more detail instructions, refer to the [Wiki](https://github.com/mbeps/drumroll-music/wiki).

## 1. **Clone the Project Locally**
You'll first need to clone the project repository to your local machine. Open your terminal, navigate to the directory where you want to store the project, and run the following command:

```sh
git clone https://github.com/mbeps/ringmaster-messaging.git
```

## 2. **Install Dependencies**
Navigate to the root directory of the project by running the following command:
```sh
cd drumroll-music
```

Then, install the project dependencies by running:
```sh
npm install
```

## 3. **Set Up Environment Variables**
You'll need to set up your environment variables to run the application. In the root of your project, create a `.env.local` file. The environment variables you'll need to include are:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_REFERENCE_ID=
```

You'll need to fill in the value for each of these variables. Here's how to get each one:
- `NEXT_PUBLIC_SUPABASE_URL`: This is your Supabase project's unique URL. You can find this within your Supabase dashboard. Navigate to your project's settings and you will find the API URL listed there.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: This is the public anonymous key for your Supabase project. It's also found within your project settings on your Supabase dashboard under the API section. It's used for unauthenticated requests.
- `SUPABASE_SERVICE_ROLE_KEY`: This key represents the service role in your Supabase project, which has powerful privileges. Navigate to your project's API settings in your Supabase dashboard to find this key. Be careful with this key as it has the ability to bypass all permissions and rules.
- `SUPABASE_REFERENCE_ID`: This is a reference ID that's used for specific tasks within your project, such as referencing tables or rows. Depending on how you've set up your Supabase project, you may need to generate or define this ID yourself.

## 4. **Set Up Supabase**
To get your Supabase instance up and running, you'll need to do a few things:

1. **Run SQL queries**: Navigate to the `database` folder in your local project. In this folder, you'll find several SQL files containing the queries necessary to create tables and policies. You will need to run these SQL scripts inside your Supabase project.

   To do this, head to your Supabase dashboard and select the `SQL` option from the left-hand panel. Here you can write or paste SQL scripts to be executed. Copy each query from your SQL files and run them in the Supabase editor.

2. **Enable authentication providers**: This app uses Email, Google, and GitHub as authentication providers. To enable these, head over to the `Authentication` section in your Supabase dashboard, click on `Settings` and then `External OAuth Providers`. Here, you can enable and configure your providers as needed.

3. **Create storage buckets**: In Supabase, you'll need to create two buckets for storing data: 'images' and 'songs'.

   To create a bucket, navigate to the `Storage` section in your Supabase dashboard, then click on the `New bucket` button. Fill in the bucket name as 'images' or 'songs', and submit the form. Repeat this step for the second bucket.

4. **Set bucket policies**: After creating your buckets, you need to set policies that allow inserting, updating, and deleting for all authenticated users.

   From the `Storage` section in your dashboard, click on a bucket name. On the bucket details page, click on the `Policies` tab. Here, you can add policies to allow operations (insert, update, delete) by adding a policy with the SQL condition to check if the user is authenticated.

Remember, setting up your Supabase environment correctly is vital for your application to function as expected. Ensure you've followed each step closely.

## 5. **Run the Application**
Once you've set up your environment and its variables variables, you can run the application using the following command:

```
npm run dev
```

The application should now be running at http://localhost:3000.
