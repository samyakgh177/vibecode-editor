export const metadata = {
  title: "Next.js in WebContainer",
  description: "Next.js running inside browser WebContainer",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: "#0b0f19", color: "#f8fafc", fontFamily: "sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
