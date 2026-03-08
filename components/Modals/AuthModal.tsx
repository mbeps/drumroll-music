"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

import useAuthModal from "@/hooks/useAuthModal";
import { ROUTES } from "@/routes";
import { SignInSchema } from "@/schemas/auth/sign-in.schema";
import { SignUpSchema } from "@/schemas/auth/sign-up.schema";
import { ForgotPasswordSchema } from "@/schemas/auth/forgot-password.schema";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  useSessionContext,
  useSupabaseClient,
} from "@/providers/SupabaseProvider";

/** The set of views the AuthModal can display, controlling which form and copy are rendered. @author Maruf Bepary */
type AuthView = "signIn" | "signUp" | "forgotPassword";

/**
 * Static list of supported OAuth providers rendered as icon buttons in the modal.
 * Each entry declares the Supabase provider key, display label, and icon component.
 *
 * @author Maruf Bepary
 */
const oauthProviders = [
  { provider: "github" as const, label: "Sign in with Github", icon: FaGithub },
  { provider: "google" as const, label: "Sign in with Google", icon: FcGoogle },
];

/**
 * Authentication modal which allows the user to authenticate or reset password.
 * Users can authenticate using email/password or third-party providers.
 *
 * @returns (JSX.Element): auth modal component
 */
const AuthModal = () => {
  const router = useRouter();
  const { isOpen, onClose } = useAuthModal();
  const supabaseClient = useSupabaseClient();
  const { session } = useSessionContext();

  const [view, setView] = useState<AuthView>("signIn");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (session) {
      router.refresh();
      onClose();
    }
  }, [session, router, onClose]);

  useEffect(() => {
    if (!isOpen) {
      setView("signIn");
      setEmail("");
      setPassword("");
      setIsSubmitting(false);
    }
  }, [isOpen]);

  /**
   * Toggles the modal state (open/closed).
   *
   * @param open (boolean): whether the modal is open or not
   */
  const onChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  const origin =
    typeof window !== "undefined" ? window.location.origin : undefined;

  /**
   * Initiates an OAuth flow with the selected provider.
   */
  const handleOAuthSignIn = async (provider: "github" | "google") => {
    try {
      setIsSubmitting(true);

      const { error } = await supabaseClient.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: origin,
        },
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to sign in.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Handles the email/password based flows: sign in, sign up and reset password.
   */
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const schema =
      view === "signIn"
        ? SignInSchema
        : view === "signUp"
        ? SignUpSchema
        : ForgotPasswordSchema;

    const parsed = schema.safeParse({ email, password });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Invalid input");
      return;
    }

    try {
      setIsSubmitting(true);

      if (view === "signIn") {
        const { error } = await supabaseClient.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          throw error;
        }

        toast.success("Logged in!");
      } else if (view === "signUp") {
        const { error } = await supabaseClient.auth.signUp({
          email,
          password,
        });

        if (error) {
          throw error;
        }

        toast.success("Check your email to confirm your account.");
      } else {
        const { error } = await supabaseClient.auth.resetPasswordForEmail(
          email,
          {
            redirectTo: origin ? `${origin}${ROUTES.ACCOUNT.path}` : undefined,
          }
        );

        if (error) {
          throw error;
        }

        toast.success("Password reset email sent.");
        setView("signIn");
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Something went wrong.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Derives the submit button label from the current view.
   * Returns the appropriate action string for sign-in, sign-up, or password reset.
   *
   * @author Maruf Bepary
   */
  const primaryActionLabel = useMemo(() => {
    if (view === "signIn") return "Sign in";
    if (view === "signUp") return "Sign up";
    return "Send reset password instructions";
  }, [view]);

  return (
    <Dialog open={isOpen} onOpenChange={onChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Log In</DialogTitle>
          <DialogDescription>
            Log into your account using email and password or a provider
          </DialogDescription>
        </DialogHeader>
      <div className="flex flex-col gap-y-4">
        <div className="flex flex-col gap-y-2">
          {oauthProviders.map(({ provider, label, icon: Icon }) => (
            <button
              key={provider}
              type="button"
              disabled={isSubmitting}
              onClick={() => handleOAuthSignIn(provider)}
              className="flex items-center justify-center gap-x-2 rounded-xl border border-border bg-background px-3 py-3 text-sm font-medium text-foreground transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Icon size={18} />
              {label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-y-4">
          <div className="flex flex-col gap-y-4">
            <Input
              id="email"
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              disabled={isSubmitting}
              autoComplete="email"
              required
            />

            {view !== "forgotPassword" && (
              <Input
                id="password"
                type="password"
                placeholder={
                  view === "signUp" ? "Create a Password" : "Your password"
                }
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                disabled={isSubmitting}
                autoComplete={
                  view === "signUp" ? "new-password" : "current-password"
                }
                required
              />
            )}
          </div>

          <Button
            type="submit"
            disabled={
              isSubmitting ||
              !email ||
              (view !== "forgotPassword" && password.length === 0)
            }
          >
            {primaryActionLabel}
          </Button>
        </form>

        <div className="flex flex-col gap-y-2 text-center text-sm text-muted-foreground">
          {view === "signIn" && (
            <>
              <button
                type="button"
                onClick={() => {
                  setView("forgotPassword");
                  setPassword("");
                }}
                className="hover:text-foreground"
              >
                Forgot your password?
              </button>
              <button
                type="button"
                onClick={() => {
                  setView("signUp");
                  setPassword("");
                }}
                className="hover:text-foreground"
              >
                Don&apos;t have an account? Sign up
              </button>
            </>
          )}

          {view === "signUp" && (
            <button
              type="button"
              onClick={() => {
                setView("signIn");
                setPassword("");
              }}
              className="hover:text-foreground"
            >
              Already have an account? Sign in
            </button>
          )}

          {view === "forgotPassword" && (
            <button
              type="button"
              onClick={() => {
                setView("signIn");
                setPassword("");
              }}
              className="hover:text-foreground"
            >
              Already have an account? Sign in
            </button>
          )}
        </div>
      </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
