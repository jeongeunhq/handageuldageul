"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useIsMobile } from "@/components/widgets/hooks/useIsMobile";

const slides = [
  {
    id: 1,
    title: "프린티",
    subtitle: "주식회사 프린티",
    author: "작가와 팬을 잇는 일러스트 출력 플랫폼",
    img: "/img1.svg",
  },
  {
    id: 2,
    title: "스파르타빌더스",
    subtitle: "팀스파르타",
    author: "물류 관계자 비교견적 솔루션",
    img: "/img2.svg",
  },
  {
    id: 3,
    title: "KOSTA-EDU",
    subtitle: "한국소프트웨어 기술진흥협회",
    author: "학습관리 시스템",
    img: "/img3.svg",
  },
  {
    id: 4,
    title: "달콤수학",
    subtitle: "달콤교육",
    author: "엄마표 온라인 수학교육 강의 플랫폼",
    img: "/img4.svg",
  },
];

const Banner = () => {
  const [index, setIndex] = useState(0);
  const isMobile = useIsMobile();
  const totalSlides = slides.length;
  const extendedSlides = [...slides, ...slides];
  const slideWidth = 319;
  const slideGap = 16;
  const fullSlide = slideWidth + slideGap;
  const centerOffset = isMobile ? 0 : fullSlide * 1.5;

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex(
        (prev) => (prev + 1) % (isMobile ? totalSlides : totalSlides + 1)
      );
    }, 2000);

    return () => clearInterval(interval);
  }, [isMobile, totalSlides]);

  useEffect(() => {
    if (!isMobile && index === totalSlides) {
      const timeout = setTimeout(() => {
        setIndex(0);
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [index, totalSlides, isMobile]);

  return (
    <div className="relative overflow-hidden mb-10 my-[100px] mx-[16px] md:mx-[30px]">
      <div
        className="flex transition-transform duration-500"
        style={{
          width: isMobile ? "100%" : `${extendedSlides.length * fullSlide}px`,
          transform: isMobile
            ? `translateX(-${index * 100}%)`
            : `translateX(-${index * fullSlide - centerOffset}px)`,
        }}
      >
        {(isMobile ? slides : extendedSlides).map((slide, i) => (
          <div
            key={i}
            className={isMobile ? "w-full shrink-0" : "w-[319px] mr-4 shrink-0"}
          >
            <div className="relative h-[391px] rounded-[20px] overflow-hidden shadow-md">
              <Image
                src={slide.img}
                alt={slide.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-20" />
              <div className="absolute inset-0 flex flex-col justify-between p-6 text-white space-y-2">
                <h3 className="text-2xl font-semibold">{slide.title}</h3>
                <div className="flex flex-col mt-auto border-t pt-4 border-Line_strong">
                  <p className="text-[16px] text-gray-300">{slide.subtitle}</p>
                  <p className="text-[16px]">{slide.author}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Banner;
