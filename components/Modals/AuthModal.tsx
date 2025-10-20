"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

import useAuthModal from "@/hooks/useAuthModal";
import Modal from "./Modal";
import Button from "../Button";
import Input from "../Input";
import {
  useSessionContext,
  useSupabaseClient,
} from "@/providers/SupabaseProvider";

type AuthView = "signIn" | "signUp" | "forgotPassword";

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

    if (!email) {
      toast.error("Email is required");
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
            redirectTo: origin ? `${origin}/account` : undefined,
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

  const primaryActionLabel = useMemo(() => {
    if (view === "signIn") return "Sign in";
    if (view === "signUp") return "Sign up";
    return "Send reset password instructions";
  }, [view]);

  const primaryButtonClassName = useMemo(
    () =>
      view === "signUp"
        ? ""
        : "bg-transparent border border-red-500 hover:bg-red-500/10",
    [view]
  );

  return (
    <Modal
      title="Log In"
      description="Log into your account using email and password or a provider"
      isOpen={isOpen}
      onChange={onChange}
    >
      <div className="flex flex-col gap-y-4">
        <div className="flex flex-col gap-y-2">
          {oauthProviders.map(({ provider, label, icon: Icon }) => (
            <button
              key={provider}
              type="button"
              disabled={isSubmitting}
              onClick={() => handleOAuthSignIn(provider)}
              className="flex items-center justify-center gap-x-2 rounded-xl border border-neutral-700 bg-neutral-800 px-3 py-3 text-sm font-medium text-white transition hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-60"
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
            className={primaryButtonClassName}
          >
            {primaryActionLabel}
          </Button>
        </form>

        <div className="flex flex-col gap-y-2 text-center text-sm text-neutral-400">
          {view === "signIn" && (
            <>
              <button
                type="button"
                onClick={() => {
                  setView("forgotPassword");
                  setPassword("");
                }}
                className="hover:text-white"
              >
                Forgot your password?
              </button>
              <button
                type="button"
                onClick={() => {
                  setView("signUp");
                  setPassword("");
                }}
                className="hover:text-white"
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
              className="hover:text-white"
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
              className="hover:text-white"
            >
              Already have an account? Sign in
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default AuthModal;
