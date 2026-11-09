"use client";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", textAlign: "center", padding: 24 }}>
      <div>
        <h1 style={{ fontSize: "clamp(36px,7vw,60px)" }}>Something went wrong</h1>
        <p style={{ color: "var(--mute)", margin: "12px 0 28px" }}>Please try again in a moment.</p>
        <button className="pill" onClick={reset}>Try again</button>
      </div>
    </main>
  );
}
