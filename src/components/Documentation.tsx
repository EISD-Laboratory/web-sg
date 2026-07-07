import Image from "next/image";

const documentationImages = [
  "/images/dokum-sg/dokum (1).webp",
  "/images/dokum-sg/dokum (2).webp",
  "/images/dokum-sg/dokum (3).webp",
  "/images/dokum-sg/dokum (4).webp",
  "/images/dokum-sg/dokum (5).webp",
  "/images/dokum-sg/dokum (6).webp",
  "/images/dokum-sg/dokum (7).webp",
  "/images/dokum-sg/dokum (8).webp",
  "/images/dokum-sg/dokum (9).webp",
  "/images/dokum-sg/dokum (10).webp",
];

export function Documentation() {
  return (
    <section className="py-12 overflow-hidden">
      <div className="container mx-auto px-6 lg:px-12 mb-12">
         {/* Section Header */}
        <div>
          <div className="flex items-center gap-3 sm:gap-12">
            <div className="h-px min-w-[20px] flex-1 bg-gray-300"></div>
            <h2 className="text-xl font-bold tracking-tight text-[#1C1629] sm:text-4xl text-center">
              Our Documentation
            </h2>
            <div className="h-px min-w-[20px] flex-1 bg-gray-300"></div>
          </div>
          <p className="mt-4 text-center text-lg text-muted-foreground">
            Capture moments of excitement and collaboration in our study group activities.
          </p>
        </div>
      </div>

      {/* Marquee Container */}
      <div className="relative flex w-full overflow-hidden">
        {/* First Track */}
        <div className="flex animate-scroll min-w-full shrink-0 items-center justify-around gap-8 pb-4">
          {documentationImages.map((src, index) => (
             <div key={`track1-${index}`} className="relative aspect-video w-[300px] shrink-0 overflow-hidden rounded-xl border border-black/5 bg-white shadow-sm sm:w-[400px]">
                <Image
                  src={src}
                  alt={`Documentation ${index + 1}`}
                  fill
                  sizes="(max-width: 640px) 300px, 400px"
                  loading={index === 0 ? "eager" : "lazy"}
                  className="object-cover"
                />
             </div>
          ))}
        </div>
        
        {/* Second Track (Duplicate for seamless loop) */}
        <div className="flex animate-scroll min-w-full shrink-0 items-center justify-around gap-8 pb-4 ml-8"> {/* ml-8 matches gap-8 */}
          {documentationImages.map((src, index) => (
             <div key={`track2-${index}`} className="relative aspect-video w-[300px] shrink-0 overflow-hidden rounded-xl border border-black/5 bg-white shadow-sm sm:w-[400px]">
                <Image
                  src={src}
                  alt={`Documentation ${index + 1}`}
                  fill
                  sizes="(max-width: 640px) 300px, 400px"
                  className="object-cover"
                />
             </div>
          ))}
        </div>
      </div>
    </section>
  );
}
