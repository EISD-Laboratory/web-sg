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
import { DreamyBackground } from "@/components/DreamyBackground";

type TechItem = {
  name: string;
  icon?: React.ReactNode;
  image?: string;
};

export default function TechnopreneurPage() {
  const [isInfoExpanded, setIsInfoExpanded] = useState(false);

  // Tools Stack
  const toolsStack: TechItem[] = [
    { name: "Jira", image: "/images/jira.svg" },
  ];

  const syllabus = [
    { week: "01", topic: "Introduction to Digital Business & Product Management" },
    { week: "02", topic: "User & Market Research + Market Size & Feasibility" },
    { week: "03", topic: "Design Thinking & Business Model Canvas" },
    { week: "04", topic: "PRD, Requirement Analysis & Prioritization" },
    { week: "05", topic: "MVP Product Planning" },
    { week: "06", topic: "SDLC, Agile, Scrum & Product Tools (Jira/Trello)" },
    { week: "07", topic: "Financial Projection & Go-To-Market Strategy" },
    { week: "08", topic: "Pitching & Final Presentation" },
  ];

  return (
    <div className="min-h-screen text-gray-800 font-sans relative overflow-x-hidden transition-all duration-500 ease-in-out">
      {/* Background Decor - Unified Theme */}
      <DreamyBackground />

      <Navbar />

      <div className="max-w-5xl mx-auto space-y-8 pt-24 px-6 md:px-12 pb-12 transition-all duration-500">
        
        {/* Back Button */}
        <Link href="/" className="inline-flex items-center gap-2 text-[#311081D9] font-medium hover:underline transition-all group">
            <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
            Back to Home
        </Link>
        
        {/* Header Section (Collapsible Info Box) */}
        <div className="relative bg-white/95 md:bg-white/30 md:backdrop-blur-xl border border-white/40 shadow-xl rounded-3xl overflow-hidden transition-all duration-500 ease-in-out">
             {/* Subtle shine effect */}
             <div className="absolute inset-0 bg-linear-to-br from-white/40 via-transparent to-transparent opacity-50 pointer-events-none"></div>

            <div className="relative z-10 p-8 md:p-12">
                <div className="flex justify-between items-center cursor-pointer" onClick={() => setIsInfoExpanded(!isInfoExpanded)}>
                    <h1 className="text-4xl md:text-5xl font-bold text-[#311081D9] tracking-tight">
                        Technopreneur
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
                            Learn how to validate ideas and turn them into viable digital products by defining problems, analyzing the market, planning the features, and pitching the business solutions.
                        </p>

                        <div className="h-px w-full bg-linear-to-r from-transparent via-[#311081D9]/20 to-transparent my-10"></div>

                        {/* Tools Section */}
                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold text-[#311081D9] flex items-center gap-2">
                                Management Tools
                            </h3>
                            <div className="flex flex-wrap gap-4">
                                {toolsStack.map((item, idx) => (
                                    <div key={idx} className="flex flex-col items-center gap-2 group">
                                        <div className="w-14 h-14 rounded-2xl bg-white/50 border border-white/60 shadow-sm flex items-center justify-center text-[#311081D9] transition-transform group-hover:scale-105 group-hover:shadow-md backdrop-blur-sm overflow-hidden">
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

        {/* Syllabus Section (Vertical Stack) */}
        <div className="space-y-6 pt-4">
            <h2 className="text-3xl font-bold text-[#311081D9] pl-2 border-l-4 border-[#00D97A]">
                Weekly Learning Modules
            </h2>
            
            {/* Vertical Stack Container */}
            <div className="flex flex-col gap-4">
                {syllabus.map((week, idx) => (
                    <div key={idx} className="w-full relative group">
                        <div className="absolute inset-0 bg-[#311081D9] rounded-xl blur opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                        <div className="relative w-full bg-white/95 md:bg-white/40 md:backdrop-blur-md border border-white/50 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 flex items-center gap-6">
                            <div className="shrink-0 px-4 py-2 rounded-full bg-[#00D97A]/20 text-[#006e3e] text-sm font-bold">
                                Week {week.week}
                            </div>
                            <h3 className="text-xl font-medium text-gray-800 group-hover:text-[#311081D9] transition-colors">
                                {week.topic}
                            </h3>
                        </div>
                    </div>
                ))}
            </div>
        </div>

      </div>
      
      <Footer />
    </div>
  );
}
