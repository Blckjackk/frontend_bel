'use client';

import NavbarWrapper from "@/src/components/NavbarWrapper";
import Link from "next/link";
import Image from "next/image";
import OfficeHeader from "@/src/features/offices/components/OfficeHeader";
import OfficeFeatures from "@/src/features/offices/components/OfficeFeatures";
import SalesContactCard from "@/src/features/offices/components/SalesContactCard";
import SaveForLaterButton from "@/src/features/offices/components/SaveForLaterButton";
import { StartChatButton } from "@/src/features/chat/components/StartChatButton";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/src/features/auth/context/AuthContext";
import { mapOfficeDtoToOfficeSpace } from "@/src/features/offices/types/officeSpace.types";

export default function OfficeSpaceDetailPage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const slug = params?.slug ?? '';
  const [office, setOffice] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
    fetch(`${apiUrl}/offices/${slug}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && !data.error) {
          setOffice(mapOfficeDtoToOfficeSpace(data));
        } else {
          router.push('/');
        }
      })
      .catch((err) => {
        console.error(err);
        router.push('/');
      })
      .finally(() => setLoading(false));
  }, [slug, router]);

  const isAdminOrProvider = user?.role === 'admin' || user?.role === 'provider';

  if (!slug) return null;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-canvas">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xs text-muted font-bold uppercase tracking-wider">Sedang Memuat...</p>
        </div>
      </div>
    );
  }

  if (!office) return null;

  return (
    <>
      <NavbarWrapper />
      <OfficeHeader image={office.image} images={office.images}/>
      <section id="Details" className="max-w-[1130px] mx-auto px-4 sm:px-6 xl:px-0 grid grid-cols-1 lg:grid-cols-12 gap-8 mb-20 relative z-10">

        {/* Left Specification Column */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="flex flex-col rounded-xl border border-hairline p-6 sm:p-8 gap-6 bg-white shadow-sm">
            
            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {office.tags.map((tag: string) => (
                <span key={tag} className="rounded-md px-3 py-1 bg-primary font-bold text-[10px] uppercase tracking-wider text-white">
                  {tag}
                </span>
              ))}
            </div>

            {/* Title & Location */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex flex-col gap-2">
                <h1 className="font-semibold text-2xl sm:text-3xl text-ink tracking-tight leading-tight">{office.title}</h1>
                <div className="flex items-center gap-1.5 text-xs sm:text-sm text-muted font-medium">
                  <Image src="/assets/images/icons/location.svg" className="w-4 h-4 opacity-75" alt="icon" width={16} height={16} />
                  <p>{office.location}</p>
                </div>
              </div>
              
              {/* Ratings */}
              <div className="flex items-center gap-2 bg-canvas border border-hairline px-4 py-2 rounded-lg w-fit">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Image
                      key={i}
                      src={i < Math.floor(office.rating) ? "/assets/images/icons/Star 1.svg" : "/assets/images/icons/Star 5.svg"}
                      className="w-4 h-4 animate-pulse-slow"
                      alt="star"
                      width={16}
                      height={16}
                    />
                  ))}
                </div>
                <div className="flex flex-col text-[10px] sm:text-xs leading-none">
                  <span className="font-bold text-ink">{office.rating}/5</span>
                  <span className="text-[9px] text-muted font-semibold mt-0.5">(19,384 Ulasan)</span>
                </div>
              </div>
            </div>

            <hr className="border-hairline" />

            {/* About */}
            <div className="flex flex-col gap-2">
              <h2 className="font-bold text-base text-ink tracking-tight">Tentang Ruang Kerja</h2>
              <p className="text-xs sm:text-sm text-muted leading-relaxed whitespace-pre-line">{office.about}</p>
            </div>

            <hr className="border-hairline" />
            
            {/* Features list */}
            <div className="flex flex-col gap-4">
              <h2 className="font-bold text-base text-ink tracking-tight">Fasilitas Utama</h2>
              <OfficeFeatures features={office.features} />
            </div>

            <hr className="border-hairline" />

            {/* Address & Map */}
            <div className="flex flex-col gap-3">
              <h2 className="font-bold text-base text-ink tracking-tight">Alamat Lengkap</h2>
              <p className="text-xs sm:text-sm text-muted">{office.address}</p>
              
              <div className="overflow-hidden w-full h-[280px] rounded-xl border border-hairline bg-canvas p-1">
                <div id="my-map-display" className="h-full w-full bg-none rounded-lg overflow-hidden">
                  <iframe
                    className="h-full w-full border-0"
                    src={`https://www.google.com/maps/embed/v1/place?q=${encodeURIComponent(office.title)}&key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8`}
                    loading="lazy"
                  />
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Right Sidebar Booking Ticket Column */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="flex flex-col gap-6 sticky top-24">
            
            {/* Booking Invoice Ticket */}
            <div className="flex flex-col rounded-xl border border-hairline p-6 gap-6 bg-white shadow-sm">
              {office.isFullyBooked ? (
                <div>
                  <p className="font-bold text-base text-ink leading-relaxed">
                    Maaf, kantor ini sedang <span className="text-danger">penuh (fully booked)</span> saat ini. Silakan cari alternatif lain.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-accent">Harga Rental</span>
                  <p className="font-bold text-2xl sm:text-3xl text-primary leading-none">
                    Rp {office.price.toLocaleString('id-ID')}
                  </p>
                  <p className="text-xs text-muted font-semibold mt-1">Durasi pemakaian: {office.duration}</p>
                </div>
              )}

              <hr className="border-hairline" />

              {/* Guarantees list */}
              <div className="flex flex-col gap-3.5 text-xs text-muted">
                {[
                  "Akses ruang meeting premium",
                  "Free-flow minuman kopi dan snack",
                  "Bimbingan komunitas bisnis"
                ].map((text, i) => (
                  <div key={i} className="flex items-start gap-2.5 leading-relaxed">
                    <Image src="/assets/images/icons/verify.svg" className="w-5 h-5 shrink-0" alt="verified icon" width={20} height={20} />
                    <p className="font-semibold">{text}</p>
                  </div>
                ))}
              </div>

              <hr className="border-hairline" />

              {/* CTAs */}
              <div className="flex flex-col gap-3">
                {isAdminOrProvider ? (
                  <div className="w-full rounded-lg py-3 text-center bg-canvas border border-hairline font-bold text-xs text-ink/75">
                    Admin / Provider tidak bisa booking & save for later
                  </div>
                ) : (
                  <>
                    {!office.isFullyBooked && (
                      <Link 
                        href={`/booking/${office.slug}`} 
                        className="flex items-center justify-center w-full rounded-lg py-3.5 gap-2 bg-primary hover:bg-primary-active font-bold text-white shadow-sm shadow-primary/10 hover:shadow-md transition-all text-sm cursor-pointer"
                      >
                        <Image src="/assets/images/icons/slider-horizontal-white.svg" className="w-5 h-5" alt="icon" width={20} height={20} />
                        <span>Book This Office</span>
                      </Link>
                    )}
                    <SaveForLaterButton
                      officeId={office.id}
                      officeTitle={office.title}
                      officeSlug={office.slug}
                      officeImage={office.image}
                      officePrice={office.price}
                      officeLocation={office.location}
                    />
                    {office.providerId && (
                      <StartChatButton
                        officeId={office.id}
                        officeTitle={office.title}
                        officeProviderId={office.providerId}
                        phoneNumber={office.salesContacts?.[0]?.phone}
                        contactName={office.salesContacts?.[0]?.name}
                      />
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Sales Representative Card */}
            <div className="flex flex-col rounded-xl border border-hairline p-6 gap-4 bg-white shadow-sm">
              <h3 className="font-bold text-ink text-sm uppercase tracking-wider">Contact Our Sales</h3>
              <div className="flex flex-col gap-4">
                {office.salesContacts && office.salesContacts.length > 0 ? (
                  office.salesContacts.map((contact: any, index: number) => (
                    <SalesContactCard
                      key={index}
                      contact={contact}
                      officeId={office.id}
                      officeTitle={office.title}
                      officeProviderId={office.providerId}
                    />
                  ))
                ) : (
                  <p className="text-xs text-muted/70">Belum ada sales contact yang ditugaskan</p>
                )}
              </div>
            </div>

          </div>
        </div>

      </section>
    </>
  );
}