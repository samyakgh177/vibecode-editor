export default function HomePage() {
  return (
    <main style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      padding: "2rem"
    }}>
      <div style={{
        background: "#1e293b",
        border: "1px solid #334155",
        borderRadius: "14px",
        padding: "2.5rem",
        textAlign: "center",
        maxWidth: "440px"
      }}>
        <h1 style={{ margin: "0 0 1rem 0" }}>▲ Next.js App Router</h1>
        <p style={{ color: "#94a3b8" }}>
          Next.js running entirely inside WebContainers in your browser!
        </p>
      </div>
    </main>
  );
}
