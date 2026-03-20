"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useUser as useClerkUser } from "@clerk/nextjs";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const { user: clerkUser, isLoaded: clerkLoaded } = useClerkUser();
  const [appUser, setAppUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!clerkLoaded) return;
    if (!clerkUser) {
      setAppUser(null);
      setLoading(false);
      return;
    }
    fetch("/api/users/me", { credentials: "include" })
      .then((r) => (r.ok ? r.json() : null))
      .then(setAppUser)
      .catch(() => setAppUser(null))
      .finally(() => setLoading(false));
  }, [clerkUser, clerkLoaded]);

  return (
    <AuthContext.Provider
      value={{
        user: appUser,
        clerkUser,
        loading: !clerkLoaded || loading,
        isLoggedIn: !!appUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
