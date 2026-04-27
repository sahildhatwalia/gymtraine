import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { fitnessAPI } from '../services/api';
import { Play, Info, CheckCircle2, ChevronRight, Lock, Box, RefreshCw } from 'lucide-react';

const WorkoutPlan = () => {
    const [plan, setPlan] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeExercise, setActiveExercise] = useState(null);
    const [selectedDay, setSelectedDay] = useState("");
    const [today, setToday] = useState("");

    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

    // Mapping exercise names to Sketchfab 3D Model IDs and Detailed Metadata
    const exerciseMetadata = {
        "Push Ups": {
            id: "4946358482614b79b8a53e6c38290231",
            image: "https://images.unsplash.com/photo-1598971639058-aba3cba81bae?w=800&q=80",
            description: "The push-up is a foundational compound exercise that targets the pectorals, deltoids, and triceps while engaging the core. It builds upper body strength and improves shoulder stability.",
            cues: [
                "Keep your body in a straight line from head to heels.",
                "Lower your chest until it's just above the floor.",
                "Exhale as you push back to the starting position."
            ]
        },
        "Squats": {
            id: "83d8e3d06bca482e967a506161986428",
            image: "https://images.unsplash.com/photo-1574680096145-d05b474e2158?w=800&q=80",
            description: "Squats are the king of lower body exercises, targeting the quadriceps, hamstrings, and glutes. They improve functional strength and bone density.",
            cues: [
                "Keep your chest up and core engaged.",
                "Lower your hips back and down like sitting in a chair.",
                "Keep your weight on your heels and drive up explosively."
            ]
        },
        "Plank": {
            id: "318d184856014b79b8a53e6c38290231",
            image: "https://images.unsplash.com/photo-1566241134883-13eb2393a3cc?w=800&q=80",
            description: "The plank is an isometric core exercise that involves maintaining a position similar to a push-up for the maximum possible time.",
            cues: [
                "Maintain a straight line from shoulders to ankles.",
                "Squeeze your glutes and core hard.",
                "Don't let your hips sag or rise too high."
            ]
        },
        "Dumbbell Curl": {
            id: "54ded67a13d740c0879e8c45f4701968",
            image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&q=80",
            description: "Bicep curls isolate the biceps brachii, the muscle on the front of the upper arm. This exercise is key for building arm size and strength.",
            cues: [
                "Keep your elbows pinned to your sides.",
                "Curl the weights while contracting your biceps.",
                "Lower the weights slowly for maximum time under tension."
            ]
        },
        "Pull Ups": {
            id: "17bb0dd0e15243af96409825633de5e4",
            description: "Pull-ups are a challenging upper-body exercise that primarily targets the latissimus dorsi (back) and biceps.",
            cues: [
                "Pull yourself up until your chin is over the bar.",
                "Control your descent to avoid shoulder strain.",
                "Keep your core tight to prevent swinging."
            ]
        },
        "Deadlift": {
            id: "f5bc75691e9b46d3969a4891b0c036c6",
            description: "The deadlift is a powerlifting exercise that works almost every muscle in the body, with a focus on the posterior chain (glutes, hamstrings, and back).",
            cues: [
                "Keep the bar close to your shins.",
                "Maintain a neutral spine; avoid rounding your back.",
                "Drive through your heels to lift the weight."
            ]
        },
        "Bench Press": {
            id: "aeb337f74075421abb809825633de5e4",
            description: "The bench press is a classic upper-body exercise that targets the chest, shoulders, and triceps.",
            cues: [
                "Keep your feet flat on the floor for stability.",
                "Lower the bar slowly to your mid-chest.",
                "Press the bar up while exhaling."
            ]
        },
        "Shoulder Press": {
            id: "6f8d3886ed2846f4a86f8a467f57a3e4",
            description: "The shoulder press builds strength and size in the deltoids while also engaging the triceps and upper back.",
            cues: [
                "Press the dumbbells overhead until arms are locked.",
                "Avoid arching your lower back.",
                "Control the weight as you lower it to shoulder height."
            ]
        },
        "Lunges": {
            id: "c08e284856014b79b8a53e6c38290231",
            description: "Lunges target the quadriceps, glutes, and hamstrings while also improving balance and hip mobility.",
            cues: [
                "Step forward and lower your hips until both knees are at 90°.",
                "Keep your front knee aligned with your ankle.",
                "Push back to the starting position with your front foot."
            ]
        },
        "Burpees": {
            id: "b08e284856014b79b8a53e6c38290231",
            description: "The burpee is a full-body exercise used in strength training and as an aerobic exercise. It's excellent for conditioning and fat loss.",
            cues: [
                "Drop into a squat and kick your feet back into a plank.",
                "Perform a push-up, then jump your feet back to your hands.",
                "Explode upward into a jump with arms overhead."
            ]
        }
    };

    useEffect(() => {
        const currentDay = new Date().toLocaleDateString('en-US', { weekday: 'long' });
        setToday(currentDay);
        setSelectedDay(currentDay);

        const fetchPlan = async () => {
            try {
                // Try to get existing plan first
                const res = await fitnessAPI.getPlan();
                setPlan(res.data.workoutPlan);
            } catch (err) {
                if (err.response?.status === 404) {
                    // If no plan exists, generate one
                    try {
                        const res = await fitnessAPI.generatePlans();
                        setPlan(res.data.workoutPlan);
                    } catch (genErr) {
                        console.error("Failed to generate:", genErr);
                    }
                } else {
                    console.error("Fetch error:", err);
                }
            } finally {
                setLoading(false);
            }
        };
        fetchPlan();
    }, []);

    const handleRegenerate = async () => {
        setLoading(true);
        try {
            const res = await fitnessAPI.generatePlans();
            setPlan(res.data.workoutPlan);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const defaultPlans = [
        { day: "Monday", focus: "Full Body Mixed", exercises: [{ name: "Push Ups", reps: "3x15", muscle: "Chest", video: "pushup" }, { name: "Squats", reps: "3x20", muscle: "Legs", video: "squat" }, { name: "Plank", reps: "3x60s", muscle: "Core", video: "plank" }] },
        { day: "Tuesday", focus: "Rest & Recovery", exercises: [] },
        { day: "Wednesday", focus: "Functional Power", exercises: [{ name: "Pull Ups", reps: "3x10", muscle: "Back", video: "pullup" }, { name: "Lunges", reps: "3x12", muscle: "Legs", video: "lunge" }, { name: "Shoulder Press", reps: "3x12", muscle: "Shoulders", video: "shoulder" }] },
        { day: "Thursday", focus: "Rest & Recovery", exercises: [] },
        { day: "Friday", focus: "Max Strength", exercises: [{ name: "Deadlift", reps: "3x8", muscle: "Posterior Chain", video: "deadlift" }, { name: "Bench Press", reps: "3x10", muscle: "Chest", video: "bench" }, { name: "Burpees", reps: "3x20", muscle: "Full Body", video: "burpee" }] },
        { day: "Saturday", focus: "Active Recovery", exercises: [] },
        { day: "Sunday", focus: "Rest", exercises: [] }
    ];

    const weeklyPlan = plan || defaultPlans;
    const currentDayWorkout = weeklyPlan.find(d => 
        d.day?.toLowerCase().trim() === selectedDay.toLowerCase().trim()
    );

    if (loading) return <div className="pt-32 text-center text-neon-red font-black uppercase italic animate-pulse">Consulting AI Coach...</div>;

    const currentMeta = activeExercise ? exerciseMetadata[activeExercise.name] || {
        id: "4946358482614b79b8a53e6c38290231",
        description: "Focus on your form and maintain consistency to achieve your fitness goals.",
        cues: ["Focus on breathing", "Control the movement", "Hydrate between sets"]
    } : null;

    return (
        <div className="pt-24 pb-12 px-6 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-6">
                <div>
                    <h1 className="text-5xl font-black uppercase italic leading-none mb-2">{selectedDay === today ? "Today's" : selectedDay + "'s"} <span className="text-neon-red">Challenge</span></h1>
                    <p className="text-white/40 uppercase font-black tracking-widest text-xs">{selectedDay} session {selectedDay === today && "(current)"}</p>
                </div>
                <div className="flex gap-4">
                    <button 
                        onClick={handleRegenerate}
                        className="bg-white/5 hover:bg-white/10 border border-white/10 px-6 py-3 rounded-xl flex items-center gap-3 transition-all text-xs font-black uppercase italic"
                    >
                        <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                        Sync Neural Plan
                    </button>
                    <div className="bg-zinc-900 border border-white/10 px-6 py-3 rounded-xl flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${currentDayWorkout?.exercises?.length ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : 'bg-yellow-500 shadow-[0_0_8px_#eab308]'}`} />
                        <span className="text-sm font-bold uppercase italic">
                            {currentDayWorkout?.exercises?.length ? 'Status: Active' : 'Status: Rest Day'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Day Selector Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
                {days.map(day => (
                    <button
                        key={day}
                        onClick={() => setSelectedDay(day)}
                        className={`px-6 py-2 rounded-full text-xs font-black uppercase italic transition-all whitespace-nowrap ${
                            selectedDay === day 
                            ? 'bg-neon-red text-white glow-red scale-105' 
                            : 'bg-white/5 text-white/40 border border-white/10 hover:border-white/30'
                        }`}
                    >
                        {day}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2 space-y-8">
                    {currentDayWorkout?.exercises?.length > 0 ? (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-zinc-900/50 border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
                        >
                            <div className="px-8 py-6 bg-white/5 border-b border-white/5 flex justify-between items-center">
                                <h3 className="text-2xl font-black italic uppercase text-neon-red">{currentDayWorkout.focus}</h3>
                                <span className="text-xs font-black uppercase tracking-widest text-white/40">{currentDayWorkout.exercises.length} Exercises</span>
                            </div>
                            <div className="p-4">
                                {currentDayWorkout.exercises.map((ex, exIdx) => (
                                    <div 
                                        key={exIdx} 
                                        className={`flex items-center justify-between p-5 rounded-2xl transition-all cursor-pointer group mb-2 ${activeExercise?.name === ex.name ? 'bg-neon-red/10 border border-neon-red/20' : 'hover:bg-white/5 border border-transparent'}`}
                                        onClick={() => setActiveExercise(ex)}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center border border-white/10 group-hover:border-neon-red transition-colors">
                                                <Play size={16} className={activeExercise?.name === ex.name ? 'text-neon-red' : 'text-white'} />
                                            </div>
                                            <div>
                                                <h4 className="font-black uppercase italic text-lg">{ex.name}</h4>
                                                <p className="text-xs text-white/40 uppercase font-bold">{ex.muscle}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-xl font-black italic text-electric-blue">{ex.reps}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    ) : (
                        <div className="bg-zinc-900/30 border border-white/5 p-20 rounded-3xl text-center">
                            <h3 className="text-4xl font-black italic uppercase text-white/20 mb-4">REST DAY</h3>
                            <p className="text-white/40 font-bold uppercase tracking-widest text-sm">Recovery is where the growth happens. <br /> Check back tomorrow for your next mission.</p>
                        </div>
                    )}
                </div>

                <div className="lg:col-span-1">
                    <div className="sticky top-32 bg-zinc-900 border border-white/10 p-8 rounded-3xl shadow-2xl">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-2 bg-neon-red/10 rounded-lg">
                                <Info className="text-neon-red" size={20} />
                            </div>
                            <h3 className="text-2xl font-black italic uppercase">3D Visualization</h3>
                        </div>

                        {activeExercise && currentMeta ? (
                            <div className="space-y-8">
                                <div className="aspect-square bg-black rounded-2xl relative overflow-hidden border border-white/10 group">
                                    {/* Exercise Image as Background/Fallback */}
                                    {currentMeta.image && (
                                        <img 
                                            src={currentMeta.image} 
                                            alt={activeExercise.name} 
                                            className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-20 transition-opacity"
                                        />
                                    )}
                                    
                                    {/* Sketchfab 3D Embed */}
                                    <iframe 
                                        title={activeExercise.name}
                                        className="w-full h-full border-0 relative z-10"
                                        src={`https://sketchfab.com/models/${currentMeta.id}/embed?autostart=1&preload=1&transparent=1&ui_animations=0&ui_infos=0&ui_stop=0&ui_inspector=0&ui_watermark_link=0&ui_watermark=0&ui_hint=0&ui_ar=0&ui_help=0&ui_settings=0&ui_vr=0&ui_fullscreen=1&ui_annotations=0`}
                                        allow="autoplay; fullscreen; xr-spatial-tracking"
                                        execution_while_out_of_viewport
                                        execution_while_not_rendered
                                        web-share
                                    />
                                    
                                    <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2 pointer-events-none z-20">
                                        <div className="px-3 py-1 bg-black/80 backdrop-blur-md border border-neon-red/30 text-[9px] font-black uppercase italic rounded-full text-neon-red shadow-lg">
                                            3D View Active
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
                                    <h4 className="text-lg font-black italic uppercase mb-2 flex items-center gap-2">
                                        <div className="w-1 h-4 bg-neon-red" />
                                        Titan's Cue: {activeExercise.name}
                                    </h4>
                                    <p className="text-xs text-white/40 mb-6 font-medium italic leading-relaxed">
                                        {currentMeta.description}
                                    </p>
                                    <ul className="space-y-4">
                                        {currentMeta.cues.map((cue, idx) => (
                                            <FormStep key={idx} text={cue} />
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-black/20 rounded-2xl border border-white/5 border-dashed">
                                <Box size={40} className="mx-auto mb-6 text-white/5" />
                                <p className="text-white/20 font-black uppercase text-xs tracking-widest leading-loose">
                                    SELECT AN EXERCISE <br /> TO LOAD 3D NEURAL <br /> GRAPHICS
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const FormStep = ({ text }) => (
    <li className="flex gap-3 text-sm">
        <CheckCircle2 className="text-neon-red shrink-0" size={18} />
        <span className="text-white/60 leading-tight">{text}</span>
    </li>
);

export default WorkoutPlan;
