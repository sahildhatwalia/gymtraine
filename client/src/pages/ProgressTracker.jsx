import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { fitnessAPI } from '../services/api';
import { Line } from 'react-chartjs-2';
import { 
    Chart as ChartJS, 
    CategoryScale, 
    LinearScale, 
    PointElement, 
    LineElement, 
    Title, 
    Tooltip, 
    Legend,
    Filler
} from 'chart.js';
import { Scale, TrendingUp, Calendar, Save } from 'lucide-react';

ChartJS.register(
    CategoryScale, 
    LinearScale, 
    PointElement, 
    LineElement, 
    Title, 
    Tooltip, 
    Legend,
    Filler
);

const ProgressTracker = () => {
    const [stats, setStats] = useState([]);
    const [currentWeight, setCurrentWeight] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchProgress();
    }, []);

    const fetchProgress = async () => {
        try {
            const res = await fitnessAPI.getProgress();
            setStats(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await fitnessAPI.addProgress({ weight: parseFloat(currentWeight) });
            setCurrentWeight('');
            fetchProgress();
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const chartData = {
        labels: stats.length > 0 ? stats.map(s => new Date(s.date).toLocaleDateString()) : ['Jan', 'Feb', 'Mar'],
        datasets: [
            {
                label: 'Weight (kg)',
                data: stats.length > 0 ? stats.map(s => s.weight) : [80, 78, 77],
                borderColor: '#ff003c',
                backgroundColor: 'rgba(255, 0, 60, 0.1)',
                fill: true,
                tension: 0.4,
                pointRadius: 6,
                pointBackgroundColor: '#ff003c',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: '#151515',
                titleColor: '#fff',
                bodyColor: '#a0a0a0',
                borderWidth: 1,
                borderColor: 'rgba(255, 255, 255, 0.1)',
                padding: 12,
                displayColors: false
            }
        },
        scales: {
            y: {
                grid: { color: 'rgba(255, 255, 255, 0.05)' },
                ticks: { color: '#a0a0a0', font: { family: 'Outfit', weight: 'bold' } }
            },
            x: {
                grid: { display: false },
                ticks: { color: '#a0a0a0', font: { family: 'Outfit', weight: 'bold' } }
            }
        }
    };

    return (
        <div className="pt-24 pb-12 px-6 max-w-7xl mx-auto">
            <header className="mb-12">
                <h1 className="text-5xl font-black italic uppercase leading-none mb-2">Evolution <span className="text-neon-red">Log</span></h1>
                <p className="text-white/40 uppercase font-black tracking-widest text-xs">Visualize your journey to the peak</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Chart Section */}
                <div className="lg:col-span-2 bg-zinc-900 border border-white/10 p-8 rounded-3xl shadow-2xl overflow-hidden">
                    <div className="flex justify-between items-center mb-10">
                        <h3 className="text-2xl font-black italic uppercase">Weight History</h3>
                        <div className="flex gap-4">
                            <span className="flex items-center gap-2 text-xs font-bold text-white/40"><div className="w-2 h-2 rounded-full bg-neon-red" /> Weight</span>
                        </div>
                    </div>
                    <div className="h-[400px]">
                        <Line data={chartData} options={chartOptions} />
                    </div>
                </div>

                {/* Form & Stats Section */}
                <div className="space-y-8">
                    <div className="bg-zinc-900 border border-white/10 p-8 rounded-3xl shadow-2xl">
                        <div className="flex items-center gap-3 mb-8">
                            <Scale className="text-neon-red" />
                            <h3 className="text-2xl font-black italic uppercase">Log Weight</h3>
                        </div>
                        <form onSubmit={handleSave} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-white/40 tracking-widest">Current Body Weight (kg)</label>
                                <input 
                                    required
                                    type="number" 
                                    step="0.1"
                                    value={currentWeight}
                                    onChange={(e) => setCurrentWeight(e.target.value)}
                                    className="w-full bg-black border border-white/10 p-4 rounded-xl focus:border-neon-red outline-none text-2xl font-black italic"
                                    placeholder="00.0"
                                />
                            </div>
                            <button 
                                disabled={loading}
                                className="w-full bg-neon-red py-4 rounded-xl font-black italic uppercase flex items-center justify-center gap-2 glow-red hover:scale-105 transition-all text-lg"
                            >
                                <Save size={20} /> {loading ? 'SAVING...' : 'UPDATE PROGRESS'}
                            </button>
                        </form>
                    </div>

                    <div className="bg-white/5 border border-white/10 p-8 rounded-3xl">
                        <div className="flex justify-between items-center mb-6">
                            <h4 className="text-xl font-black italic uppercase">Milestones</h4>
                            <Calendar size={20} className="text-white/20" />
                        </div>
                        <div className="space-y-4">
                            <Milestone icon={<TrendingUp size={16} />} text="Lost 2.5kg in last 30 days" date="Today" />
                            <Milestone icon={<TrendingUp size={16} />} text="Reached 15% body fat estimate" date="5 days ago" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Milestone = ({ icon, text, date }) => (
    <div className="flex items-center justify-between p-4 bg-black/40 rounded-2xl border border-white/5">
        <div className="flex items-center gap-3">
            <div className="text-neon-red">{icon}</div>
            <p className="text-sm font-bold white/80">{text}</p>
        </div>
        <span className="text-[10px] font-black uppercase text-white/20">{date}</span>
    </div>
);

export default ProgressTracker;
