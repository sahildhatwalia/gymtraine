import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import { Send, User, Bot, Sparkles, MessageSquare } from 'lucide-react';

const AICoach = () => {
    const [messages, setMessages] = useState([
        { role: 'assistant', content: "I am Titan, your AI Fitness Coach. What's on your mind today? We can discuss your workout form, diet adjustments, or any plateaus you're facing." }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const chatEndRef = useRef(null);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userMsg = { role: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            const res = await api.post('/coach/chat', { 
                message: input, 
                history: messages.slice(-5) // Send last 5 messages for context
            });
            setMessages(prev => [...prev, { role: 'assistant', content: res.data.reply }]);
        } catch (err) {
            console.error(err);
            setMessages(prev => [...prev, { role: 'assistant', content: "Error connecting to Titan. Check your connection." }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="pt-24 pb-6 px-6 h-screen flex flex-col max-w-5xl mx-auto">
            <header className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-black italic uppercase leading-none mb-1">Coach <span className="text-neon-red">Titan</span></h1>
                    <p className="text-white/40 uppercase font-black tracking-widest text-[10px]">Neural Fitness Engine v2.0</p>
                </div>
                <div className="flex -space-x-2">
                    <div className="w-10 h-10 rounded-full bg-neon-red border-2 border-black flex items-center justify-center shadow-lg"><User size={16} /></div>
                    <div className="w-10 h-10 rounded-full bg-zinc-900 border-2 border-black flex items-center justify-center shadow-lg text-neon-red"><Bot size={18} /></div>
                </div>
            </header>

            {/* Chat Container */}
            <div className="flex-1 bg-zinc-900/50 border border-white/10 rounded-3xl overflow-hidden flex flex-col mb-6 relative">
                <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(255,0,60,0.03),transparent)]" />
                
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    <AnimatePresence>
                        {messages.map((msg, idx) => (
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                key={idx} 
                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`max-w-[80%] p-5 rounded-2xl flex gap-4 ${
                                    msg.role === 'user' 
                                    ? 'bg-neon-red text-white ml-12 rounded-tr-none glow-red' 
                                    : 'bg-white/5 border border-white/10 text-white/80 mr-12 rounded-tl-none'
                                }`}>
                                    {msg.role === 'assistant' && <Sparkles className="text-neon-red shrink-0" size={18} />}
                                    <p className="text-sm font-medium leading-relaxed">{msg.content}</p>
                                </div>
                            </motion.div>
                        ))}
                        {loading && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                                <div className="bg-white/5 border border-white/10 p-5 rounded-2xl rounded-tl-none">
                                    <div className="flex gap-1">
                                        <div className="w-1.5 h-1.5 bg-neon-red rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                        <div className="w-1.5 h-1.5 bg-neon-red rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                        <div className="w-1.5 h-1.5 bg-neon-red rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <div ref={chatEndRef} />
                </div>

                {/* Input Area */}
                <form onSubmit={handleSend} className="p-4 bg-black/40 border-t border-white/5">
                    <div className="relative">
                        <input 
                            type="text" 
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask about exercises, macros, or recovery..."
                            className="w-full bg-zinc-900 border border-white/10 p-5 pr-16 rounded-2xl focus:border-neon-red outline-none text-sm transition-all shadow-inner"
                        />
                        <button 
                            type="submit"
                            disabled={loading}
                            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-neon-red rounded-xl flex items-center justify-center glow-red hover:scale-105 transition-all text-white disabled:opacity-50"
                        >
                            <Send size={18} />
                        </button>
                    </div>
                </form>
            </div>

            {/* Suggestions */}
            <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
                <QuickSuggest text="How to improve bench press?" onSelect={setInput} />
                <QuickSuggest text="Alternative for squats?" onSelect={setInput} />
                <QuickSuggest text="Best post-workout meal?" onSelect={setInput} />
                <QuickSuggest text="Fix my sleep schedule" onSelect={setInput} />
            </div>
        </div>
    );
};

const QuickSuggest = ({ text, onSelect }) => (
    <button 
        onClick={() => onSelect(text)}
        className="whitespace-nowrap bg-white/5 border border-white/10 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest text-white/40 hover:bg-white/10 hover:text-white transition-all"
    >
        {text}
    </button>
);

export default AICoach;
