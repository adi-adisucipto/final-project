"use client";

import { useEffect, useState } from "react";
import { slides } from "../constant/hero";
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

function Hero() {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => prev === slides.length - 1 ? 0 : prev + 1);
        }, 6000);
        return () => clearInterval(timer);
    }, []);

    const next = () => setCurrent((prev) => prev === slides.length - 1 ? 0 : prev + 1);
    const prev = () => setCurrent((prev) => prev === 0 ? slides.length - 1 : prev - 1);
  return (
    <div className="relative xl:max-w-7xl mx-4 xl:mx-0 xl:h-125 h-110 xl:rounded-[32px] rounded-2xl overflow-hidden group shadow-2xl">
      <AnimatePresence mode="wait">
        <motion.div
            key={current}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0"
        >
            <div className="absolute inset-0 bg-black/60 z-10" />
            <img 
                src={slides[current].image} 
                alt={slides[current].title}
                className="w-full h-full object-cover"
            />

            <div className="absolute inset-0 z-20 flex flex-col justify-center xl:px-8 px-4 md:px-20 xl:max-w-3xl">
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                <div className="inline-block px-4 py-1.5 rounded-full bg-green-500/20 backdrop-blur-md border border-green-400/30 xl:mb-6 mb-4">
                    <span className="text-green-400 xl:text-[14px] text-[12px] font-medium tracking-widest">{slides[current].badge}</span>
                </div>
                
                <h1 className="xl:text-5xl text-3xl font-black text-white leading-tight mb-2 xl:max-w-170">
                    {slides[current].title}<br/>
                    <span className="text-transparent bg-clip-text bg-linear-to-r from-green-400 to-emerald-200">
                        {slides[current].subtitle}
                    </span>
                </h1>
                
                <p className="xl:text-lg text-[14px] text-gray-200 xl:mb-10 mb-6 xl:max-w-lg max-w-90 leading-relaxed">
                    {slides[current].description}
                </p>
                
                <Button className="rounded-md">
                    {slides[current].button}
                </Button>
                </motion.div>
            </div>
        </motion.div>
      </AnimatePresence>


      <div className="absolute bottom-8 right-8 z-30 xl:flex hidden gap-4">
        <button 
          onClick={prev}
          className="p-4 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white transition-all border border-white/20 cursor-pointer"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button 
          onClick={next}
          className="p-4 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white transition-all border border-white/20 cursor-pointer"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex gap-3">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`h-2 rounded-full transition-all duration-300 ${idx === current ? 'w-10 bg-green-500' : 'w-2 bg-white/40'}`}
          />
        ))}
      </div>
    </div>
  )
}

export default Hero
