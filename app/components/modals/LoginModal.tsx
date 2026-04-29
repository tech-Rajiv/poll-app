"use client";

import React, { ChangeEvent, useCallback, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { useModal } from "../AuthModalContext";
import toast from "react-hot-toast";
import githubIcon from "../../../public/icons/github.png";
type Errors = {
  email?: string;
  password?: string;
};

type AuthForm = {
  email: string;
  password: string;
};

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
);

export function LoginModal() {
  const { closeModal } = useModal();

  const [tab, setTab] = useState<"password" | "magic">("password");

  const [loginForm, setLoginForm] = useState<AuthForm>({
    email: "",
    password: "",
  });
  const [loginErrors, setLoginErrors] = useState<Errors>({});
  const [loginLoading, setLoginLoading] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginErrorMessage, setLoginErrorMessage] = useState<string | null>(
    null,
  );

  const [magicEmail, setMagicEmail] = useState("");
  const [magicLoading, setMagicLoading] = useState(false);
  const [magicErrorMessage, setMagicErrorMessage] = useState<string | null>(
    null,
  );
  const [magicSent, setMagicSent] = useState(false);

  const validate = useCallback((form: AuthForm): Errors => {
    const newErrors: Errors = {};

    if (!form.email) {
      newErrors.email = "Email is required";
    } else if (!/^\\S+@\\S+\\.\\S+$/.test(form.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      newErrors.password = "Minimum 6 characters required";
    }

    return newErrors;
  }, []);

  const isValidEmail = (email: string) => /^\S+@\S+\.\S+$/.test(email);

  const handleLoginChange = (e: ChangeEvent<HTMLInputElement>) => {
    const field = e.target.name as keyof AuthForm;
    const value = e.target.value;

    setLoginForm((prev) => ({ ...prev, [field]: value }));
    setLoginErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleMagicEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMagicEmail(e.target.value);
    setMagicErrorMessage(null);
    setMagicSent(false);
  };

  const handleGoogleLogin = async () => {
    toast.loading("Redirecting to Google…");
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  const handleGithublogin = async () => {
    toast.loading("Redirecting to Github…");
    await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  const handleLogin = async () => {
    const validationErrors = validate(loginForm);
    if (Object.keys(validationErrors).length > 0) {
      setLoginErrors(validationErrors);
      return;
    }

    try {
      setLoginLoading(true);
      setLoginErrorMessage(null);
      await toast.promise(
        (async () => {
          const { error } = await supabase.auth.signInWithPassword({
            email: loginForm.email,
            password: loginForm.password,
          });
          if (error) throw error;
        })(),
        {
          loading: "Logging in…",
          success: <b>Logged in</b>,
          error: <b>Could not log in.</b>,
        },
      );
      closeModal();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Login failed";
      setLoginErrorMessage(message);
    } finally {
      setLoginLoading(false);
    }
  };

  const handleMagicLink = async (email: string) => {
    setMagicLoading(true);
    setMagicErrorMessage(null);
    setMagicSent(false);

    const validationEmailError = !email
      ? "Email is required"
      : !isValidEmail(email)
        ? "Invalid email format"
        : null;

    if (validationEmailError) {
      toast.error(validationEmailError);
      setMagicErrorMessage(validationEmailError);
      setMagicLoading(false);
      return;
    }

    try {
      await toast.promise(
        (async () => {
          const { error } = await supabase.auth.signInWithOtp({
            email: email,
            options: {
              // Very important: This must match your Site URL in Supabase settings
              emailRedirectTo: `${window.location.origin}/auth/callback`,
            },
          });
          if (error) throw error;
        })(),
        {
          loading: "Sending magic link…",
          success: <b>Magic link sent</b>,
          error: <b>Could not send magic link.</b>,
        },
      );
      setMagicSent(true);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Error sending magic link";
      setMagicErrorMessage(message);
    } finally {
      setMagicLoading(false);
    }
  };

  return (
    <>
      <div className="flex gap-2">
        <button
          type="button"
          className={`btn flex-1 ${
            tab === "password" ? "btn-secondary" : "btn-outline"
          }`}
          onClick={() => {
            setTab("password");
            setMagicErrorMessage(null);
            setLoginErrorMessage(null);
          }}
        >
          Login
        </button>

        <button
          type="button"
          className={`btn flex-1 ${
            tab === "magic" ? "btn-secondary" : "btn-outline"
          }`}
          onClick={() => {
            setTab("magic");
            setMagicErrorMessage(null);
            setLoginErrorMessage(null);
            setMagicSent(false);
            setMagicEmail(loginForm.email);
          }}
        >
          Sign in with magic link
        </button>
      </div>

      {tab === "password" ? (
        <>
          <div className="text-center">
            <h2 className="text-2xl font-semibold">Welcome Back</h2>
            <p className="text-sm text-gray-500">Login to your account</p>
          </div>

          <div>
            <label className="text-sm font-medium">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={loginForm.email}
              onChange={handleLoginChange}
              placeholder="Enter your email"
              className={`input ${loginErrors.email ? "input-error" : ""}`}
            />
            {loginErrors.email && (
              <p className="error-text">{loginErrors.email}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium">
              Password <span className="text-red-500">*</span>
            </label>

            <div className="relative">
              <input
                type={showLoginPassword ? "text" : "password"}
                name="password"
                value={loginForm.password}
                onChange={handleLoginChange}
                placeholder="Enter your password"
                className={`input pr-10 ${
                  loginErrors.password ? "input-error" : ""
                }`}
              />

              <button
                type="button"
                onClick={() => setShowLoginPassword(!showLoginPassword)}
                className="absolute right-3 top-2.5 text-sm text-gray-500"
              >
                {showLoginPassword ? "Hide" : "Show"}
              </button>
            </div>

            {loginErrors.password && (
              <p className="error-text">{loginErrors.password}</p>
            )}
          </div>

          {loginErrorMessage && (
            <p className="error-text">{loginErrorMessage}</p>
          )}

          <button
            onClick={handleLogin}
            disabled={loginLoading}
            className="btn btn-primary w-full"
          >
            {loginLoading ? "Logging in..." : "Login"}
          </button>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-300" />
            <span className="text-sm text-gray-400">or</span>
            <div className="flex-1 h-px bg-gray-300" />
          </div>

          <button
            onClick={handleGoogleLogin}
            className="btn btn-outline w-full flex items-center justify-center gap-2"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              className="w-5 h-5"
              alt="google"
            />
            Continue with Google
          </button>
          <button
            onClick={handleGithublogin}
            className="btn btn-outline w-full flex items-center justify-center gap-2"
          >
            {githubIcon.src && (
              <img src={githubIcon.src} className="w-5 h-5" alt="github" />
            )}
            Continue with Github
          </button>
        </>
      ) : (
        <>
          <div className="text-center">
            <h2 className="text-2xl font-semibold">Sign in with magic link</h2>
            <p className="text-sm text-gray-500">
              We will email you a sign-in link
            </p>
          </div>

          <div>
            <label className="text-sm font-medium">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={magicEmail}
              onChange={handleMagicEmailChange}
              placeholder="Enter your email"
              className={`input ${magicErrorMessage ? "input-error" : ""}`}
            />
            {magicErrorMessage && (
              <p className="error-text">{magicErrorMessage}</p>
            )}
          </div>

          {!magicSent ? (
            <button
              onClick={() => handleMagicLink(magicEmail)}
              disabled={magicLoading}
              className="btn btn-primary w-full"
            >
              {magicLoading ? "Sending..." : "Send magic link"}
            </button>
          ) : (
            <div className="info-alert">otp send successfull</div>
          )}

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-300" />
            <span className="text-sm text-gray-400">or</span>
            <div className="flex-1 h-px bg-gray-300" />
          </div>

          <button
            onClick={handleGoogleLogin}
            className="btn btn-outline w-full flex items-center justify-center gap-2"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              className="w-5 h-5"
              alt="google"
            />
            Continue with Google
          </button>
        </>
      )}
    </>
  );
}
