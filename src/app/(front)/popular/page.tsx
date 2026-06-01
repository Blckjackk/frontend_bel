import NavbarWrapper from "@/src/components/NavbarWrapper";
import PopularClient from "./PopularClient";

export const metadata = {
  title: "Popular Office Spaces | OfficeHub",
  description: "Discover the most popular office spaces in Indonesia",
};

export default async function PopularPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F7F7FD]">
      <NavbarWrapper />
      <section className="w-full max-w-[1130px] mx-auto mt-[10px] mb-[80px] px-4">
        <PopularClient />
      </section>
    </div>
  );
}