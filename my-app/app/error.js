"use client";

import { useEffect } from "react";

export default function Error({ error, reset }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Runtime Error Caught:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-red-500/20 flex items-center justify-center mb-6">
        <span className="material-symbols-outlined text-red-500 text-3xl">error</span>
      </div>
      <h2 className="text-2xl font-bold text-white mb-2">Something went wrong!</h2>
      <p className="text-neutral-400 mb-8 max-w-md">
        An error occurred during rendering. This might be due to missing environment variables or a connection issue.
      </p>
      <div className="flex gap-4">
        <button
          onClick={() => reset()}
          className="bg-white text-black px-6 py-2 rounded-lg font-bold text-sm hover:bg-neutral-200"
        >
          Try again
        </button>
        <button
          onClick={() => (window.location.href = "/")}
          className="bg-neutral-800 text-white px-6 py-2 rounded-lg font-bold text-sm hover:bg-neutral-700"
        >
          Go to Home
        </button>
      </div>
      {process.env.NODE_ENV === "development" && (
        <pre className="mt-8 p-4 bg-black/50 rounded-lg text-left text-xs text-red-400 overflow-auto max-w-full">
          {error.message}
          {"\n\n"}
          {error.stack}
        </pre>
      )}
    </div>
  );
}
