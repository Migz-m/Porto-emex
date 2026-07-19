import { useState, useEffect } from 'react';
import { Calendar, Heart, Pencil, Check, X, Flame } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { TimerConfig } from '../types';

export default function Countdown() {
  // Default to a date about 1 year in the past so the "Days Together" mode displays beautifully immediately,
  // but allow customization!
  const defaultDate = '2025-07-18'; // exactly 1 year ago relative to current local time July 2026!
  const [config, setConfig] = useState<TimerConfig>(() => {
    const saved = localStorage.getItem('anniversary_timer');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return {
      targetDate: defaultDate,
      title: 'Our Beautiful Journey',
    };
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(config.title);
  const [editDate, setEditDate] = useState(config.targetDate);

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isPast: false,
  });

  // Save config changes
  const handleSave = () => {
    const updated = { targetDate: editDate, title: editTitle };
    setConfig(updated);
    localStorage.setItem('anniversary_timer', JSON.stringify(updated));
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditTitle(config.title);
    setEditDate(config.targetDate);
    setIsEditing(false);
  };

  // Calculate time difference
  useEffect(() => {
    const calculateTime = () => {
      const now = new Date().getTime();
      const target = new Date(config.targetDate).getTime();
      const difference = target - now;

      const isPast = difference < 0;
      const absoluteDiff = Math.abs(difference);

      const days = Math.floor(absoluteDiff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((absoluteDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((absoluteDiff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((absoluteDiff % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, isPast });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [config]);

  // Visual helper for values
  const timeUnits = [
    { label: 'Days', value: timeLeft.days, color: 'text-white bg-white/5 border-white/10' },
    { label: 'Hours', value: timeLeft.hours, color: 'text-rose-300 bg-white/5 border-white/10' },
    { label: 'Minutes', value: timeLeft.minutes, color: 'text-pink-300 bg-white/5 border-white/10' },
    { label: 'Seconds', value: timeLeft.seconds, color: 'text-rose-200 bg-white/5 border-white/10' },
  ];

  return (
    <div id="countdown-timer-card" className="relative immersive-card rounded-3xl p-6 md:p-8 overflow-hidden max-w-2xl mx-auto shadow-2xl">
      {/* Decorative soft glowing ornaments in corners */}
      <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-rose-500/10 to-transparent rounded-br-full pointer-events-none" />
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-pink-500/10 to-transparent rounded-bl-full pointer-events-none" />

      <div className="relative z-10">
        <AnimatePresence mode="wait">
          {!isEditing ? (
            <motion.div
              key="display-mode"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-center"
            >
              <div className="flex justify-center items-center gap-2 mb-2">
                <Heart className="w-5 h-5 text-rose-500 animate-pulse fill-rose-500" />
                <span className="text-xs uppercase tracking-[0.3em] text-rose-300 font-bold font-sans">
                  {timeLeft.isPast ? 'Celebrating Our Love' : 'Anniversary Countdown'}
                </span>
                <Heart className="w-5 h-5 text-rose-500 animate-pulse fill-rose-500" />
              </div>

              <h2 className="text-2xl md:text-3xl font-serif text-white font-bold mb-4 flex items-center justify-center gap-3">
                {config.title}
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-1.5 rounded-full hover:bg-white/10 text-rose-200 hover:text-rose-400 transition-colors cursor-pointer"
                  title="Edit anniversary date"
                >
                  <Pencil className="w-4 h-4" />
                </button>
              </h2>

              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-rose-200 text-sm font-medium mb-8">
                <Calendar className="w-4 h-4 text-rose-400" />
                {new Date(config.targetDate).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </div>

              {/* Huge counter layout */}
              <div className="grid grid-cols-4 gap-3 md:gap-4 max-w-md mx-auto mb-6">
                {timeUnits.map((unit) => (
                  <div key={unit.label} className="flex flex-col items-center">
                    <div className={`w-full aspect-square flex items-center justify-center rounded-2xl md:rounded-3xl border shadow-lg backdrop-blur-md ${unit.color}`}>
                      <span className="text-2xl md:text-4xl font-serif font-bold tracking-tight">
                        {String(unit.value).padStart(2, '0')}
                      </span>
                    </div>
                    <span className="text-[10px] md:text-xs font-bold text-rose-300/70 uppercase tracking-widest mt-2 font-sans">
                      {unit.label}
                    </span>
                  </div>
                ))}
              </div>

              <div className="text-center">
                <p className="text-rose-200/80 text-sm md:text-base italic font-serif">
                  {timeLeft.isPast ? (
                    <span className="flex items-center justify-center gap-2 text-rose-300 font-semibold">
                      <Flame className="w-4 h-4 fill-rose-500 text-rose-500 animate-bounce" />
                      {timeLeft.days} days of laughter, support, and growing together!
                    </span>
                  ) : (
                    `Only ${timeLeft.days} more sleeps until our special milestone day!`
                  )}
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="edit-mode"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white/5 backdrop-blur-lg p-4 md:p-6 rounded-2xl border border-white/10 shadow-inner"
            >
              <h3 className="text-lg font-serif font-bold text-white mb-4 flex items-center gap-2">
                <Calendar className="text-rose-500 w-5 h-5" /> Customize Your Milestone
              </h3>

              <div className="space-y-4 text-left">
                <div>
                  <label className="block text-xs font-bold text-rose-300 uppercase tracking-wider mb-1 font-sans">
                    Milestone / Title Name
                  </label>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full px-4 py-2 bg-black/30 rounded-lg border border-white/10 focus:outline-none focus:ring-2 focus:ring-rose-500 text-white font-medium"
                    placeholder="e.g., Our Beautiful Journey"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-rose-300 uppercase tracking-wider mb-1 font-sans">
                    Select Anniversary Date
                  </label>
                  <input
                    type="date"
                    value={editDate}
                    onChange={(e) => setEditDate(e.target.value)}
                    className="w-full px-4 py-2 bg-black/30 rounded-lg border border-white/10 focus:outline-none focus:ring-2 focus:ring-rose-500 text-white font-medium [color-scheme:dark]"
                  />
                  <p className="text-[11px] text-rose-300/60 mt-1 italic">
                    💡 Select a past date to count how long you have been together, or a future date to count down!
                  </p>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 rounded-lg border border-white/10 bg-white/5 text-rose-200 hover:bg-white/10 text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" /> Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white text-xs font-bold flex items-center gap-1 shadow-md shadow-rose-950/50 transition-all cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" /> Save Changes
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
