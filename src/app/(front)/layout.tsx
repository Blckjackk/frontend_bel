import Footer from "@/src/components/Footer";

export default function FrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-canvas">
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

