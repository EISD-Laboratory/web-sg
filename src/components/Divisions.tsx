import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const divisions = [
  {
    name: "Software Development",
    description: "Building end-to-end web applications, from frontend and backend logic to deployment.",
    image: "/images/softdev.webp",
    imageSize: 40,
    id: "software-development",
    color: "bg-blue-500/10 text-blue-600",
    href: "/software-development",
  },
  {
    name: "UI/UX Design",
    description: "Turning user problems into intuitive digital solutions through research, design, and testing.",
    image: "/images/uiux.webp",
    imageSize: 40,
    id: "ui-ux-design",
    color: "bg-blue-500/10 text-blue-600",
    href: "/ui-ux-design",
  },
  {
    name: "Technopreneur",
    description: "Validating ideas and turning them into viable digital products through strategy and execution.",
    image: "/images/techno.webp",
    imageSize: 42,
    id: "technopreneur",
    color: "bg-blue-500/10 text-blue-600",
    href: "/technopreneur",
  },
  {
    name: "Intelligence System",
    description: "Designing and building IoT-based solutions from sensor data to web and business integration.",
    image: "/images/is.webp",
    imageSize: 42,
    id: "intelligence-system",
    color: "bg-blue-500/10 text-blue-600",
    href: "/intelligence-system",
  },
];

export function Divisions() {
  return (
    <section className="py-12">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div className="mb-16">
          <div className="flex items-center gap-12">
            <div className="h-px flex-1 bg-gray-300"></div>
            <h2 className="shrink-0 text-3xl font-bold tracking-tight text-[#1C1629] sm:text-4xl">
              Our Divisions
            </h2>
            <div className="h-px flex-1 bg-gray-300"></div>
          </div>
          <p className="mt-4 text-center text-lg text-muted-foreground">
            Specialized tracks to master specific domains of technology.
          </p>
        </div>

        {/* Divisions Grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {divisions.map((div) => (
            <Link
              key={div.name}
              href={div.href || `#${div.id}`}
              className="group relative flex flex-col rounded-2xl border border-black/5 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              {/* Icon */}
              <div className={`mb-6 flex h-14 w-14 items-center justify-center rounded-xl ${div.color} transition-transform duration-300 group-hover:scale-110`}>
                <Image src={div.image} alt={div.name} width={div.imageSize} height={div.imageSize} />
              </div>

              {/* Content */}
              <h3 className="mb-3 text-xl font-bold text-foreground">
                {div.name}
              </h3>
              <p className="mb-6 flex-1 text-sm leading-relaxed text-muted-foreground">
                {div.description}
              </p>

              {/* "Learn More" visual cue */}
              <div className="mt-auto flex items-center text-sm font-semibold text-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                Learn more <ArrowRight className="ml-2 h-4 w-4" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
