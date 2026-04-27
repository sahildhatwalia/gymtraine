import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { Dumbbell, ArrowRight, Activity, Zap, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  const dumbbellRef = useRef(null);
  const heroRef = useRef(null);

  useEffect(() => {
    // Dumbbell entry animation
    gsap.fromTo(dumbbellRef.current, 
      { y: -500, rotate: 0, opacity: 0 },
      { y: 0, rotate: 360, opacity: 1, duration: 1.5, ease: "bounce.out" }
    );

    // Parallax effect
    const handleScroll = () => {
      const scrolled = window.scrollY;
      if (heroRef.current) {
        heroRef.current.style.transform = `translateY(${scrolled * 0.4}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative pt-24 min-h-screen overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-neon-red/20 blur-[100px] rounded-full" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-electric-blue/20 blur-[100px] rounded-full" />

      {/* Hero Section */}
      <section className="container mx-auto px-6 pt-20 flex flex-col items-center text-center">
        <div ref={dumbbellRef} className="mb-8">
          <Dumbbell size={120} className="text-neon-red drop-shadow-[0_0_20px_#ff003c]" />
        </div>

        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-6xl md:text-8xl font-black leading-none mb-6"
        >
          TRANSFORM YOUR <br />
          <span className="gradient-text-red">BODY</span> WITH <br />
          <span className="gradient-text-blue">AI PRECISION</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-xl text-white/60 max-w-2xl mb-12"
        >
          The ultimate AI-powered fitness coach that generates personalized workout and diet plans 
          tailored specifically to your body type, goals, and progress.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1 }}
          className="flex flex-col sm:flex-row gap-6 mb-20"
        >
          <Link to="/signup" className="group bg-neon-red px-10 py-4 rounded-full font-black text-lg flex items-center gap-2 glow-red hover:scale-105 transition-all">
            START YOUR JOURNEY
            <ArrowRight className="group-hover:translate-x-2 transition-transform" />
          </Link>
          <Link to="/login" className="px-10 py-4 rounded-full border border-white/20 font-black text-lg hover:bg-white/10 transition-all">
            VIEW DEMO
          </Link>
        </motion.div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl mb-32">
          <FeatureCard 
            icon={<Zap className="text-neon-red" />}
            title="AI Workouts"
            description="Smart routines that evolve as you get stronger and more consistent."
          />
          <FeatureCard 
            icon={<Activity className="text-electric-blue" />}
            title="Diet Precision"
            description="Macro-optimized meal plans based on real USDA nutritional data."
          />
          <FeatureCard 
            icon={<Star className="text-yellow-400" />}
            title="Progress Sync"
            description="Visual tracking of your evolution with 3D body transformation insights."
          />
        </div>
      </section>

      {/* Interactive Body Hover Section (Concept) */}
      <section className="bg-white/5 py-32 px-6">
        <div className="container mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="relative h-[500px] flex items-center justify-center bg-black rounded-3xl overflow-hidden border border-white/10 group">
            <div className="absolute inset-0 bg-gradient-to-t from-neon-red/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="text-9xl relative z-10 select-none">
                {/* Visual Placeholder for the bodybuilder */}
                💪
            </div>
            {/* Fruit Group Concept */}
            <FruitMuscle label="Chest" fruit="🍎" position="top-1/4 left-1/2 -translate-x-1/2" />
            <FruitMuscle label="Biceps" fruit="🍊" position="top-1/3 left-1/4" />
            <FruitMuscle label="Abs" fruit="🍌" position="top-1/2 left-1/2 -translate-x-1/2" />
            <FruitMuscle label="Legs" fruit="🍍" position="bottom-1/4 left-1/2 -translate-x-1/2" />
          </div>
          <div>
            <h2 className="text-5xl font-black mb-6">DIET IS <span className="text-neon-red">MUSCLE</span></h2>
            <p className="text-white/60 text-lg mb-8 leading-relaxed">
              Hover over the body to see how different nutrients contribute to muscle groups. 
              Our AI doesn't just give you a list of foods; it teaches you how to fuel your gains.
            </p>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 font-bold">
                <div className="w-2 h-2 rounded-full bg-neon-red shadow-[0_0_5px_#ff003c]" />
                Optimal Protein-to-Weight Ratio
              </li>
              <li className="flex items-center gap-3 font-bold">
                <div className="w-2 h-2 rounded-full bg-electric-blue shadow-[0_0_5px_#00e5ff]" />
                Targeted Macro Distribution
              </li>
              <li className="flex items-center gap-3 font-bold">
                <div className="w-2 h-2 rounded-full bg-yellow-400 shadow-[0_0_5px_#ffeb3b]" />
                Micronutrient Tracking
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <motion.div 
    whileHover={{ y: -10 }}
    className="bg-zinc-900/50 p-8 rounded-3xl border border-white/5 hover:border-white/20 transition-all text-left"
  >
    <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mb-6">
      {icon}
    </div>
    <h3 className="text-2xl font-black mb-4">{title}</h3>
    <p className="text-white/60 leading-relaxed">{description}</p>
  </motion.div>
);

const FruitMuscle = ({ label, fruit, position }) => (
  <div className={`absolute ${position} group/fruit pointer-events-auto`}>
    <div className="relative">
      <div className="text-4xl opacity-0 group-hover/fruit:opacity-100 scale-0 group-hover/fruit:scale-100 transition-all duration-300 transform -translate-y-4">
        {fruit}{fruit}{fruit}
      </div>
      <div className="absolute top-10 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black border border-white/20 px-3 py-1 rounded text-xs font-bold opacity-0 group-hover/fruit:opacity-100 transition-opacity">
        {label}
      </div>
    </div>
  </div>
);

export default LandingPage;
