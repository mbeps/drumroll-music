# **App Directory**

This is a Next.JS 13 app that uses the app directory (beta) to create layouts, nested routes, and server components. The app directory works alongside the pages directory to support incremental adoption and provide other new features like server-side rendering and static-site generation.

## **Files and Folders**

The app directory can contain the following files and folders:

- `page.jsx`: This file defines the UI for a particular route. For example, `app/profile/settings/page.jsx` will render the `/profile/settings` route.
- `loading.tsx`: This file is optional and defines a loading component that will be shown immediately on the first load as well as when navigating between sibling routes. It automatically wraps the page inside a React suspense boundary.
- `error.tsx`: This file is optional and defines an error component that will be shown whenever any error occurs inside the folder where this file is placed. It automatically wraps the page inside a React error boundary.
- `layout.tsx`: This file is optional and defines a layout component that will wrap all the pages inside the folder where this file is placed. It can also fetch data for the entire layout using server components.
- `api`: This folder contains API routes that can be accessed by using `fetch` or `axios` from the client-side or server-side. For example, `app/api/hello.js` will handle requests to `/api/hello`.

## **Page Routing**

The app directory supports nested routes by using folders inside it. The UI for a route is defined by a `page.jsx` file inside the corresponding folder. For example, `app/blog/[slug]/page.jsx` will render the `/blog/:slug` route, where `:slug` is a dynamic parameter.

The app directory also supports route groups by using square brackets around a folder name. For example, `app/[user]/[post]/page.jsx` will render the `/user/post` route group, where both `user` and `post` are dynamic parameters.

## **Server Components**

The app directory uses server components by default to fetch data and render UI on the server. Server components are special React components that can only run on the server and have access to Node.js APIs. They can be imported using `.server.js` or `.server.tsx` extensions.

Server components can improve performance by reducing bundle size, avoiding hydration, and streaming HTML to the client. They can also simplify data fetching by colocating it with the UI components that need it.

To use server components, you need to install `@next/server-components` and add it to your `next.config.js` file:

```js
const withServerComponents = require("@next/server-components");

module.exports = withServerComponents({
  // your Next.js config
});
```

You can learn more about server components from [this blog post](https://nextjs.org/blog/next-13#server-components).