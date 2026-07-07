"use client";

import React, { useState } from 'react';
import { 
  ArrowLeft,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import Link from 'next/link';
import Image from 'next/image';
import { cn } from "@/lib/utils";

type TechItem = {
  name: string;
  icon?: React.ReactNode;
  image?: string;
};

export default function UiUxDesignPage() {
  const [isInfoExpanded, setIsInfoExpanded] = useState(false);
  const [activePhase, setActivePhase] = useState<number | null>(null);

  const togglePhase = (index: number) => {
    setActivePhase(activePhase === index ? null : index);
  };

  // Tools Stack
  // Note: Add images to public/images and update paths here
  const toolsStack: TechItem[] = [
    { name: "Figma", image: "/images/figma.svg" },
    { name: "Maze", image: "/images/maze.jpg" },
  ];

  const phases = [
    {
      title: "Foundation & User-Centric Mindset",
      topics: [
        "Introduction to UI/UX & Design Thinking",
        "User Research & Empathy",
        "Information Architecture & User Flow",
        "Low-Fidelity Wireframing"
      ]
    },
    {
      title: "Visual Design & Prototyping",
      topics: [
        "UI Design Principles & Visual Identity",
        "Layouting & UI Grids",
        "Design System & Components",
        "Interactive Prototyping"
      ]
    },
    {
      title: "Testing & Iteration",
      topics: [
        "Usability Testing & Iteration",
        "Case Study - Final Task"
      ]
    }
  ];

  return (
    <div className="min-h-screen text-gray-800 font-sans relative overflow-x-hidden">
      {/* Background Decor - Purple Theme (Lighter blur on mobile) */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
          <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-[#311081D9]/10 blur-xl md:blur-3xl"></div>
          <div className="absolute bottom-[10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-[#00D97A]/10 blur-xl md:blur-3xl"></div>
      </div>

      <Navbar />

      <div className="max-w-5xl mx-auto space-y-8 pt-24 px-6 md:px-12 pb-12">
        
        {/* Back Button */}
        <Link href="/" className="inline-flex items-center gap-2 text-[#311081D9] font-medium hover:underline transition-all group">
            <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
            Back to Home
        </Link>
        
        {/* Header Section (Collapsible Info Box) */}
        <div className="relative bg-white/95 md:bg-white/50 md:backdrop-blur-md border border-white/40 shadow-xl rounded-3xl overflow-hidden transition-colors duration-300">
             {/* Subtle shine effect */}
             <div className="absolute inset-0 bg-linear-to-br from-white/40 via-transparent to-transparent opacity-50 pointer-events-none"></div>

            <div className="relative z-10 p-8 md:p-12">
                <div className="flex justify-between items-center cursor-pointer" onClick={() => setIsInfoExpanded(!isInfoExpanded)}>
                    <h1 className="text-4xl md:text-5xl font-bold text-[#311081D9] tracking-tight">
                        UI/UX Design
                    </h1>
                    <button 
                        className="p-2 rounded-full bg-white/50 hover:bg-white/80 transition-colors text-[#311081D9]"
                        aria-label="Toggle Details"
                    >
                        {isInfoExpanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                    </button>
                </div>

                <div className={cn(
                    "grid transition-[grid-template-rows] duration-0 md:duration-500 ease-in-out",
                    isInfoExpanded ? "grid-rows-[1fr] opacity-100 mt-4" : "grid-rows-[0fr] opacity-0 mt-0"
                )}>
                    <div className="overflow-hidden">
                        <p className="text-lg text-black max-w-2xl leading-relaxed pt-2">
                             Learn how to turn user problems into usable digital solutions by doing users researches, designing intuitive flows, and testing interfaces to improve real user experience.
                        </p>

                        <div className="h-px w-full bg-linear-to-r from-transparent via-[#311081D9]/20 to-transparent my-10"></div>

                        {/* Tools Section */}
                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold text-[#311081D9] flex items-center gap-2">
                                Design Tools
                            </h3>
                            <div className="flex flex-wrap gap-4">
                                {toolsStack.map((item, idx) => (
                                    <div key={idx} className="flex flex-col items-center gap-2 group">
                                        <div className="w-14 h-14 rounded-2xl bg-white/80 border border-white/60 shadow-sm flex items-center justify-center text-[#311081D9] transition-transform group-hover:scale-105 group-hover:shadow-md overflow-hidden">
                                            {/* Logic to choose Image or Icon */}
                                            {item.image ? (
                                                <Image 
                                                    src={item.image} 
                                                    alt={item.name} 
                                                    width={32} 
                                                    height={32} 
                                                    className="w-8 h-8 object-contain"
                                                />
                                            ) : (
                                                item.icon
                                            )}
                                        </div>
                                        <span className="text-xs font-medium text-gray-500">{item.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Syllabus Section (Phases) */}
        <div className="space-y-6 pt-4">
            <h2 className="text-3xl font-bold text-[#311081D9] pl-2 border-l-4 border-[#00D97A]">
                Learning Phases
            </h2>
            
            {/* Phases Accordion */}
            <div className="flex flex-col gap-6">
                {phases.map((phase, idx) => {
                    const isActive = activePhase === idx;
                    return (
                        <div key={idx} className="w-full relative group">
                            <div className={cn(
                                "absolute inset-0 bg-[#311081D9] rounded-2xl blur transition-opacity duration-300",
                                isActive ? "opacity-10" : "opacity-0 group-hover:opacity-5"
                            )}></div>
                            
                            <div className="relative w-full bg-white/95 md:bg-white/40 md:backdrop-blur-md border border-white/50 rounded-2xl shadow-sm overflow-hidden transition-all duration-300">
                                {/* Phase Header (Clickable) */}
                                <div 
                                    className="p-6 md:p-8 flex justify-between items-center cursor-pointer hover:bg-white/40 transition-colors"
                                    onClick={() => togglePhase(idx)}
                                >
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-3">
                                            <span className="px-3 py-1 rounded-full bg-[#00D97A]/20 text-[#006e3e] text-xs font-bold uppercase tracking-wider">
                                                Phase 0{idx + 1}
                                            </span>
                                            <h3 className={cn(
                                                "text-xl md:text-2xl font-medium transition-colors",
                                                isActive ? "text-[#311081D9]" : "text-gray-800"
                                            )}>
                                                {phase.title}
                                            </h3>
                                        </div>
                                    </div>
                                    <div className={cn(
                                        "p-2 rounded-full transition-all duration-300 transform",
                                        isActive ? "bg-[#311081D9] text-white rotate-180" : "bg-white/50 text-gray-400 group-hover:bg-[#311081D9]/10 group-hover:text-[#311081D9]"
                                    )}>
                                        <ChevronDown className="w-6 h-6" />
                                    </div>
                                </div>

                                {/* Phase Content (Collapsible) */}
                                <div className={cn(
                                    "grid transition-[grid-template-rows] duration-0 md:duration-500 ease-in-out",
                                    isActive ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                                )}>
                                    <div className="overflow-hidden bg-white/50">
                                        <div className="h-px w-full bg-linear-to-r from-transparent via-[#311081D9]/10 to-transparent"></div>
                                        <div className="p-6 md:p-8 pt-4">
                                            <ul className="space-y-4">
                                                {phase.topics.map((topic, i) => (
                                                    <li key={i} className="flex items-start gap-3 text-gray-700">
                                                        <div className="mt-1.5 w-2 h-2 rounded-full bg-[#00D97A] shrink-0"></div>
                                                        <span className="leading-relaxed">{topic}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>

      </div>
      
      <Footer />
    </div>
  );
}
