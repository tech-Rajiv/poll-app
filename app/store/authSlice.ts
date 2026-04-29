"use client";

import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type AuthUser = {
  id: string;
  email: string | null;
  createdAt: string | null;
  lastSignInAt: string | null;
  appMetadata: Record<string, unknown> | null;
  userMetadata: Record<string, unknown> | null;
};

export type AuthState = {
  isLoggedIn: boolean;
  user: AuthUser | null;
};

const initialState: AuthState = {
  isLoggedIn: false,
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthUser(state, action: PayloadAction<AuthUser>) {
      state.isLoggedIn = true;
      state.user = action.payload;
    },
    clearAuth(state) {
      state.isLoggedIn = false;
      state.user = null;
    },
  },
});

export const { setAuthUser, clearAuth } = authSlice.actions;
export const authReducer = authSlice.reducer;

