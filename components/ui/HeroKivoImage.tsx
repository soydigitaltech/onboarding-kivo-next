"use client";

import Image from "next/image";

export default function HeroKivoImage() {
  return (
    <div className="pointer-events-none absolute -bottom-[18px] top-[18px] right-0 z-0 hidden w-[420px] md:block lg:w-[480px]">
      <span
        aria-hidden="true"
        className="absolute -bottom-[155px] -right-[85px] z-0 h-[560px] w-[620px] rounded-full bg-[#5FDAF8]"
      />

      <Image
        src="/estado-kivo.png"
        alt=""
        fill
        sizes="(max-width: 1024px) 420px, 480px"
        className="relative z-10 object-contain object-right-bottom"
        priority
        unoptimized
      />
    </div>
  );
}
