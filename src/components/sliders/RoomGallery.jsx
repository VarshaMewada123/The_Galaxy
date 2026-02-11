import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function RoomGallery({ images }) {
  return (
    <Swiper
      modules={[Navigation, Pagination]}
      navigation
      pagination={{ clickable: true }}
      className="h-[70vh]"
    >
      {images.map((img, i) => (
        <SwiperSlide key={i}>
          <img src={img} alt="Room" className="w-full h-full object-cover" />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
