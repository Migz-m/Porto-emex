import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Heart, Music, Volume2, VolumeX, Sparkles, Star, Gift, Share2, HelpCircle } from 'lucide-react';
import FloatingHearts from './components/FloatingHearts';
import Countdown from './components/Countdown';
import Gallery from './components/Gallery';
import Timeline from './components/Timeline';
import LoveLetter from './components/LoveLetter';
import TriviaQuiz from './components/TriviaQuiz';
import LoveCursor from './components/LoveCursor';
import { romanticSynth } from './utils/audio';

export default function App() {
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [showTip, setShowTip] = useState(true);

  // Toggle ambient romantic chime synthesizer
  const toggleMusic = () => {
    const playing = romanticSynth.toggle();
    setIsPlayingMusic(playing);
  };

  // Clean up synthesizer on unmount
  useEffect(() => {
    return () => {
      romanticSynth.stop();
    };
  }, []);

  // Soft notification helper for share/save
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Our Anniversary Celebration',
        text: 'Come check out our special anniversary memory countdown and photo gallery!',
        url: window.location.href,
      }).catch(() => { /* ignore */ });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('💖 Celebration link copied to clipboard! You can share it with your partner now.');
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-rose-950 via-[#180206] to-stone-950 text-rose-100 pb-20 select-none overflow-hidden">
      {/* Immersive background glowing spot lights */}
      <div className="absolute inset-0 opacity-25 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-red-600 rounded-full blur-[140px] ambient-glow" />
        <div className="absolute bottom-[20%] right-[-10%] w-[600px] h-[600px] bg-rose-500 rounded-full blur-[160px] ambient-glow" style={{ animationDelay: '-6s' }} />
      </div>

      {/* Floating Active & Passive Heart Particles Background */}
      <FloatingHearts />

      {/* Custom Magic Love Cursor & Particles */}
      <LoveCursor />

      {/* FIXED TOP NAVIGATION BAR */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-rose-950/20 border-b border-white/10 px-4 py-3 shadow-lg">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-rose-500 to-pink-500 flex items-center justify-center text-white shadow-md shadow-rose-800/50">
              <Heart className="w-5 h-5 fill-white" />
            </div>
            <div>
              <h1 className="text-sm font-serif font-bold text-white tracking-tight">
                Our Anniversary
              </h1>
              <span className="text-[10px] font-mono text-rose-300">July 18, 2026</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Ambient Synth Controller */}
            <button
              onClick={toggleMusic}
              className={`p-2.5 rounded-full flex items-center gap-2 text-xs font-semibold shadow-md border transition-all cursor-pointer interactive-no-hearts ${
                isPlayingMusic
                  ? 'bg-rose-500 text-white border-rose-600 shadow-rose-950/50 animate-pulse'
                  : 'bg-white/5 hover:bg-white/10 text-rose-300 border-white/10'
              }`}
              title="Toggle Romantic Chime Melody"
            >
              {isPlayingMusic ? (
                <>
                  <Volume2 className="w-4 h-4 animate-bounce" />
                  <span className="hidden sm:inline">Chimes Playing</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-4 h-4" />
                  <span className="hidden sm:inline">Play Ambient Chimes</span>
                </>
              )}
            </button>

            {/* Share / Copy link */}
            <button
              onClick={handleShare}
              className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 text-rose-200 hover:text-white border border-white/10 shadow-xs cursor-pointer interactive-no-hearts"
              title="Share Celebration link"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* TOP DECORATIVE FLOWER ORNAMENT LINE */}
      <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-80" />

      {/* HERO SECTION / LANDING */}
      <section className="max-w-6xl mx-auto px-4 pt-10 md:pt-16 pb-12 text-center relative">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <div className="inline-flex items-center justify-center gap-1 bg-white/5 px-3.5 py-1 rounded-full border border-white/10 mb-4 animate-pulse">
            <Sparkles className="w-3.5 h-3.5 text-rose-400" />
            <span className="text-[10px] md:text-xs font-bold text-rose-300 uppercase tracking-[0.2em] font-sans">
              Our Forever Milestone
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-serif font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-rose-100 to-rose-300 tracking-tight leading-none mb-4">
            Happy Anniversary
          </h1>

          <p className="font-fancy text-4xl md:text-5xl text-rose-300 mt-2">
            to the love of my life
          </p>
        </motion.div>

        {/* COUNTDOWN WIDGET CARD */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-16"
        >
          <Countdown />
        </motion.div>
      </section>

      {/* MAIN STORY & LETTERS SECTION */}
      <section className="max-w-6xl mx-auto px-4 py-8 border-t border-white/10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Timeline of Memories */}
          <motion.div
            initial={{ opacity: 0, x: -25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <Timeline />
          </motion.div>

          {/* Opened Love Letter card */}
          <motion.div
            initial={{ opacity: 0, x: 25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <LoveLetter />
          </motion.div>
        </div>
      </section>

      {/* PHOTO GALLERY SECTION */}
      <section className="max-w-6xl mx-auto px-4 py-12 border-t border-white/10">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Gallery />
        </motion.div>
      </section>

      {/* TRIVIA QUIZ SECTION */}
      <section className="max-w-6xl mx-auto px-4 py-12 border-t border-white/10">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <TriviaQuiz />
        </motion.div>
      </section>

      {/* INTERACTIVE HEART INSTRUCTIONS / TIP POPUP */}
      {showTip && (
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 z-50 max-w-sm">
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="bg-rose-950/80 backdrop-blur-md rounded-2xl p-4 border border-white/10 shadow-2xl flex items-start gap-3 relative overflow-hidden"
          >
            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-rose-400 shrink-0 border border-white/10">
              <Gift className="w-4 h-4 animate-bounce" />
            </div>

            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wide">
                Interactive Magic!
              </h4>
              <p className="text-xs text-rose-200/80 mt-1 leading-normal">
                Try clicking <b>anywhere</b> on the empty screen to spawn a colorful rain of floating hearts!
              </p>
            </div>

            <button
              onClick={() => setShowTip(false)}
              className="p-1 rounded-full hover:bg-white/10 text-rose-300 hover:text-white shrink-0 cursor-pointer"
            >
              &times;
            </button>
          </motion.div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="max-w-6xl mx-auto px-4 pt-16 text-center text-xs text-rose-400/60 font-serif border-t border-white/10">
        <p className="flex items-center justify-center gap-1">
          Made with a million hearts <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" /> &copy; 2026. Happy Anniversary!
        </p>
      </footer>
    </div>
  );
}
