import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ArrowRight, Activity, BrainCircuit, Check, Flame, Play, Sparkles, Target, TrendingUp, Utensils } from 'lucide-react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  const heroRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      if (heroRef.current) {
        heroRef.current.style.transform = `translateY(${scrolled * 0.12}px)`;
      }
    };

    gsap.fromTo('.hero-reveal', { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.12, ease: 'power3.out' });
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative overflow-hidden">
      <section className="hero-grid relative min-h-[760px] pt-32 pb-20 px-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_24%,rgba(255,0,60,0.2),transparent_32%)]" />
        <div className="container relative z-10 mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-[1.05fr_0.95fr]">
          <div ref={heroRef}>
            <div className="hero-reveal mb-6 inline-flex items-center gap-2 rounded-full border border-neon-red/30 bg-neon-red/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-red-200">
              <Sparkles size={14} /> Your next level starts here
            </div>
            <h1 className="hero-reveal max-w-3xl text-6xl font-black leading-[0.9] tracking-[-0.04em] md:text-8xl">
              TRAIN WITH <span className="gradient-text-red">INTENT.</span><br />
              LIVE WITH <span className="gradient-text-blue">ENERGY.</span>
            </h1>
            <p className="hero-reveal mt-8 max-w-xl text-lg leading-relaxed text-white/60 md:text-xl">
              A smarter fitness system that turns your goals, schedule, and progress into a plan you can actually stick with.
            </p>
            <div className="hero-reveal mt-10 flex flex-col gap-4 sm:flex-row">
              <Link to="/signup" className="group flex items-center justify-center gap-3 rounded-full bg-neon-red px-7 py-4 font-black shadow-[0_0_30px_rgba(255,0,60,0.28)] transition-transform hover:scale-[1.03]">
                BUILD MY PLAN <ArrowRight size={19} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Link to="/login" className="flex items-center justify-center gap-3 rounded-full border border-white/15 px-7 py-4 font-bold text-white/80 transition-colors hover:border-white/40 hover:text-white">
                <Play size={16} fill="currentColor" /> SEE HOW IT WORKS
              </Link>
            </div>
            <div className="hero-reveal mt-12 flex flex-wrap gap-x-8 gap-y-3 text-sm text-white/50">
              <span className="flex items-center gap-2"><Check size={15} className="text-neon-red" /> Personalised in minutes</span>
              <span className="flex items-center gap-2"><Check size={15} className="text-neon-red" /> Built around your life</span>
            </div>
          </div>

          <div className="hero-reveal relative mx-auto w-full max-w-[520px]">
            <div className="absolute -inset-5 rounded-[2rem] bg-neon-red/10 blur-3xl" />
            <div className="relative overflow-hidden rounded-[2rem] border border-white/15 bg-zinc-900 shadow-2xl">
              <img src="https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=1000&q=85" alt="Athlete training with weights" className="h-[520px] w-full object-cover object-center opacity-80" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />
              <div className="absolute left-5 right-5 top-5 flex items-center justify-between rounded-xl border border-white/15 bg-black/55 p-4 backdrop-blur-md">
                <div><p className="text-[10px] uppercase tracking-[0.2em] text-white/50">Today's focus</p><p className="mt-1 font-bold">Upper body strength</p></div>
                <div className="rounded-lg bg-neon-red p-2"><Target size={18} /></div>
              </div>
              <div className="absolute bottom-5 left-5 right-5 grid grid-cols-3 gap-2 rounded-xl border border-white/15 bg-black/65 p-4 backdrop-blur-md">
                <Metric value="84%" label="Consistency" />
                <Metric value="12" label="Week streak" />
                <Metric value="+18%" label="Strength" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-white/[0.03] px-6 py-20">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-12 max-w-2xl"><p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-neon-red">One system. Every goal.</p><h2 className="text-4xl font-black md:text-6xl">Less guesswork.<br /><span className="text-white/45">More momentum.</span></h2></div>
          <div className="grid gap-4 md:grid-cols-3">
            <FeatureCard icon={<BrainCircuit className="text-neon-red" />} title="Adaptive workouts" description="Your plan changes as your performance changes, so every session meets you where you are." />
            <FeatureCard icon={<Utensils className="text-electric-blue" />} title="Food that fits" description="Flexible nutrition guidance built around your targets, preferences, and the foods you enjoy." />
            <FeatureCard icon={<TrendingUp className="text-lime-300" />} title="Proof of progress" description="See the habits, streaks, and improvements that turn a good week into a new baseline." />
          </div>
        </div>
      </section>

      <section className="relative px-6 py-24">
        <div className="container mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2">
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-zinc-900 p-8 md:p-12">
            <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-electric-blue/10 blur-3xl" />
            <div className="relative"><div className="mb-10 flex items-center justify-between"><div><p className="text-xs uppercase tracking-[0.2em] text-white/40">Weekly overview</p><p className="mt-2 text-2xl font-black">You are on track</p></div><Flame className="text-orange-400" /></div><div className="flex h-40 items-end gap-3 border-b border-white/10">{[42, 58, 48, 72, 64, 85, 92].map((height, index) => <div key={index} className="group flex flex-1 flex-col justify-end gap-2"><div style={{ height: `${height}%` }} className={`rounded-t-md transition-all group-hover:bg-neon-red ${index === 6 ? 'bg-neon-red' : 'bg-white/20'}`} /><span className="text-center text-[10px] text-white/30">{['M', 'T', 'W', 'T', 'F', 'S', 'S'][index]}</span></div>)}</div><div className="mt-8 flex items-center justify-between"><div><p className="text-3xl font-black">6.4<span className="text-base text-white/40"> hrs</span></p><p className="text-xs text-white/40">active time</p></div><div className="text-right"><p className="flex items-center justify-end gap-1 font-bold text-lime-300"><Activity size={15} /> +24%</p><p className="text-xs text-white/40">vs last week</p></div></div></div>
          </div>
          <div><p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-electric-blue">Designed for consistency</p><h2 className="text-4xl font-black leading-tight md:text-6xl">Make showing up your <span className="gradient-text-red">superpower.</span></h2><p className="mt-6 text-lg leading-relaxed text-white/60">Motivation is unpredictable. Your system should not be. AI Fitness Coach keeps your training, nutrition, and progress in one calm, clear place.</p><Link to="/signup" className="mt-8 inline-flex items-center gap-2 font-black text-neon-red hover:text-white">START FOR FREE <ArrowRight size={18} /></Link></div>
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <motion.div 
    whileHover={{ y: -10 }}
    className="bg-zinc-900/60 p-7 rounded-2xl border border-white/10 hover:-translate-y-1 hover:border-white/25 transition-all text-left"
  >
    <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mb-6">
      {icon}
    </div>
    <h3 className="text-xl font-black mb-3">{title}</h3>
    <p className="text-white/60 leading-relaxed">{description}</p>
  </motion.div>
);

const Metric = ({ value, label }) => (
  <div><p className="text-lg font-black md:text-xl">{value}</p><p className="mt-1 text-[10px] uppercase tracking-wider text-white/45">{label}</p></div>
);

export default LandingPage;
