import { motion, useReducedMotion } from 'framer-motion';

export default function AppBackdrop() {
  const reduceMotion = useReducedMotion();
  const slowTransition = reduceMotion
    ? { duration: 0 }
    : { duration: 16, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' };

  return (
    <div aria-hidden="true" className="app-backdrop">
      <div className="app-backdrop-grid" />
      <motion.div
        className="app-aurora app-aurora-cyan"
        animate={reduceMotion ? undefined : { x: [0, 54], y: [0, 34], scale: [1, 1.13] }}
        transition={slowTransition}
      />
      <motion.div
        className="app-aurora app-aurora-violet"
        animate={reduceMotion ? undefined : { x: [0, -48], y: [0, -26], scale: [1.04, 0.9] }}
        transition={{ ...slowTransition, delay: reduceMotion ? 0 : 1.6 }}
      />
      <motion.div
        className="app-aurora app-aurora-emerald"
        animate={reduceMotion ? undefined : { x: [0, -26], y: [0, 28], scale: [0.94, 1.08] }}
        transition={{ ...slowTransition, delay: reduceMotion ? 0 : 0.8 }}
      />
      <div className="app-backdrop-noise" />
    </div>
  );
}
