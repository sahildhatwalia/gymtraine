import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import { LogIn, Mail, Lock } from 'lucide-react';

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await authAPI.login(formData);
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data || 'Invalid email or password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-6 bg-[radial-gradient(circle_at_bottom_left,rgba(0,229,255,0.1),transparent)]">
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md bg-zinc-900 border border-white/10 p-10 rounded-3xl shadow-2xl"
            >
                <div className="text-center mb-10">
                    <h2 className="text-4xl font-black gradient-text-blue uppercase italic">Welcome Back</h2>
                    <p className="text-white/40 mt-2">Enter your credentials to continue your transformation</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-white/40 flex items-center gap-2">
                            <Mail size={16} /> Email
                        </label>
                        <input 
                            required 
                            type="email" 
                            name="email" 
                            value={formData.email} 
                            onChange={handleChange}
                            className="bg-black border border-white/10 w-full p-4 rounded-xl focus:border-electric-blue transition-colors outline-none" 
                            placeholder="your@email.com"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-white/40 flex items-center gap-2">
                            <Lock size={16} /> Password
                        </label>
                        <input 
                            required 
                            type="password" 
                            name="password" 
                            value={formData.password} 
                            onChange={handleChange}
                            className="bg-black border border-white/10 w-full p-4 rounded-xl focus:border-electric-blue transition-colors outline-none" 
                            placeholder="••••••••"
                        />
                    </div>

                    {error && <p className="text-neon-red text-sm font-bold">{error}</p>}

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-electric-blue text-black font-black py-4 rounded-xl flex items-center justify-center gap-2 glow-blue hover:scale-105 transition-all disabled:opacity-50"
                    >
                        {loading ? 'AUTHENTICATING...' : <><LogIn size={20} /> LOG IN</>}
                    </button>
                </form>

                <p className="mt-8 text-center text-white/40 text-sm">
                    New to the club? <Link to="/signup" className="text-white hover:text-electric-blue font-bold underline">Create Account</Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Login;
