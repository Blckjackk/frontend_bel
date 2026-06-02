import { Metadata } from "next";
import Navbar from "@/src/components/Navbar";
import Header from "@/src/components/Header";
import { cities } from "@/src/features/cities/data/cities.mock";
import { notFound } from "next/navigation";
import CityOfficesClient from "./CityOfficesClient";

export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  return cities.map((city) => ({
    slug: city.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const cityName = slug.charAt(0).toUpperCase() + slug.slice(1);
  return {
    title: `Office Spaces in ${cityName} | OfficeHub`,
    description: `Browse available office spaces in ${cityName}. Find the perfect workspace for your business.`,
  };
}

export default async function CityDetailPage({ params }: Props){
  const { slug } = await params;
  const city = cities.find((c) => c.slug.toLowerCase() === decodeURIComponent(slug).toLowerCase());
  if (!city) return notFound();

    return(
        <>
  <Navbar/>
  <Header city={city}/>
  <section
    id="Fresh-Space"
    className="flex flex-col gap-[30px] w-full max-w-[1130px] mx-auto mt-[70px] mb-[120px]"
  >
    <h2 className="font-bold text-[32px] leading-[48px] text-nowrap">
      Browse Offices
    </h2>

        <CityOfficesClient cityName={city.name} />
  </section>
</>
    );
}