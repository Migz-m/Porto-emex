import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface TrailParticle {
  id: string;
  x: number;
  y: number;
  size: number;
  color: string;
  rotation: number;
}

export default function LoveCursor() {
  const [particles, setParticles] = useState<TrailParticle[]>([]);
  const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
  const [isVisible, setIsVisible] = useState(false);
  const lastPosRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);

      const dx = e.clientX - lastPosRef.current.x;
      const dy = e.clientY - lastPosRef.current.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Only spawn a trailing heart if mouse has moved a threshold distance
      if (distance > 35) {
        lastPosRef.current = { x: e.clientX, y: e.clientY };

        const colors = ['#f43f5e', '#f472b6', '#fda4af', '#ec4899', '#ffffff'];
        const newParticle: TrailParticle = {
          id: `trail-${Date.now()}-${Math.random()}`,
          x: e.clientX,
          y: e.clientY,
          size: Math.random() * 10 + 6,
          color: colors[Math.floor(Math.random() * colors.length)],
          rotation: Math.random() * 360,
        };

        setParticles((prev) => [...prev.slice(-15), newParticle]);
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.body.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.body.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isVisible]);

  // Clean up stale particles
  useEffect(() => {
    const interval = setInterval(() => {
      if (particles.length > 0) {
        setParticles((prev) => prev.slice(1));
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [particles]);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {/* 1. Trailing Heart Particles */}
      <AnimatePresence>
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 1, scale: 1, x: p.x - p.size / 2, y: p.y - p.size / 2, rotate: p.rotation }}
            animate={{
              opacity: 0,
              scale: 0.2,
              y: p.y - 40 - Math.random() * 30, // drift upward
              x: p.x + (Math.random() - 0.5) * 20, // drift sideways
              rotate: p.rotation + 90,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              width: p.size,
              height: p.size,
              color: p.color,
            }}
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full drop-shadow-[0_2px_4px_rgba(244,63,94,0.3)]">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* 2. Custom Glowing Cursor Follower (only visible on pointer-device screens) */}
      {isVisible && (
        <div
          className="hidden md:block absolute w-5 h-5 transition-transform duration-[0.08s] ease-out pointer-events-none"
          style={{
            transform: `translate3d(${mousePos.x + 8}px, ${mousePos.y + 8}px, 0)`,
          }}
        >
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-full h-full text-rose-400 drop-shadow-[0_2px_8px_rgba(244,63,94,0.6)] animate-pulse"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </div>
      )}
    </div>
  );
}
