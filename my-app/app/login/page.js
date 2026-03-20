"use client";

import { SignIn } from "@clerk/nextjs";

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-headline text-3xl font-extrabold text-on-surface">Digital Editorial</h1>
          <p className="text-on-surface-variant text-sm mt-1">Sign in to continue</p>
        </div>
        <SignIn
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "bg-surface-container-low shadow-xl rounded-xl border border-outline-variant/10",
            },
            variables: {
              colorPrimary: "#0095F6",
              colorBackground: "#1c1b1b",
              colorInputBackground: "#353534",
              colorInputText: "#e5e2e1",
              colorText: "#e5e2e1",
              colorTextSecondary: "#bfc7d4",
            },
          }}
          afterSignInUrl="/feed"
          signUpUrl="/signup"
        />
        <p className="text-center mt-6 text-on-surface-variant text-sm">
          New to the platform?{" "}
          <a href="/signup" className="text-primary font-bold hover:underline">
            Create an account
          </a>
        </p>
      </div>
    </main>
  );
}
