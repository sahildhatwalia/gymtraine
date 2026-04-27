import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { fitnessAPI } from '../services/api';
import { Utensils, Apple, Coffee, Moon, Beef, Leaf, ShoppingCart } from 'lucide-react';

const DietPlan = () => {
    const [plan, setPlan] = useState(null);
    const [loading, setLoading] = useState(true);
    const [today, setToday] = useState("");

    useEffect(() => {
        const currentDay = new Date().toLocaleDateString('en-US', { weekday: 'long' });
        setToday(currentDay);

        const fetchPlan = async () => {
            try {
                // Try to get existing plan first
                const res = await fitnessAPI.getPlan();
                setPlan(res.data.dietPlan);
            } catch (err) {
                if (err.response?.status === 404) {
                    try {
                        const res = await fitnessAPI.generatePlans();
                        setPlan(res.data.dietPlan);
                    } catch (genErr) {
                        console.error(genErr);
                    }
                }
            } finally {
                setLoading(false);
            }
        };
        fetchPlan();
    }, []);

    const defaultDiet = [
        { meal: "Breakfast", icon: <Coffee />, items: ["Oats (50g)", "3 Egg Whites", "1 Banana"], cals: 450, macros_string: "P:30g C:60g F:10g" },
        { meal: "Lunch", icon: <Beef />, items: ["Chicken Breast (150g)", "Brown Rice (100g)", "Steamed Broccoli"], cals: 550, macros_string: "P:45g C:50g F:12g" },
        { meal: "Evening Snack", icon: <Apple />, items: ["Protein Shake", "Almonds (10-12)"], cals: 250, macros_string: "P:25g C:10g F:12g" },
        { meal: "Dinner", icon: <Leaf />, items: ["Fish (150g) / Paneer", "Sweet Potato (100g)", "Greek Salad"], cals: 400, macros_string: "P:35g C:40g F:8g" }
    ];

    const weeklyDiet = plan || [];
    const todayDiet = Array.isArray(weeklyDiet) ? weeklyDiet.find(d => 
        d.day?.toLowerCase().trim() === today.toLowerCase().trim()
    ) : null;

    const mealsRaw = todayDiet?.meals || (plan && Array.isArray(plan) ? [] : defaultDiet);
    const currentMeals = Array.isArray(mealsRaw) ? mealsRaw : (mealsRaw ? Object.values(mealsRaw) : []);

    if (loading) return <div className="pt-32 text-center text-electric-blue font-black uppercase italic animate-pulse">Calculating Macros...</div>;

    const totalCals = currentMeals.reduce((acc, curr) => acc + (curr.calories || curr.cals || 0), 0);

    return (
        <div className="pt-24 pb-12 px-6 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                <div>
                    <h1 className="text-5xl font-black uppercase italic leading-none mb-2">Fuel <span className="text-electric-blue">Center</span></h1>
                    <p className="text-white/40 uppercase font-black tracking-widest text-xs">{today} Neural Profile</p>
                </div>
                <div className="bg-zinc-900 border border-white/10 px-8 py-4 rounded-3xl flex items-center gap-8 shadow-xl">
                    <NutritionStat label="TOTAL CALS" value={totalCals || 0} unit="kcal" color="text-electric-blue" />
                    <div className="w-px h-10 bg-white/10" />
                    <NutritionStat label="GOAL" value={todayDiet?.day ? "OPTIMIZED" : "DEFAULT"} unit="" color="text-neon-red" />
                    <div className="w-px h-10 bg-white/10" />
                    <NutritionStat label="WATER" value="3.5" unit="L" color="text-blue-400" />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Meal Schedule */}
                <div className="space-y-6">
                    {currentMeals.length > 0 ? currentMeals.map((meal, idx) => (
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            key={idx} 
                            className="bg-zinc-900/50 border border-white/10 p-6 rounded-3xl hover:bg-zinc-900 transition-colors group"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex gap-4">
                                    <div className="w-14 h-14 bg-black rounded-2xl flex items-center justify-center border border-white/10 group-hover:border-electric-blue transition-colors text-electric-blue text-sm">
                                        {meal.meal?.toLowerCase().includes('breakfast') && <Coffee size={24} />}
                                        {meal.meal?.toLowerCase().includes('lunch') && <Beef size={24} />}
                                        {meal.meal?.toLowerCase().includes('snack') && <Apple size={24} />}
                                        {meal.meal?.toLowerCase().includes('dinner') && <Leaf size={24} />}
                                        {!(meal.meal?.toLowerCase().match(/breakfast|lunch|snack|dinner/)) && <Utensils size={24} />}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black italic uppercase mb-2">{meal.meal}</h3>
                                        <ul className="space-y-1">
                                            {(Array.isArray(meal.items) ? meal.items : (typeof meal.items === 'string' ? meal.items.split(',').map(s=>s.trim()) : (meal.items ? Object.values(meal.items) : []))).map((item, i) => (
                                                <li key={i} className="text-white/60 text-sm font-bold flex items-center gap-2">
                                                    <div className="w-1 h-1 rounded-full bg-electric-blue" />
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-black italic mb-1">{meal.calories || meal.cals}</div>
                                    <div className="text-[10px] font-black uppercase text-white/20 tracking-widest leading-tight">
                                        Macro: {typeof meal.macros_string === 'string' ? meal.macros_string : 
                                               (typeof meal.macros === 'object' ? 
                                               `P:${meal.macros.protein} C:${meal.macros.carbs} F:${meal.macros.fat}` : "P:32 C:40 F:10")}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )) : (
                        <div className="bg-zinc-900/30 border border-white/5 p-20 rounded-3xl text-center">
                            <h3 className="text-4xl font-black italic uppercase text-white/20 mb-4">RESTING FUEL</h3>
                            <p className="text-white/40 font-bold uppercase tracking-widest text-sm">Stick to your maintenance macros. <br /> Check the Sync button on Workout page to refresh.</p>
                        </div>
                    )}
                </div>

                {/* Nutrition Insights */}
                <div className="space-y-8">
                    <div className="bg-white/5 border border-white/10 p-8 rounded-3xl">
                        <h4 className="text-2xl font-black italic uppercase mb-6 flex items-center gap-3">
                            <Leaf className="text-green-500" /> AI Suggestions
                        </h4>
                        <div className="space-y-4">
                            <InsightItem text="Increase sodium intake slightly after heavy training sessions to prevent cramping." />
                            <InsightItem text="Prioritize fast-acting carbs (like banana) within 30 mins post-workout." />
                            <InsightItem text="Avoid heavy meals 2 hours before sleep for better GH secretion." />
                        </div>
                    </div>

                    <div className="bg-zinc-900 border border-white/10 p-8 rounded-3xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 text-6xl opacity-10 group-hover:scale-110 transition-transform">🛒</div>
                        <h4 className="text-xl font-black italic uppercase mb-2">Supplement Stack</h4>
                        <p className="text-white/40 text-sm uppercase font-bold tracking-widest mb-6 italic">Recommended for your Neural Profile</p>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-black rounded-2xl border border-white/5">
                                <p className="text-xs font-black uppercase text-white/20 mb-1 italic">Post Workout</p>
                                <p className="font-black italic">Whey Isolate</p>
                            </div>
                            <div className="p-4 bg-black rounded-2xl border border-white/5">
                                <p className="text-xs font-black uppercase text-white/20 mb-1 italic">Strength</p>
                                <p className="font-black italic">Creatine Mono</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const NutritionStat = ({ label, value, unit, color }) => (
    <div className="text-center">
        <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1 italic">{label}</p>
        <p className={`text-2xl font-black italic ${color}`}>{value}<span className="text-xs ml-1 opacity-50">{unit}</span></p>
    </div>
);

const InsightItem = ({ text }) => (
    <div className="flex gap-4 p-4 bg-black/40 rounded-2xl border border-white/5 items-start">
        <div className="w-2 h-2 rounded-full bg-electric-blue mt-1.5 shrink-0 shadow-[0_0_8px_#00e5ff]" />
        <p className="text-sm text-white/60 font-medium leading-tight">{text}</p>
    </div>
);

export default DietPlan;
