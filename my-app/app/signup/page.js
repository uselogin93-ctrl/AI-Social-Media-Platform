"use client";

import { SignUp } from "@clerk/nextjs";

export default function SignupPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-headline text-3xl font-extrabold text-on-surface">Digital Editorial</h1>
          <p className="text-on-surface-variant text-sm mt-1">Join our community</p>
        </div>
        <SignUp
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
          afterSignUpUrl="/feed"
          signInUrl="/login"
        />
        <p className="text-center mt-6 text-on-surface-variant text-sm">
          Already have an account?{" "}
          <a href="/login" className="text-primary font-bold hover:underline">
            Sign in
          </a>
        </p>
      </div>
    </main>
  );
}
