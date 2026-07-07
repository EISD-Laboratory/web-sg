import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Divisions } from "@/components/Divisions";
import { DreamyBackground } from "@/components/DreamyBackground";
import { RouteMap } from "@/components/RouteMap";
import { AnnouncementCheck } from "@/components/AnnouncementCheck";
import { Documentation } from "@/components/Documentation";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <main className="relative min-h-screen w-full overflow-hidden text-foreground">
      <DreamyBackground />
      <Navbar />
      <Hero />
      <Divisions />
      <AnnouncementCheck />
      <RouteMap />
      <Documentation />
      
      <Footer />
    </main>
  );
}
