import { motion } from 'framer-motion';
import MotionPage from '../components/MotionPage';

const steps = [
  {
    number: '01',
    title: 'Readiness check-in',
    text: 'The user records sleep, mood, motivation, fatigue, and notes before training starts.',
  },
  {
    number: '02',
    title: 'Adaptive recommendation',
    text: 'FitPulse turns today\'s state into a simple training direction: push, maintain, reduce, or recover.',
  },
  {
    number: '03',
    title: 'Workout logging',
    text: 'Sets, reps, load, and effort are captured while the session is happening.',
  },
  {
    number: '04',
    title: 'Post-session context',
    text: 'Feedback and notes close the loop so the next recommendation starts smarter.',
  },
];

export default function HowItWorks() {
  return (
    <MotionPage className="info-page">
      <section className="info-hero">
        <p className="info-kicker">How it works</p>
        <h1>From check-in to better training decisions.</h1>
        <span>
          FitPulse keeps the workout flow short, structured, and demo-friendly without hiding the
          core product logic.
        </span>
      </section>

      <section className="info-grid info-grid-4">
        {steps.map((step, index) => (
          <motion.article
            key={step.number}
            className="info-card info-step-card"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.07, duration: 0.34 }}
          >
            <p>{step.number}</p>
            <h2>{step.title}</h2>
            <span>{step.text}</span>
          </motion.article>
        ))}
      </section>
    </MotionPage>
  );
}
