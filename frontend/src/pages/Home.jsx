import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import heroArt from '../assets/hero.png';

const stats = [
  { value: '30s', label: 'readiness check-in' },
  { value: '4', label: 'training moments connected' },
  { value: '1', label: 'clear session recommendation' },
];

const flow = [
  {
    step: '01',
    title: 'Check in',
    text: 'Capture sleep, mood, motivation, fatigue, and notes before the first set.',
  },
  {
    step: '02',
    title: 'Adapt',
    text: 'Turn readiness into a focused recommendation without losing workout structure.',
  },
  {
    step: '03',
    title: 'Train',
    text: 'Log sets, reps, load, and effort while the session is still moving.',
  },
  {
    step: '04',
    title: 'Reflect',
    text: 'Close with feedback so the next workout starts with better context.',
  },
];

const features = [
  'AI-guided workout recommendations',
  'Readiness scoring before training',
  'Workout logging and volume tracking',
  'Voice notes for fast reflection',
  'Profile-aware training context',
  'Progress insights for review',
];

const readinessBars = [
  { label: 'Sleep', value: '82%', className: 'home-bar-cyan' },
  { label: 'Motivation', value: '76%', className: 'home-bar-green' },
  { label: 'Fatigue', value: '38%', className: 'home-bar-amber' },
];

const heroVariants = {
  hidden: { opacity: 0, y: 22 },
  visible: (index = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: index * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  }),
};

function ArrowIcon() {
  return (
    <svg aria-hidden="true" className="home-icon" viewBox="0 0 24 24" fill="none">
      <path
        d="M5 12h14m-6-6 6 6-6 6"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg aria-hidden="true" className="home-icon" viewBox="0 0 24 24" fill="none">
      <path
        d="m5 12 4 4L19 6"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TiltCard({ children, className = '' }) {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });

  const handlePointerMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    setRotate({ x: y * -8, y: x * 8 });
  };

  return (
    <motion.div
      className={`home-tilt ${className}`}
      style={{ transformStyle: 'preserve-3d' }}
      animate={{ rotateX: rotate.x, rotateY: rotate.y }}
      transition={{ type: 'spring', stiffness: 180, damping: 20 }}
      onPointerMove={handlePointerMove}
      onPointerLeave={() => setRotate({ x: 0, y: 0 })}
      whileHover={{ y: -3 }}
    >
      <div className="home-tilt-shine" />
      <div className="home-tilt-content">{children}</div>
    </motion.div>
  );
}

function HeroPreview() {
  return (
    <TiltCard className="home-preview">
      <div className="home-preview-top">
        <div>
          <p className="home-eyebrow">Today</p>
          <h2>Training readiness</h2>
        </div>
        <motion.div
          className="home-score"
          animate={{ scale: [1, 1.04, 1] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        >
          82
        </motion.div>
      </div>

      <div className="home-bars">
        {readinessBars.map((item, index) => (
          <div className="home-bar-row" key={item.label}>
            <div className="home-bar-label">
              <span>{item.label}</span>
              <span>{item.value}</span>
            </div>
            <div className="home-bar-track">
              <motion.div
                className={`home-bar-fill ${item.className}`}
                initial={{ width: 0 }}
                animate={{ width: item.value }}
                transition={{ delay: 0.35 + index * 0.1, duration: 0.65, ease: 'easeOut' }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="home-recommendation">
        <p>Recommendation</p>
        <span>Keep intensity moderate, reduce accessory volume, and prioritize form.</span>
      </div>
    </TiltCard>
  );
}

export default function Home() {
  const isLoggedIn =
    typeof window !== 'undefined' && Boolean(window.localStorage.getItem('token'));
  const primaryDestination = isLoggedIn ? '/dashboard' : '/register';
  const primaryLabel = isLoggedIn ? 'Open dashboard' : 'Start free';

  return (
    <div className="home-page">
      <section className="home-hero">
        <motion.img
          src={heroArt}
          alt=""
          className="home-hero-art"
          animate={{ y: [0, -12, 0], rotate: [0, 1, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        />

        <div className="home-container home-hero-grid">
          <div className="home-hero-copy">
            <motion.p custom={0} variants={heroVariants} initial="hidden" animate="visible" className="home-kicker">
              United Hacks project
            </motion.p>
            <motion.h1 custom={1} variants={heroVariants} initial="hidden" animate="visible">
              FitPulse
            </motion.h1>
            <motion.p custom={2} variants={heroVariants} initial="hidden" animate="visible" className="home-lede">
              A readiness-first fitness companion that adapts the day&apos;s workout, logs the
              session, and turns effort into useful training context.
            </motion.p>

            <motion.div custom={3} variants={heroVariants} initial="hidden" animate="visible" className="home-actions">
              <Link to={primaryDestination} className="home-primary">
                {primaryLabel}
                <ArrowIcon />
              </Link>
              <a href="#flow" className="home-secondary">
                See the flow
              </a>
            </motion.div>

            <motion.div custom={4} variants={heroVariants} initial="hidden" animate="visible" className="home-stats">
              {stats.map((item) => (
                <TiltCard className="home-stat" key={item.label}>
                  <strong>{item.value}</strong>
                  <span>{item.label}</span>
                </TiltCard>
              ))}
            </motion.div>
          </div>

          <motion.div
            className="home-preview-wrap"
            initial={{ opacity: 0, x: 24, scale: 0.97 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ delay: 0.25, duration: 0.58, ease: [0.22, 1, 0.36, 1] }}
          >
            <HeroPreview />
          </motion.div>
        </div>
      </section>

      <section id="flow" className="home-section home-section-green">
        <div className="home-container">
          <div className="home-section-head">
            <p className="home-eyebrow">Training loop</p>
            <h2>One path from readiness to reflection.</h2>
            <span>The product story is short enough for a demo and complete enough for a real workout.</span>
          </div>

          <div className="home-flow-grid">
            {flow.map((item, index) => (
              <TiltCard className="home-flow-card" key={item.step}>
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ delay: index * 0.07, duration: 0.34 }}
                >
                  <p>{item.step}</p>
                  <h3>{item.title}</h3>
                  <span>{item.text}</span>
                </motion.div>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      <section className="home-section">
        <div className="home-container home-feature-layout">
          <motion.div
            className="home-feature-copy"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.4 }}
          >
            <p className="home-eyebrow home-eyebrow-warm">Built for the demo</p>
            <h2>Polished enough for judges, clear enough for athletes.</h2>
            <span>
              FitPulse makes the core idea visible fast: training should react to how someone shows
              up today, not only what the calendar says.
            </span>
            <Link to={isLoggedIn ? '/dashboard' : '/login'} className="home-outline">
              {isLoggedIn ? 'Go to dashboard' : 'Sign in'}
              <ArrowIcon />
            </Link>
          </motion.div>

          <div className="home-feature-grid">
            {features.map((feature, index) => (
              <TiltCard className="home-feature-card" key={feature}>
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ delay: index * 0.04, duration: 0.3 }}
                >
                  <i>
                    <CheckIcon />
                  </i>
                  <span>{feature}</span>
                </motion.div>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
