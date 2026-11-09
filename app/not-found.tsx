import Link from "next/link";

export default function NotFound() {
  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", textAlign: "center", padding: 24 }}>
      <div>
        <h1 style={{ fontSize: "clamp(40px,8vw,72px)" }}>Page not found</h1>
        <p style={{ color: "var(--mute)", margin: "12px 0 28px" }}>The page you are looking for doesn&apos;t exist.</p>
        <Link className="pill" href="/">Back to TriStar 1947</Link>
      </div>
    </main>
  );
}
