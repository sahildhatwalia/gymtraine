import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import WorkoutPlan from './pages/WorkoutPlan';
import DietPlan from './pages/DietPlan';
import ProgressTracker from './pages/ProgressTracker';
import AICoach from './pages/AICoach';
import Navbar from './components/Navbar';
import AuthGuard from './components/AuthGuard';

function App() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        <Route path="/dashboard" element={
          <AuthGuard>
            <Dashboard />
          </AuthGuard>
        } />
        <Route path="/workout-plan" element={
          <AuthGuard>
            <WorkoutPlan />
          </AuthGuard>
        } />
        <Route path="/diet-plan" element={
          <AuthGuard>
            <DietPlan />
          </AuthGuard>
        } />
        <Route path="/progress" element={
          <AuthGuard>
            <ProgressTracker />
          </AuthGuard>
        } />
        <Route path="/coach" element={
          <AuthGuard>
            <AICoach />
          </AuthGuard>
        } />
        
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

export default App;
