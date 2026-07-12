import { motion } from 'framer-motion';
import MotionPage from '../components/MotionPage';

const featureRows = [
  {
    left: {
      eyebrow: 'Before training',
      title: 'Readiness check-in',
      text: 'Sleep, mood, motivation, fatigue, and notes are captured before the user commits to a workout.',
    },
    right: {
      eyebrow: 'Decision layer',
      title: 'Adaptive recommendation',
      text: 'FitPulse translates today\'s state into a clear direction: push, maintain, reduce, or recover.',
    },
  },
  {
    left: {
      eyebrow: 'During training',
      title: 'Workout logging',
      text: 'Sets, reps, load, and effort stay easy to capture while the session is moving.',
    },
    right: {
      eyebrow: 'Exercise control',
      title: 'Custom movements',
      text: 'Users can create free-form exercises, so a demo never depends on pre-seeded templates.',
    },
  },
  {
    left: {
      eyebrow: 'After training',
      title: 'Session reflection',
      text: 'Difficulty, notes, and feedback close the loop while the workout is still fresh.',
    },
    right: {
      eyebrow: 'Progress view',
      title: 'Training insights',
      text: 'The dashboard turns volume and history into a quick read on what changed.',
    },
  },
];

function FeatureCard({ item, side, index }) {
  return (
    <motion.div
      className={`feature-card feature-card-${side}`}
      initial={{ opacity: 0, x: side === 'left' ? -24 : 24, y: 10 }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ delay: 0.08 + index * 0.04, duration: 0.38 }}
    >
      <p>{item.eyebrow}</p>
      <h2>{item.title}</h2>
      <span>{item.text}</span>
    </motion.div>
  );
}

export default function Features() {
  return (
    <MotionPage className="features-page">
      <section className="features-intro">
        <p>Features</p>
        <h1>One connected loop for smarter training.</h1>
        <span>
          Each feature supports the next step: readiness, decision, logging, reflection, and progress.
        </span>
      </section>

      <section className="feature-timeline" aria-label="Feature timeline">
        <motion.div
          className="feature-timeline-line"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        />

        {featureRows.map((row, index) => (
          <article className="feature-row" key={row.left.title}>
            <FeatureCard item={row.left} side="left" index={index} />
            <motion.div
              className="feature-branch feature-branch-left"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ delay: 0.12, duration: 0.42, ease: 'easeOut' }}
            />
            <motion.div
              className="feature-branch feature-branch-right"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ delay: 0.12, duration: 0.42, ease: 'easeOut' }}
            />
            <motion.div
              className="feature-dot"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ type: 'spring', stiffness: 240, damping: 16 }}
            />
            <FeatureCard item={row.right} side="right" index={index} />
          </article>
        ))}
      </section>
    </MotionPage>
  );
}
