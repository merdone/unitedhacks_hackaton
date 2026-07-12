import { useState } from 'react';
import { motion } from 'framer-motion';

export default function TiltTile({
  children,
  className = '',
  glow = 'rgba(34,211,238,0.22)',
  as: Component = motion.div,
}) {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });

  const handlePointerMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const rotateY = ((x / rect.width) - 0.5) * 12;
    const rotateX = ((y / rect.height) - 0.5) * -12;
    setRotate({ x: rotateX, y: rotateY });
  };

  return (
    <Component
      className={`group relative overflow-hidden rounded-md border border-white/10 bg-white/[0.045] shadow-[0_18px_60px_rgba(0,0,0,0.28)] backdrop-blur-xl ${className}`}
      style={{ transformStyle: 'preserve-3d' }}
      animate={{ rotateX: rotate.x, rotateY: rotate.y }}
      transition={{ type: 'spring', stiffness: 180, damping: 18, mass: 0.6 }}
      onPointerMove={handlePointerMove}
      onPointerLeave={() => setRotate({ x: 0, y: 0 })}
      whileHover={{ y: -4 }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(circle at 35% 15%, ${glow}, transparent 42%)`,
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.12),transparent_35%,rgba(255,255,255,0.04))]" />
      <div className="relative" style={{ transform: 'translateZ(24px)' }}>
        {children}
      </div>
    </Component>
  );
}
