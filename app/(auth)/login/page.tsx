"use client";

import React, { useEffect } from "react";
import { useModal } from "../../components/AuthModalContext";

export default function Page() {
  const { openModal } = useModal();

  useEffect(() => {
    openModal("login");
  }, [openModal]);

  return <div className="flex-1" />;
}

/* "use client";

import React, { useEffect } from "react";
import { useAuthModal } from "../../components/AuthModalContext";

export default function page() {
  const { openModal } = useAuthModal();

  useEffect(() => {
    openModal("login");
  }, [openModal]);

  // The actual login/signup UI lives in `AuthHeader` (mounted in `app/layout.tsx`).
  return <div className="flex-1" />;
}

"use client";
import React, { ChangeEvent, useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";

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

function page() {
  const [activeModal, setActiveModal] = useState<"login" | "signup" | null>(
    null,
  );

  const [loginForm, setLoginForm] = useState<AuthForm>({
    email: "",
    password: "",
  });
  const [signupForm, setSignupForm] = useState<AuthForm>({
    email: "",
    password: "",
  });

  const [loginErrors, setLoginErrors] = useState<Errors>({});
  const [signupErrors, setSignupErrors] = useState<Errors>({});

  const [loginLoading, setLoginLoading] = useState(false);
  const [signupLoading, setSignupLoading] = useState(false);

  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);

  const [loginErrorMessage, setLoginErrorMessage] = useState<string | null>(
    null,
  );
  const [signupErrorMessage, setSignupErrorMessage] = useState<string | null>(
    null,
  );

  useEffect(() => {
    if (!activeModal) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveModal(null);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeModal]);

  useEffect(() => {
    if (!activeModal) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [activeModal]);

  const validate = (form: AuthForm): Errors => {
    const newErrors: Errors = {};

    if (!form.email) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      newErrors.password = "Minimum 6 characters required";
    }

    return newErrors;
  };

  const handleLoginChange = (e: ChangeEvent<HTMLInputElement>) => {
    const field = e.target.name as keyof AuthForm;
    const value = e.target.value;
    setLoginForm((prev) => ({ ...prev, [field]: value }));

    // clear error on typing
    setLoginErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleSignupChange = (e: ChangeEvent<HTMLInputElement>) => {
    const field = e.target.name as keyof AuthForm;
    const value = e.target.value;
    setSignupForm((prev) => ({ ...prev, [field]: value }));

    // clear error on typing
    setSignupErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        // This is where Google sends them back
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

      const { error } = await supabase.auth.signInWithPassword({
        email: loginForm.email,
        password: loginForm.password,
      });

      if (error) throw error;
      setActiveModal(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Login failed";
      setLoginErrorMessage(message);
    } finally {
      setLoginLoading(false);
    }
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

      const { error } = await supabase.auth.signUp({
        email: signupForm.email,
        password: signupForm.password,
      });

      if (error) throw error;
      setActiveModal(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Signup failed";
      setSignupErrorMessage(message);
    } finally {
      setSignupLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-40 w-full px-4 py-4 bg-white/80 dark:bg-[var(--background)] backdrop-blur border-b border-[var(--border)]">
        <div className="flex items-center justify-between">
          <div className="text-xl font-semibold">PiratePolls</div>
          <div className="flex items-center gap-3">
            <button
              className="btn btn-outline"
              type="button"
              onClick={() => {
                setLoginErrors({});
                setLoginErrorMessage(null);
                setActiveModal("login");
              }}
            >
              Login
            </button>
            <button
              className="btn btn-outline"
              type="button"
              onClick={() => {
                setSignupErrors({});
                setSignupErrorMessage(null);
                setActiveModal("signup");
              }}
            >
              Signup
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center px-4 pb-16">
        <p className="text-sm text-gray-500">
          Choose Login or Signup to continue.
        </p>
      </div>

      {activeModal && (
        <div
          className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setActiveModal(null);
          }}
        >
          <div
            className="w-full max-w-md bg-white dark:bg-[var(--background)] outline-1 dark:outline-1 rounded-2xl shadow-lg p-6 space-y-6"
            onMouseDown={(e) => e.stopPropagation()}
          >
            {activeModal === "login" ? (
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
                      className={`input pr-10 ${loginErrors.password ? "input-error" : ""}`}
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
              </>
            ) : (
              <>
                <div className="text-center">
                  <h2 className="text-2xl font-semibold">Create Account</h2>
                  <p className="text-sm text-gray-500">
                    Sign up to get started
                  </p>
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
                  {signupErrors.email && (
                    <p className="error-text">{signupErrors.email}</p>
                  )}
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

                  {signupErrors.password && (
                    <p className="error-text">{signupErrors.password}</p>
                  )}
                </div>

                {signupErrorMessage && (
                  <p className="error-text">{signupErrorMessage}</p>
                )}

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
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default page;
*/
