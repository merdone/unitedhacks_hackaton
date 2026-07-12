import { AnimatePresence } from 'framer-motion';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { WorkoutProvider } from './context/WorkoutContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Insights from './pages/Insights';
import Templates from './pages/Templates';
import Recovery from './pages/Recovery';
import ProfileSetup from './pages/ProfileSetup';
import PreWorkoutCheckin from './pages/PreWorkoutCheckin';
import AiRecommendation from './pages/AiRecommendation';
import ActiveWorkout from './pages/ActiveWorkout';
import PostWorkoutSummary from './pages/PostWorkoutSummary';

function PrivateRoute({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
}

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected */}
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/insights" element={<PrivateRoute><Insights /></PrivateRoute>} />
        <Route path="/templates" element={<PrivateRoute><Templates /></PrivateRoute>} />
        <Route path="/recovery" element={<PrivateRoute><Recovery /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><ProfileSetup /></PrivateRoute>} />
        <Route path="/checkin" element={<PrivateRoute><PreWorkoutCheckin /></PrivateRoute>} />
        <Route path="/recommendation" element={<PrivateRoute><AiRecommendation /></PrivateRoute>} />
        <Route path="/workout" element={<PrivateRoute><ActiveWorkout /></PrivateRoute>} />
        <Route path="/summary" element={<PrivateRoute><PostWorkoutSummary /></PrivateRoute>} />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <WorkoutProvider>
      <Router>
        <Layout>
          <AnimatedRoutes />
        </Layout>
      </Router>
    </WorkoutProvider>
  );
}
