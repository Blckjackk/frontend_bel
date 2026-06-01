import { Metadata } from "next";
import Link from "next/link";
import { officeSpaces } from "@/src/features/offices/data/officeSpaces.mock";

export const metadata: Metadata = {
  title: "Testimonials | OfficeHub",
  description: "See what our customers say about their experience with OfficeHub.",
};

export default function Home() {
  return (
<>
  <nav className="bg-white">
    <div className="flex items-center justify-between w-full max-w-[1130px] py-[22px] mx-auto">
      <Link href="/">
        <img src="/assets/images/logos/logo.svg" alt="logo" />
      </Link>
      <ul className="flex items-center gap-[50px] w-fit">
        <li>
          <Link href="">Browse</Link>
        </li>
        <li>
          <Link href="">Popular</Link>
        </li>
        <li>
          <Link href="">Categories</Link>
        </li>
        <li>
          <Link href="">Events</Link>
        </li>
        <li>
          <Link href="/booking">My Booking</Link>
        </li>
      </ul>
      <Link
        href="#"
        className="flex items-center gap-[10px] rounded-full border border-[#000929] py-3 px-5"
      >
        <img
          src="/assets/images/icons/call.svg"
          className="w-6 h-6"
          alt="icon"
        />
        <span className="font-semibold">Contact Us</span>
      </Link>
    </div>
  </nav>
  <header className="flex flex-col w-full">
    <section id="Hero-Banner" className="relative flex h-[720px] -mb-[93px]">
      <div
        id="Hero-Text"
        className="relative flex flex-col w-full max-w-[650px] h-fit rounded-[30px] border border-[#E0DEF7] p-10 gap-[30px] bg-white mt-[70px] ml-[calc((100%-1130px)/2)] z-10"
      >
        <div className="flex items-center w-fit rounded-full py-2 px-4 gap-[10px] bg-[#000929]">
          <img
            src="/assets/images/icons/crown-white.svg"
            className="w-5 h-5"
            alt="icon"
          />
          <span className="font-semibold text-white">
            We’ve won top productivity 500 fortunes
          </span>
        </div>
        <h1 className="font-extrabold text-[50px] leading-[60px]">
          All Great Offices.
          <br />
          Grow Your Business.
        </h1>
        <p className="text-lg leading-8 text-[#000929]">
          Kantor yang tepat dapat memberikan impact pekerjaan menjadi lebih baik
          dan sehat dalam tumbuhkan karir.
        </p>
        <div className="flex items-center gap-5">
          <Link
            href="#"
            className="flex items-center rounded-full p-[20px_26px] gap-3 bg-[#0D903A]"
          >
            <img
              src="/assets/images/icons/slider-horizontal-white.svg"
              className="w-[30px] h-[30px]"
              alt="icon"
            />
            <span className="font-bold text-xl leading-[30px] text-[#F7F7FD]">
              Explore Now
            </span>
          </Link>
          <Link
            href="#"
            className="flex items-center rounded-full border border-[#000929] p-[20px_26px] gap-3 bg-white"
          >
            <img
              src="/assets/images/icons/video-octagon.svg"
              className="w-[30px] h-[30px]"
              alt="icon"
            />
            <span className="font-semibold text-xl leading-[30px]">
              Watch Story
            </span>
          </Link>
        </div>
      </div>
      <div
        id="Hero-Image"
        className="absolute right-0 w-[calc(100%-((100%-1130px)/2)-305px)] h-[720px] rounded-bl-[40px] overflow-hidden"
      >
        <img
          src="/assets/images/backgrounds/banner.webp"
          className="w-full h-full object-cover"
          alt="hero background"
        />
      </div>
    </section>
    <div className="flex flex-col pt-[150px] pb-10 px-[120px] gap-10 bg-[#0D903A]">
      <div className="logo-contianer flex items-center justify-center flex-wrap max-w-[1130px] h-[38px] mx-auto gap-[60px]">
        <img src="/assets/images/logos/TESLA.svg" alt="clients logo" />
        <img src="/assets/images/logos/Libra 2.svg" alt="clients logo" />
        <img src="/assets/images/logos/Binance logo.svg" alt="clients logo" />
        <img src="/assets/images/logos/Facebook 7.svg" alt="clients logo" />
        <img src="/assets/images/logos/Microsoft 6.svg" alt="clients logo" />
      </div>
      <div className="flex justify-center gap-[50px]">
        <div className="flex flex-col gap-[2px] text-center">
          <p className="text-xl leading-[30px] text-[#F7F7FD]">
            Comfortable Space
          </p>
          <p className="font-bold text-[38px] leading-[57px] text-white">
            580M+
          </p>
        </div>
        <div className="flex flex-col gap-[2px] text-center">
          <p className="text-xl leading-[30px] text-[#F7F7FD]">
            Startups Succeed
          </p>
          <p className="font-bold text-[38px] leading-[57px] text-white">98%</p>
        </div>
        <div className="flex flex-col gap-[2px] text-center">
          <p className="text-xl leading-[30px] text-[#F7F7FD]">Countries</p>
          <p className="font-bold text-[38px] leading-[57px] text-white">90+</p>
        </div>
        <div className="flex flex-col gap-[2px] text-center">
          <p className="text-xl leading-[30px] text-[#F7F7FD]">
            Supportive Events
          </p>
          <p className="font-bold text-[38px] leading-[57px] text-white">
            139M+
          </p>
        </div>
      </div>
    </div>
  </header>
  <section id="Cities" className="flex flex-col gap-[30px] mt-[100px]">
    <div className="w-full max-w-[1130px] mx-auto flex items-center justify-between">
      <h2 className="font-bold text-[32px] leading-[48px] text-nowrap">
        You Can Choose <br />
        Our Favorite Cities
      </h2>
      <Link
        href="#"
        className="rounded-full rounded-full py-3 px-5 bg-white font-bold"
      >
        Explore All City
      </Link>
    </div>
    <div className="swiper w-full">
      <div className="swiper-wrapper">
        <div className="swiper-slide !w-fit first-of-type:pl-[calc((100%-1130px-60px)/2)] last-of-type:pr-[calc((100%-1130px-60px)/2)]">
          <Link href="/city/jakarta-pusat" className="card">
            <div className="relative flex shrink-0 w-[230px] h-[300px] rounded-[20px] overflow-hidden">
              <div className="relative flex flex-col justify-end w-full h-full p-5 gap-[2px] bg-[linear-gradient(180deg,_rgba(0,0,0,0)_49.87%,_rgba(0,0,0,0.8)_100%)] z-10">
                <h3 className="font-bold text-xl leading-[30px] text-white">
                  Jakarta Pusat
                </h3>
                <p className="text-white">189 Offices</p>
              </div>
              <img
                src="/assets/images/thumbnails/thumbnails-2.png"
                className="absolute w-full h-full object-cover"
                alt="thumbnails"
              />
            </div>
          </Link>
        </div>
        <div className="swiper-slide !w-fit first-of-type:pl-[calc((100%-1130px-60px)/2)] last-of-type:pr-[calc((100%-1130px-60px)/2)]">
          <Link href="/city/jakarta-pusat" className="card">
            <div className="relative flex shrink-0 w-[230px] h-[300px] rounded-[20px] overflow-hidden">
              <div className="relative flex flex-col justify-end w-full h-full p-5 gap-[2px] bg-[linear-gradient(180deg,_rgba(0,0,0,0)_49.87%,_rgba(0,0,0,0.8)_100%)] z-10">
                <h3 className="font-bold text-xl leading-[30px] text-white">
                  Jakarta Pusat
                </h3>
                <p className="text-white">189 Offices</p>
              </div>
              <img
                src="/assets/images/thumbnails/thumbnails-1.png"
                className="absolute w-full h-full object-cover"
                alt="thumbnails"
              />
            </div>
          </Link>
        </div>
        <div className="swiper-slide !w-fit first-of-type:pl-[calc((100%-1130px-60px)/2)] last-of-type:pr-[calc((100%-1130px-60px)/2)]">
          <Link href="/city/bandung-utara" className="card">
            <div className="relative flex shrink-0 w-[230px] h-[300px] rounded-[20px] overflow-hidden">
              <div className="relative flex flex-col justify-end w-full h-full p-5 gap-[2px] bg-[linear-gradient(180deg,_rgba(0,0,0,0)_49.87%,_rgba(0,0,0,0.8)_100%)] z-10">
                <h3 className="font-bold text-xl leading-[30px] text-white">
                  Bandung Utara
                </h3>
                <p className="text-white">189 Offices</p>
              </div>
              <img
                src="/assets/images/thumbnails/thumbnails-3.png"
                className="absolute w-full h-full object-cover"
                alt="thumbnails"
              />
            </div>
          </Link>
        </div>
        <div className="swiper-slide !w-fit first-of-type:pl-[calc((100%-1130px-60px)/2)] last-of-type:pr-[calc((100%-1130px-60px)/2)]">
          <Link href="/city/jakarta-pusat" className="card">
            <div className="relative flex shrink-0 w-[230px] h-[300px] rounded-[20px] overflow-hidden">
              <div className="relative flex flex-col justify-end w-full h-full p-5 gap-[2px] bg-[linear-gradient(180deg,_rgba(0,0,0,0)_49.87%,_rgba(0,0,0,0.8)_100%)] z-10">
                <h3 className="font-bold text-xl leading-[30px] text-white">
                  Jakarta Pusat
                </h3>
                <p className="text-white">189 Offices</p>
              </div>
              <img
                src="/assets/images/thumbnails/thumbnails-4.png"
                className="absolute w-full h-full object-cover"
                alt="thumbnails"
              />
            </div>
          </Link>
        </div>
        <div className="swiper-slide !w-fit first-of-type:pl-[calc((100%-1130px-60px)/2)] last-of-type:pr-[calc((100%-1130px-60px)/2)]">
          <Link href="/city/bandung-utara" className="card">
            <div className="relative flex shrink-0 w-[230px] h-[300px] rounded-[20px] overflow-hidden">
              <div className="relative flex flex-col justify-end w-full h-full p-5 gap-[2px] bg-[linear-gradient(180deg,_rgba(0,0,0,0)_49.87%,_rgba(0,0,0,0.8)_100%)] z-10">
                <h3 className="font-bold text-xl leading-[30px] text-white">
                  Bandung Utara
                </h3>
                <p className="text-white">189 Offices</p>
              </div>
              <img
                src="/assets/images/thumbnails/thumbnails-5.png"
                className="absolute w-full h-full object-cover"
                alt="thumbnails"
              />
            </div>
          </Link>
        </div>
        <div className="swiper-slide !w-fit first-of-type:pl-[calc((100%-1130px-60px)/2)] last-of-type:pr-[calc((100%-1130px-60px)/2)]">
          <Link href="/city/jakarta-pusat" className="card">
            <div className="relative flex shrink-0 w-[230px] h-[300px] rounded-[20px] overflow-hidden">
              <div className="relative flex flex-col justify-end w-full h-full p-5 gap-[2px] bg-[linear-gradient(180deg,_rgba(0,0,0,0)_49.87%,_rgba(0,0,0,0.8)_100%)] z-10">
                <h3 className="font-bold text-xl leading-[30px] text-white">
                  Jakarta Pusat
                </h3>
                <p className="text-white">189 Offices</p>
              </div>
              <img
                src="/assets/images/thumbnails/thumbnails-6.png"
                className="absolute w-full h-full object-cover"
                alt="thumbnails"
              />
            </div>
          </Link>
        </div>
        <div className="swiper-slide !w-fit first-of-type:pl-[calc((100%-1130px-60px)/2)] last-of-type:pr-[calc((100%-1130px-60px)/2)]">
          <Link href="/city/bandung-utara" className="card">
            <div className="relative flex shrink-0 w-[230px] h-[300px] rounded-[20px] overflow-hidden">
              <div className="relative flex flex-col justify-end w-full h-full p-5 gap-[2px] bg-[linear-gradient(180deg,_rgba(0,0,0,0)_49.87%,_rgba(0,0,0,0.8)_100%)] z-10">
                <h3 className="font-bold text-xl leading-[30px] text-white">
                  Bandung Utara
                </h3>
                <p className="text-white">189 Offices</p>
              </div>
              <img
                src="/assets/images/thumbnails/thumbnails-7.png"
                className="absolute w-full h-full object-cover"
                alt="thumbnails"
              />
            </div>
          </Link>
        </div>
      </div>
    </div>
  </section>
  <section
    id="Benefits"
    className="flex items-center justify-center w-[1015px] mx-auto gap-[100px] mt-[100px]"
  >
    <h2 className="font-bold text-[32px] leading-[48px] text-nowrap">
      We Might Good <br />
      For Your Business
    </h2>
    <div className="grid grid-cols-2 gap-[30px]">
      <div className="flex items-center gap-4">
        <div className="flex items-center justify-center shrink-0 w-[70px] h-[70px] rounded-[23px] bg-white overflow-hidden">
          <img
            src="/assets/images/icons/security-user.svg"
            className="w-[34px] h-[34px]"
            alt="icon"
          />
        </div>
        <div className="flex flex-col gap-[5px]">
          <p className="font-bold text-lg leading-[27px]">
            Privacy-First Design
          </p>
          <p className="text-sm leading-[24px]">
            Lorem available without even higher tax that cost much
          </p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center justify-center shrink-0 w-[70px] h-[70px] rounded-[23px] bg-white overflow-hidden">
          <img
            src="/assets/images/icons/group.svg"
            className="w-[34px] h-[34px]"
            alt="icon"
          />
        </div>
        <div className="flex flex-col gap-[5px]">
          <p className="font-bold text-lg leading-[27px]">Easy Move Access</p>
          <p className="text-sm leading-[24px]">
            Lorem available without even higher tax that cost much
          </p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center justify-center shrink-0 w-[70px] h-[70px] rounded-[23px] bg-white overflow-hidden">
          <img
            src="/assets/images/icons/3dcube.svg"
            className="w-[34px] h-[34px]"
            alt="icon"
          />
        </div>
        <div className="flex flex-col gap-[5px]">
          <p className="font-bold text-lg leading-[27px]">Flexibility Spaces</p>
          <p className="text-sm leading-[24px]">
            Lorem available without even higher tax that cost much
          </p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center justify-center shrink-0 w-[70px] h-[70px] rounded-[23px] bg-white overflow-hidden">
          <img
            src="/assets/images/icons/cup.svg"
            className="w-[34px] h-[34px]"
            alt="icon"
          />
        </div>
        <div className="flex flex-col gap-[5px]">
          <p className="font-bold text-lg leading-[27px]">Top-Rated Office</p>
          <p className="text-sm leading-[24px]">
            Lorem available without even higher tax that cost much
          </p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center justify-center shrink-0 w-[70px] h-[70px] rounded-[23px] bg-white overflow-hidden">
          <img
            src="/assets/images/icons/coffee.svg"
            className="w-[34px] h-[34px]"
            alt="icon"
          />
        </div>
        <div className="flex flex-col gap-[5px]">
          <p className="font-bold text-lg leading-[27px]">
            Extra Snacks Available
          </p>
          <p className="text-sm leading-[24px]">
            Lorem available without even higher tax that cost much
          </p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center justify-center shrink-0 w-[70px] h-[70px] rounded-[23px] bg-white overflow-hidden">
          <img
            src="/assets/images/icons/home-trend-up.svg"
            className="w-[34px] h-[34px]"
            alt="icon"
          />
        </div>
        <div className="flex flex-col gap-[5px]">
          <p className="font-bold text-lg leading-[27px]">
            Sustain for Business
          </p>
          <p className="text-sm leading-[24px]">
            Lorem available without even higher tax that cost much
          </p>
        </div>
      </div>
    </div>
  </section>
  <section
    id="Fresh-Space"
    className="flex flex-col gap-[30px] w-full max-w-[1130px] mx-auto mt-[100px] mb-[120px]"
  >
    <h2 className="font-bold text-[32px] leading-[48px] text-nowrap text-center">
      Browse Our Fresh Space.
      <br />
      For Your Better Productivity.
    </h2>
    <div className="grid grid-cols-3 gap-[30px]">
      {officeSpaces.map((office) => (
        <Link href={`/office/${office.slug}`} className="card" key={office.id}>
          <div className="flex flex-col rounded-[20px] border border-[#E0DEF7] bg-white overflow-hidden">
            <div className="thumbnail-container relative w-full h-[200px]">
              {office.tags.includes('Popular') && (
                <p className="absolute top-5 left-5 w-fit rounded-full p-[6px_16px] bg-[#0D903A] font-bold text-sm leading-[21px] text-[#F7F7FD]">
                  Popular
                </p>
              )}
              <img
                src={office.image}
                className="w-full h-full object-cover"
                alt={office.title}
              />
            </div>
            <div className="card-detail-container flex flex-col p-5 pb-[30px] gap-4">
              <h3 className="line-clamp-2 font-bold text-[22px] leading-[36px] h-[72px]">
                {office.title}
              </h3>
              <div className="flex items-center justify-between">
                <p className="font-semibold text-xl leading-[30px]">
                  Rp {office.price.toLocaleString('id-ID')}
                </p>
                <div className="flex items-center justify-end gap-[6px]">
                  <p className="font-semibold">{office.duration}</p>
                  <img
                    src="/assets/images/icons/clock.svg"
                    className="w-6 h-6"
                    alt="icon"
                  />
                </div>
              </div>
              <hr className="border-[#F6F5FD]" />
              <div className="flex items-center justify-between">
                <div className="flex items-center justify-end gap-[6px]">
                  <img
                    src="/assets/images/icons/location.svg"
                    className="w-6 h-6"
                    alt="icon"
                  />
                  <p className="font-semibold">{office.location}</p>
                </div>
                <div className="flex items-center justify-end gap-[6px]">
                  <p className="font-semibold">{office.rating}/5</p>
                  <img
                    src="/assets/images/icons/Star 1.svg"
                    className="w-6 h-6"
                    alt="icon"
                  />
                </div>
              </div>
              <hr className="border-[#F6F5FD]" />
              <div className="flex items-center justify-between">
                <div className="flex items-center justify-end gap-[6px]">
                  <img
                    src="/assets/images/icons/wifi.svg"
                    className="w-6 h-6"
                    alt="icon"
                  />
                  <p className="font-semibold">Fast-Connection</p>
                </div>
                <div className="flex items-center justify-end gap-[6px]">
                  <img
                    src="/assets/images/icons/security-user.svg"
                    className="w-6 h-6"
                    alt="icon"
                  />
                  <p className="font-semibold">Secure 100%</p>
                </div>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  </section>
</>

  );
}
