# **Providers Directory**

Providers in React serve as a way to share state and functionality across multiple components without the need to pass props down manually at every level. Providers are part of the React Context API which allows for global state management.

## **ModalProvider.tsx**
The `ModalProvider` component is responsible for rendering authentication and upload modals. It prevents errors in server-side rendering by ensuring that modals are only rendered on the client side (modals can cause hydration errors).

## **SupabaseProvider.tsx**
The `SupabaseProvider` component wraps its children with the Supabase `SessionContextProvider` that provides an instance of the Supabase client. This allows for access to the Supabase client throughout the application without having to recreate a new instance each time.

## **ToasterProvider.tsx**
The `ToasterProvider` component is responsible for providing toasts (small messages) that appear to notify the user about application events. Toast options such as style can be configured in this component.

## **UserProvider.tsx**
The `UserProvider` component wraps its children with the `MyUserContextProvider`, allowing for user data and related functionality to be accessible to all components in the tree.
