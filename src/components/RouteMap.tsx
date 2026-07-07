import Image from "next/image";

export function RouteMap() {
  return (
    <section className="py-12">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 sm:gap-12">
            <div className="h-px min-w-[20px] flex-1 bg-gray-300"></div>
            <h2 className="text-xl font-bold tracking-tight text-[#1C1629] sm:text-4xl text-center">
              Route Map Study Group
            </h2>
            <div className="h-px min-w-[20px] flex-1 bg-gray-300"></div>
          </div>
          <p className="mt-4 text-center text-lg text-muted-foreground">
            From Open Recruitment to Awarding: The complete timeline of your study group experience.
          </p>
        </div>

        {/* Route Map Image Box */}
        <div className="relative mx-auto w-full overflow-hidden rounded-2xl border border-black/5 bg-white p-2 shadow-sm transition-all duration-300 hover:shadow-md">
            <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-gray-50">
                <Image
                    src="/images/route-map.png"
                    alt="Study Group Route Map"
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 80vw"
                />
            </div>
        </div>
      </div>
    </section>
  );
}
