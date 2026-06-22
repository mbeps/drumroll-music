import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import React from "react";
import { afterEach, vi } from "vitest";

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

// Basic Next.js mocks for client components
vi.mock("next/navigation", () => {
  const push = vi.fn();
  const back = vi.fn();
  const forward = vi.fn();
  const refresh = vi.fn();
  const replace = vi.fn();
  const useRouter = () => ({ push, back, forward, refresh, replace });
  const usePathname = vi.fn(() => "/");
  const useSearchParams = vi.fn(() => new URLSearchParams());
  return { useRouter, usePathname, useSearchParams };
});

vi.mock("next/link", () => ({
  __esModule: true,
  default: ({
    href,
    children,
    ...props
  }: {
    href: string;
    children: React.ReactNode;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

vi.mock("next/image", () => ({
  __esModule: true,
  default: ({ src, alt, ...props }: { src: string | object; alt?: string } & Record<string, unknown>) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={typeof src === "string" ? src : ""} alt={alt ?? ""} {...(props as Record<string, unknown>)} />
  ),
}));

// Global Supabase and User mocks
vi.mock("@/providers/supabase-provider", () => ({
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useSessionContext: vi.fn(() => ({
    session: null,
    isLoading: false,
    supabaseClient: {
      from: vi.fn(() => ({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            single: vi.fn(() => Promise.resolve({ data: null, error: null })),
            maybeSingle: vi.fn(() => Promise.resolve({ data: null, error: null })),
          })),
        })),
        insert: vi.fn(() => Promise.resolve({ data: null, error: null })),
        update: vi.fn(() => Promise.resolve({ data: null, error: null })),
        delete: vi.fn(() => Promise.resolve({ data: null, error: null })),
      })),
      auth: {
        getSession: vi.fn(() => Promise.resolve({ data: { session: null }, error: null })),
        getUser: vi.fn(() => Promise.resolve({ data: { user: null }, error: null })),
        onAuthStateChange: vi.fn(() => ({ data: { subscription: { unsubscribe: vi.fn() } } })),
      },
      storage: {
        from: vi.fn(() => ({
          getPublicUrl: vi.fn(() => ({ data: { publicUrl: "" } })),
          upload: vi.fn(() => Promise.resolve({ data: null, error: null })),
          remove: vi.fn(() => Promise.resolve({ data: null, error: null })),
        })),
      },
    },
  })),
  useSupabaseClient: vi.fn(() => ({
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(() => Promise.resolve({ data: null, error: null })),
          maybeSingle: vi.fn(() => Promise.resolve({ data: null, error: null })),
        })),
      })),
    })),
    storage: {
      from: vi.fn(() => ({
        getPublicUrl: vi.fn(() => ({ data: { publicUrl: "" } })),
      })),
    },
  })),
  useSupabaseUser: vi.fn(() => null),
}));

vi.mock("@/hooks/use-user", () => {
  return {
    MyUserContextProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    useUser: vi.fn(() => ({
      accessToken: null,
      user: null,
      userDetails: null,
      isLoading: false,
    })),
  };
});

