import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { authAPI, fitnessAPI } from '../services/api';
import { Activity, Flame, Trophy, Calendar, Quote, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [stats, setStats] = useState([]);
    const [motivation, setMotivation] = useState('');
    const [error, setError] = useState(null);

    const quotes = [
        "Discipline beats motivation every day.",
        "Your body is a reflection of your lifestyle.",
        "The only bad workout is the one that didn't happen.",
        "Success starts with self-control.",
        "No pain, no gain. Shut up and train.",
        "Consistency is the key to transformation."
    ];

    useEffect(() => {
        const fetchData = async () => {
            setError(null);
            try {
                const userRes = await authAPI.getMe();
                setUser(userRes.data);
                
                const progressRes = await fitnessAPI.getProgress();
                setStats(progressRes.data);

                // Daily motivation based on date
                const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
                setMotivation(quotes[dayOfYear % quotes.length]);
            } catch (err) {
                console.error(err);
                setError("Failed to load your profile. Please check your connection.");
            }
        };
        fetchData();
    }, []);

    if (error) {
        return (
            <div className="pt-32 px-6 text-center">
                <p className="text-neon-red font-bold mb-4">{error}</p>
                <button 
                    onClick={() => window.location.reload()}
                    className="bg-white/10 px-6 py-2 rounded-full font-bold uppercase text-xs"
                >
                    Retry
                </button>
            </div>
        );
    }

    if (!user) return <div className="pt-24 px-6 text-center">Loading your fitness profile...</div>;

    const bmi = (user.weight / ((user.height / 100) ** 2)).toFixed(1);

    return (
        <div className="pt-24 pb-12 px-6 max-w-7xl mx-auto">
            <header className="mb-12">
                <motion.h1 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-4xl font-black italic uppercase"
                >
                    Welcome, {user.name.split(' ')[0]}
                </motion.h1>
                <p className="text-white/40">Current Goal: <span className="text-neon-red font-bold uppercase">{user.fitnessGoal}</span></p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12">
                {/* Stats Grid */}
                <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatCard icon={<Activity className="text-electric-blue" />} title="BMI" value={bmi} label={bmi < 18.5 ? "Underweight" : bmi < 25 ? "Healthy" : "Overweight"} />
                    <StatCard icon={<Flame className="text-neon-red" />} title="Daily TDEE" value={user.calories?.maintenance} label="Calories/Day" />
                    <StatCard icon={<Trophy className="text-yellow-400" />} title="Workout Streak" value={stats[0]?.streak || 0} label="Days Consistent" />
                </div>

                {/* Motivation Box */}
                <div className="bg-neon-red p-8 rounded-3xl glow-red flex flex-col justify-between relative overflow-hidden group">
                    <Quote className="absolute -top-4 -right-4 w-24 h-24 opacity-20 group-hover:scale-110 transition-transform" />
                    <h3 className="text-xl font-black italic uppercase mb-4">Daily Grind</h3>
                    <p className="text-lg font-bold leading-tight uppercase italic line-clamp-3">"{motivation}"</p>
                    <Link to="/coach" className="mt-6 flex items-center gap-2 text-xs font-black uppercase tracking-widest bg-black/20 self-start px-4 py-2 rounded-full">
                        Ask Coach <ChevronRight size={14} />
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Macros Section */}
                <div className="bg-zinc-900 border border-white/10 p-8 rounded-3xl">
                    <h3 className="text-2xl font-black italic uppercase mb-8">Nutritional Targets</h3>
                    <div className="space-y-6">
                        <MacroBar label="Protein" value={user.macros?.protein} color="bg-neon-red" target={200} unit="g" />
                        <MacroBar label="Carbohydrates" value={user.macros?.carbs} color="bg-electric-blue" target={300} unit="g" />
                        <MacroBar label="Fats" value={user.macros?.fat} color="bg-yellow-400" target={80} unit="g" />
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-2 gap-4">
                    <ActionCard to="/workout-plan" title="Workout Plan" desc="Generated AI Routine" color="hover:border-neon-red" />
                    <ActionCard to="/diet-plan" title="Diet Plan" desc="Meal & Macro Guide" color="hover:border-electric-blue" />
                    <ActionCard to="/progress" title="Log Weight" desc="Keep tracking gains" color="hover:border-white" />
                    <ActionCard to="/coach" title="AI Coach" desc="Personal Assistant" color="hover:border-yellow-400" />
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ icon, title, value, label }) => (
    <div className="bg-zinc-900 border border-white/10 p-8 rounded-3xl hover:border-white/20 transition-all">
        <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-white/5 rounded-2xl">{icon}</div>
            <span className="text-xs font-black uppercase text-white/40 tracking-widest">{title}</span>
        </div>
        <div className="text-4xl font-black mb-1">{value}</div>
        <div className="text-xs font-bold text-white/40 uppercase">{label}</div>
    </div>
);

const MacroBar = ({ label, value, target, color, unit }) => (
    <div className="space-y-2">
        <div className="flex justify-between text-sm font-bold uppercase italic">
            <span>{label}</span>
            <span className="text-white/40">{value}{unit}</span>
        </div>
        <div className="h-4 bg-black rounded-full overflow-hidden p-1 border border-white/5">
            <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${(value / target) * 100}%` }}
                className={`h-full rounded-full ${color}`}
            />
        </div>
    </div>
);

const ActionCard = ({ to, title, desc, color }) => (
    <Link to={to} className={`bg-zinc-900/50 border border-white/5 p-6 rounded-2xl transition-all ${color} group`}>
        <h4 className="text-lg font-black uppercase italic mb-1 group-hover:text-neon-red transition-colors">{title}</h4>
        <p className="text-xs text-white/40 uppercase font-bold">{desc}</p>
    </Link>
);

export default Dashboard;
