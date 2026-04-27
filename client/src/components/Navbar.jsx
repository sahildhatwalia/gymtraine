import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Dumbbell, LayoutDashboard, Utensils, TrendingUp, MessageSquare, LogOut } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (['/login', '/signup'].includes(location.pathname)) return null;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10 px-6 py-4 flex items-center justify-between">
      <Link to="/" className="flex items-center gap-2 group">
        <Dumbbell className="text-neon-red group-hover:rotate-45 transition-transform duration-300" size={32} />
        <span className="text-2xl font-black gradient-text-red">AI FITNESS COACH</span>
      </Link>

      {token ? (
        <div className="flex items-center gap-8">
          <NavLink to="/dashboard" icon={<LayoutDashboard size={20} />} label="Dashboard" />
          <NavLink to="/workout-plan" icon={<Dumbbell size={20} />} label="Workouts" />
          <NavLink to="/diet-plan" icon={<Utensils size={20} />} label="Diet" />
          <NavLink to="/progress" icon={<TrendingUp size={20} />} label="Progress" />
          <NavLink to="/coach" icon={<MessageSquare size={20} />} label="AI Coach" />
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-white/60 hover:text-neon-red transition-colors"
          >
            <LogOut size={20} />
            <span className="font-bold uppercase text-sm">Logout</span>
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-4">
          <Link to="/login" className="font-bold uppercase text-sm hover:text-neon-red transition-colors">Login</Link>
          <Link to="/signup" className="bg-neon-red px-6 py-2 rounded-full font-bold uppercase text-sm glow-red hover:scale-105 transition-transform">Get Started</Link>
        </div>
      )}
    </nav>
  );
};

const NavLink = ({ to, icon, label }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link 
      to={to} 
      className={`flex items-center gap-2 transition-colors ${isActive ? 'text-neon-red' : 'text-white/60 hover:text-white'}`}
    >
      {icon}
      <span className="font-bold uppercase text-sm hidden md:block">{label}</span>
      {isActive && <div className="absolute -bottom-4 left-0 right-0 h-0.5 bg-neon-red shadow-[0_0_10px_#ff003c]" />}
    </Link>
  );
};

export default Navbar;
