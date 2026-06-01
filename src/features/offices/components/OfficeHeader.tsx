"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

export default function OfficeHeader({
  image,
  images,
}: {
  image: string;
  images?: string[];
}) {
  const imageList = images?.filter(img => img) || [];

  return (
    <section id="Gallery" className="w-full max-w-[1130px] mx-auto px-4 sm:px-6 xl:px-0 pt-8 pb-4">
      <div className="w-full rounded-2xl border border-hairline bg-white p-2.5 shadow-sm overflow-hidden h-[450px]">
        <Swiper
          modules={[Navigation, Pagination]}
          slidesPerView={1.2}
          spaceBetween={16}
          centeredSlides={true}
          loop={true}
          navigation
          pagination={{ clickable: true }}
          className="w-full h-full rounded-xl overflow-hidden"
        >
          <SwiperSlide className="w-full h-full overflow-hidden rounded-xl">
            <Image
              src={image}
              width={1000}
              height={450}
              className="w-full h-full object-cover"
              alt="cover-thumbnail-primary"
              priority
            />
          </SwiperSlide>

          {imageList.map((img, index) => (
            <SwiperSlide key={index} className="w-full h-full overflow-hidden rounded-xl">
              <Image
                src={img}
                width={1000}
                height={450}
                className="w-full h-full object-cover"
                alt={`cover-thumbnail-${index}`}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}