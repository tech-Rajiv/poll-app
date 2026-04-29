"use client";

import React, { ChangeEvent, useCallback, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { useModal } from "../AuthModalContext";
import toast from "react-hot-toast";

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

export function SignupModal() {
  const { closeModal } = useModal();

  const [signupForm, setSignupForm] = useState<AuthForm>({
    email: "",
    password: "",
  });
  const [signupErrors, setSignupErrors] = useState<Errors>({});
  const [signupLoading, setSignupLoading] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [signupErrorMessage, setSignupErrorMessage] = useState<string | null>(null);

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

  const handleSignupChange = (e: ChangeEvent<HTMLInputElement>) => {
    const field = e.target.name as keyof AuthForm;
    const value = e.target.value;

    setSignupForm((prev) => ({ ...prev, [field]: value }));
    setSignupErrors((prev) => ({ ...prev, [field]: "" }));
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

  const handleSignup = async () => {
    const validationErrors = validate(signupForm);
    if (Object.keys(validationErrors).length > 0) {
      setSignupErrors(validationErrors);
      return;
    }

    try {
      setSignupLoading(true);
      setSignupErrorMessage(null);

      await toast.promise(
        (async () => {
          const { error } = await supabase.auth.signUp({
            email: signupForm.email,
            password: signupForm.password,
          });
          if (error) throw error;
        })(),
        {
          loading: "Creating account…",
          success: <b>Account created</b>,
          error: <b>Could not sign up.</b>,
        },
      );
      closeModal();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Signup failed";
      setSignupErrorMessage(message);
    } finally {
      setSignupLoading(false);
    }
  };

  return (
    <>
      <div className="text-center">
        <h2 className="text-2xl font-semibold">Create Account</h2>
        <p className="text-sm text-gray-500">Sign up to get started</p>
      </div>

      <div>
        <label className="text-sm font-medium">
          Email <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          name="email"
          value={signupForm.email}
          onChange={handleSignupChange}
          placeholder="Enter your email"
          className={`input ${signupErrors.email ? "input-error" : ""}`}
        />
        {signupErrors.email && <p className="error-text">{signupErrors.email}</p>}
      </div>

      <div>
        <label className="text-sm font-medium">
          Password <span className="text-red-500">*</span>
        </label>

        <div className="relative">
          <input
            type={showSignupPassword ? "text" : "password"}
            name="password"
            value={signupForm.password}
            onChange={handleSignupChange}
            placeholder="Enter your password"
            className={`input pr-10 ${signupErrors.password ? "input-error" : ""}`}
          />

          <button
            type="button"
            onClick={() => setShowSignupPassword(!showSignupPassword)}
            className="absolute right-3 top-2.5 text-sm text-gray-500"
          >
            {showSignupPassword ? "Hide" : "Show"}
          </button>
        </div>

        {signupErrors.password && <p className="error-text">{signupErrors.password}</p>}
      </div>

      {signupErrorMessage && <p className="error-text">{signupErrorMessage}</p>}

      <button
        onClick={handleSignup}
        disabled={signupLoading}
        className="btn btn-primary w-full"
      >
        {signupLoading ? "Creating..." : "Signup"}
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
    </>
  );
}

