import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import { ChevronRight, ChevronLeft, User, Ruler, Weight, Target, Brain, Activity } from 'lucide-react';

const Signup = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        age: '',
        gender: 'male',
        height: '',
        weight: '',
        fitnessGoal: 'fat loss',
        workoutExperience: 'beginner',
        targetPhysique: 'athletic',
        activityLevel: 'moderately_active'
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleNext = () => setStep(s => s + 1);
    const handleBack = () => setStep(s => s - 1);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await authAPI.register(formData);
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data || 'Failed to register');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-12 px-6 flex flex-col items-center justify-center bg-[radial-gradient(circle_at_top_right,rgba(255,0,60,0.1),transparent)]">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-xl bg-zinc-900 border border-white/10 p-10 rounded-3xl shadow-2xl relative overflow-hidden"
            >
                {/* Progress Bar */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-white/5">
                    <motion.div 
                        className="h-full bg-neon-red shadow-[0_0_10px_#ff003c]"
                        initial={{ width: '0%' }}
                        animate={{ width: `${(step / 3) * 100}%` }}
                    />
                </div>

                <div className="mb-8">
                    <h2 className="text-3xl font-black mb-2 uppercase italic">Join the Elite</h2>
                    <p className="text-white/40">Step {step} of 3: {step === 1 ? 'Account Basics' : step === 2 ? 'Biometrics' : 'Fitness Goals'}</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: -20, opacity: 0 }}
                                className="space-y-6"
                            >
                                <InputGroup icon={<User size={18} />} label="Full Name">
                                    <input required name="name" value={formData.name} onChange={handleChange} placeholder="John Doe" className="bg-black border border-white/10 w-full p-3 rounded-xl focus:border-neon-red transition-colors outline-none" />
                                </InputGroup>
                                <InputGroup icon={<Activity size={18} />} label="Email Address">
                                    <input required type="email" name="email" value={formData.email} onChange={handleChange} placeholder="john@example.com" className="bg-black border border-white/10 w-full p-3 rounded-xl focus:border-neon-red transition-colors outline-none" />
                                </InputGroup>
                                <InputGroup icon={<Brain size={18} />} label="Password">
                                    <input required type="password" name="password" value={formData.password} onChange={handleChange} placeholder="••••••••" className="bg-black border border-white/10 w-full p-3 rounded-xl focus:border-neon-red transition-colors outline-none" />
                                </InputGroup>
                                <button type="button" onClick={handleNext} className="w-full bg-white text-black font-black py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-neon-red hover:text-white transition-all">
                                    CONTINUE <ChevronRight size={20} />
                                </button>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: -20, opacity: 0 }}
                                className="space-y-6"
                            >
                                <div className="grid grid-cols-2 gap-4">
                                    <InputGroup label="Age">
                                        <input required type="number" name="age" value={formData.age} onChange={handleChange} placeholder="25" className="bg-black border border-white/10 w-full p-3 rounded-xl focus:border-neon-red transition-colors outline-none" />
                                    </InputGroup>
                                    <InputGroup label="Gender">
                                        <select name="gender" value={formData.gender} onChange={handleChange} className="bg-black border border-white/10 w-full p-3 rounded-xl focus:border-neon-red transition-colors outline-none">
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </InputGroup>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <InputGroup icon={<Ruler size={18} />} label="Height (cm)">
                                        <input required type="number" name="height" value={formData.height} onChange={handleChange} placeholder="180" className="bg-black border border-white/10 w-full p-3 rounded-xl focus:border-neon-red transition-colors outline-none" />
                                    </InputGroup>
                                    <InputGroup icon={<Weight size={18} />} label="Weight (kg)">
                                        <input required type="number" name="weight" value={formData.weight} onChange={handleChange} placeholder="75" className="bg-black border border-white/10 w-full p-3 rounded-xl focus:border-neon-red transition-colors outline-none" />
                                    </InputGroup>
                                </div>
                                <InputGroup icon={<Activity size={18} />} label="Activity Level">
                                    <select name="activityLevel" value={formData.activityLevel} onChange={handleChange} className="bg-black border border-white/10 w-full p-3 rounded-xl focus:border-neon-red transition-colors outline-none">
                                        <option value="sedentary">Sedentary (Office job)</option>
                                        <option value="lightly_active">Lightly Active (1-2 days/week)</option>
                                        <option value="moderately_active">Moderately Active (3-5 days/week)</option>
                                        <option value="very_active">Very Active (6-7 days/week)</option>
                                    </select>
                                </InputGroup>
                                <div className="flex gap-4">
                                    <button type="button" onClick={handleBack} className="w-1/3 border border-white/10 font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-white/5 transition-all">
                                        <ChevronLeft size={20} /> BACK
                                    </button>
                                    <button type="button" onClick={handleNext} className="w-2/3 bg-white text-black font-black py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-neon-red hover:text-white transition-all">
                                        ALMOST THERE <ChevronRight size={20} />
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: -20, opacity: 0 }}
                                className="space-y-6"
                            >
                                <InputGroup icon={<Target size={18} />} label="Fitness Goal">
                                    <select name="fitnessGoal" value={formData.fitnessGoal} onChange={handleChange} className="bg-black border border-white/10 w-full p-3 rounded-xl focus:border-neon-red transition-colors outline-none">
                                        <option value="fat loss">Fat Loss</option>
                                        <option value="muscle gain">Muscle Gain</option>
                                        <option value="maintenance">Maintenance</option>
                                        <option value="competition">Competition Physique</option>
                                    </select>
                                </InputGroup>
                                <InputGroup label="Workout Experience">
                                    <select name="workoutExperience" value={formData.workoutExperience} onChange={handleChange} className="bg-black border border-white/10 w-full p-3 rounded-xl focus:border-neon-red transition-colors outline-none">
                                        <option value="beginner">Beginner (0-6 months)</option>
                                        <option value="intermediate">Intermediate (6-24 months)</option>
                                        <option value="advanced">Advanced (2+ years)</option>
                                    </select>
                                </InputGroup>
                                <InputGroup label="Target Physique">
                                    <select name="targetPhysique" value={formData.targetPhysique} onChange={handleChange} className="bg-black border border-white/10 w-full p-3 rounded-xl focus:border-neon-red transition-colors outline-none">
                                        <option value="athletic">Athletic</option>
                                        <option value="bodybuilder">Bodybuilder</option>
                                        <option value="lean">Lean & Toned</option>
                                        <option value="powerlifter">Powerlifter</option>
                                    </select>
                                </InputGroup>

                                {error && <p className="text-neon-red text-sm font-bold">{error}</p>}

                                <div className="flex gap-4">
                                    <button type="button" onClick={handleBack} className="w-1/3 border border-white/10 font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-white/5 transition-all">
                                        <ChevronLeft size={20} /> BACK
                                    </button>
                                    <button type="submit" disabled={loading} className="w-2/3 bg-neon-red text-white font-black py-4 rounded-xl flex items-center justify-center gap-2 glow-red hover:scale-105 transition-all disabled:opacity-50">
                                        {loading ? 'CREATING PROFILE...' : 'COMPLETE SIGNUP'}
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </form>

                <p className="mt-8 text-center text-white/40 text-sm">
                    Already have an account? <Link to="/login" className="text-white hover:text-neon-red font-bold underline">Login here</Link>
                </p>
            </motion.div>
        </div>
    );
};

const InputGroup = ({ label, icon, children }) => (
    <div className="space-y-2">
        <label className="text-xs font-black uppercase tracking-widest text-white/40 flex items-center gap-2">
            {icon}
            {label}
        </label>
        {children}
    </div>
);

export default Signup;
