import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { WorkoutProvider } from './context/WorkoutContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ProfileSetup from './pages/ProfileSetup';
import PreWorkoutCheckin from './pages/PreWorkoutCheckin';
import AiRecommendation from './pages/AiRecommendation';
import ActiveWorkout from './pages/ActiveWorkout';
import PostWorkoutSummary from './pages/PostWorkoutSummary';

function PrivateRoute({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <WorkoutProvider>
      <Router>
        <Layout>
          <Routes>
            {/* Public */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected */}
            <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/profile" element={<PrivateRoute><ProfileSetup /></PrivateRoute>} />
            <Route path="/checkin" element={<PrivateRoute><PreWorkoutCheckin /></PrivateRoute>} />
            <Route path="/recommendation" element={<PrivateRoute><AiRecommendation /></PrivateRoute>} />
            <Route path="/workout" element={<PrivateRoute><ActiveWorkout /></PrivateRoute>} />
            <Route path="/summary" element={<PrivateRoute><PostWorkoutSummary /></PrivateRoute>} />

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </Router>
    </WorkoutProvider>
  );
}
