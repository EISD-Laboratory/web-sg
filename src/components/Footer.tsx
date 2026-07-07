import { Mail, MapPin, Instagram, Linkedin, Github } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="mt-16 w-full bg-[#1C1629] py-16 text-white">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3">
          
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="relative mb-2 h-16 w-40">
              <Image
                src="/images/logo-vertical-eisd.png"
                alt="EISD Laboratory Logo"
                fill
                sizes="160px"
                className="object-contain object-left"
              />
            </div>
            <p className="max-w-xs text-gray-400">
              Research lab focused on UI/UX, Software Development, IoT, and Project Management.
            </p>
            <p className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} EISD Laboratory
            </p>
          </div>

          {/* Get In Touch */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Get In Touch</h3>
            <ul className="space-y-3 text-gray-400">
              <li className="flex items-start gap-3">
                <Mail className="mt-1 h-5 w-5 shrink-0 text-gray-300" />
                <a href="mailto:lab.eisd@gmail.com" className="hover:text-white transition-colors">
                  eisdlaboratory@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="mt-1 h-5 w-5 shrink-0 text-gray-300" />
                <span>
                  Telkom University Landmark Tower - 0810<br />
                  Faculty of Industrial Engineering,<br />
                  Telkom University
                </span>
              </li>
            </ul>
          </div>

          {/* Socials */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Socials</h3>
            <div className="flex gap-4">
              <Link
                href="https://www.instagram.com/peopleateisd/"
                target="_blank"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
              >
                <Instagram className="h-5 w-5" />
              </Link>
              <Link
                href="https://www.linkedin.com/company/eisd-laboratory"
                target="_blank"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
              >
                <Linkedin className="h-5 w-5" />
              </Link>
              <Link
                href="https://github.com/EISD-Laboratory/"
                target="_blank"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
              >
                <Github className="h-5 w-5" />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
}
