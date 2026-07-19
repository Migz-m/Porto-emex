import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface HeartParticle {
  id: string;
  x: number;
  y: number;
  size: number;
  color: string;
  rotation: number;
  scale: number;
}

export default function FloatingHearts() {
  const [particles, setParticles] = useState<HeartParticle[]>([]);
  const [passiveHearts, setPassiveHearts] = useState<HeartParticle[]>([]);

  // Generate passive background hearts
  useEffect(() => {
    const interval = setInterval(() => {
      if (passiveHearts.length < 15) {
        const colors = ['#f472b6', '#ec4899', '#f43f5e', '#e11d48', '#fda4af', '#ffffff'];
        const newHeart: HeartParticle = {
          id: `passive-${Math.random()}`,
          x: Math.random() * window.innerWidth,
          y: window.innerHeight + 50,
          size: Math.random() * 20 + 10,
          color: colors[Math.floor(Math.random() * colors.length)],
          rotation: Math.random() * 360,
          scale: Math.random() * 0.5 + 0.5,
        };
        setPassiveHearts((prev) => [...prev, newHeart]);
      }
    }, 1500);

    return () => clearInterval(interval);
  }, [passiveHearts]);

  // Clean up old passive hearts that floated off screen
  useEffect(() => {
    const interval = setInterval(() => {
      setPassiveHearts((prev) => prev.filter((h) => h.y > -100));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Listen for screen clicks to spawn active heart bursts
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      // Don't spawn hearts if clicking interactive inputs or buttons
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'BUTTON' ||
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.closest('button') ||
        target.closest('.interactive-no-hearts')
      ) {
        return;
      }

      const colors = ['#f472b6', '#e11d48', '#ffffff', '#fda4af', '#fb7185', '#be123c'];
      const burstSize = 8;
      const newParticles: HeartParticle[] = [];

      for (let i = 0; i < burstSize; i++) {
        const angle = (i / burstSize) * Math.PI * 2 + Math.random() * 0.5;
        const velocity = Math.random() * 100 + 50;
        newParticles.push({
          id: `active-${Date.now()}-${i}-${Math.random()}`,
          x: e.clientX,
          y: e.clientY,
          size: Math.random() * 15 + 10,
          color: colors[Math.floor(Math.random() * colors.length)],
          rotation: Math.random() * 360,
          scale: 1,
        });
      }

      setParticles((prev) => [...prev, ...newParticles]);

      // Remove after animation completes (1.5 seconds)
      setTimeout(() => {
        setParticles((prev) => prev.filter((p) => !newParticles.some((np) => np.id === p.id)));
      }, 1500);
    };

    window.addEventListener('click', handleGlobalClick);
    return () => window.removeEventListener('click', handleGlobalClick);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
      {/* Click-Triggered Active Heart Bursts */}
      <AnimatePresence>
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 1, x: p.x - p.size / 2, y: p.y - p.size / 2, scale: 0 }}
            animate={{
              opacity: 0,
              y: p.y - 120 - Math.random() * 80,
              x: p.x + (Math.random() - 0.5) * 160,
              scale: [0, 1.2, 0.8],
              rotate: p.rotation + (Math.random() - 0.5) * 180,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              width: p.size,
              height: p.size,
              color: p.color,
            }}
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full drop-shadow-md">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Ambient Drifting Background Hearts */}
      {passiveHearts.map((h) => (
        <motion.div
          key={h.id}
          initial={{ opacity: 0, x: h.x, y: h.y }}
          animate={{
            opacity: [0, 0.6, 0.4, 0],
            y: -100,
            x: h.x + Math.sin(h.y / 30) * 40,
            rotate: h.rotation + 180,
          }}
          transition={{
            duration: Math.random() * 8 + 6,
            ease: 'linear',
          }}
          onAnimationComplete={() => {
            // Remove from state
            setPassiveHearts((prev) => prev.filter((ph) => ph.id !== h.id));
          }}
          style={{
            position: 'absolute',
            width: h.size,
            height: h.size,
            color: h.color,
          }}
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full opacity-30">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </motion.div>
      ))}
    </div>
  );
}
