
export const metadata = {
  title: "PressReady",
  description: "AI-powered media preparation for PR consultants"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body className="bg-slate-100 text-slate-900">{children}</body>
    </html>
  );
}
