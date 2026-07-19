import { useState, useEffect, FormEvent } from 'react';
import { Heart, Plus, Calendar, Star, MapPin, Trash2, Milestone, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { TimelineEvent } from '../types';

export default function Timeline() {
  const defaultEvents: TimelineEvent[] = [
    {
      id: 'event-1',
      title: 'Our First Meeting',
      date: '2024-04-12',
      description: 'The universe aligned and our eyes locked. We ended up talking for hours about absolutely everything, losing track of all time.',
      category: 'firsts',
      emoji: '✨',
    },
    {
      id: 'event-2',
      title: 'Our First Date',
      date: '2024-04-20',
      description: 'A cozy coffee spot that led to a walk in the park. Spilled coffee, goofy laughs, and the distinct feeling that this was the beginning of something beautiful.',
      category: 'firsts',
      emoji: '☕',
    },
    {
      id: 'event-3',
      title: 'First Trip Together',
      date: '2024-10-05',
      description: 'A weekend cabin getaway. Watching the autumn leaves drift down, roasting marshmallows by the fire, and getting lost in the woods together.',
      category: 'trips',
      emoji: '⛰️',
    },
    {
      id: 'event-4',
      title: 'The Sweet Confession',
      date: '2024-11-23',
      description: 'Underneath the soft glow of streetlights, the words "I love you" finally found their way into the cold night air. The warmest hug followed.',
      category: 'milestones',
      emoji: '💖',
    },
  ];

  const [events, setEvents] = useState<TimelineEvent[]>(() => {
    const saved = localStorage.getItem('anniversary_timeline');
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as TimelineEvent[];
        const customs = parsed.filter(e => !defaultEvents.some(de => de.id === e.id));
        return [...defaultEvents, ...customs];
      } catch (e) {
        return defaultEvents;
      }
    }
    return defaultEvents;
  });

  const [activeTab, setActiveTab] = useState<'all' | 'firsts' | 'trips' | 'milestones' | 'daily'>('all');
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState<'firsts' | 'trips' | 'milestones' | 'daily'>('milestones');
  const [newEmoji, setNewEmoji] = useState('💕');

  // Persist only custom events to localStorage
  useEffect(() => {
    const customEvents = events.filter(e => !defaultEvents.some(de => de.id === e.id));
    localStorage.setItem('anniversary_timeline', JSON.stringify(customEvents));
  }, [events]);

  const handleAddEvent = (e: FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newDate || !newDesc) return;

    const added: TimelineEvent = {
      id: `custom-event-${Date.now()}`,
      title: newTitle,
      date: newDate,
      description: newDesc,
      category: newCategory,
      emoji: newEmoji,
    };

    setEvents(prev => [...prev, added]);
    setNewTitle('');
    setNewDate('');
    setNewDesc('');
    setNewEmoji('💕');
    setIsAdding(false);
  };

  const handleDeleteEvent = (id: string) => {
    if (confirm('Do you want to delete this timeline memory?')) {
      setEvents(prev => prev.filter(e => e.id !== id));
    }
  };

  // Sort events chronologically (newest to oldest or vice versa)
  const sortedEvents = [...events].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Filter events
  const filteredEvents = sortedEvents.filter(e => activeTab === 'all' || e.category === activeTab);

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'firsts': return 'bg-rose-500/20 text-rose-200 border-rose-500/35';
      case 'trips': return 'bg-amber-500/20 text-amber-200 border-amber-500/35';
      case 'milestones': return 'bg-pink-500/20 text-pink-200 border-pink-500/35';
      default: return 'bg-sky-500/20 text-sky-200 border-sky-500/35';
    }
  };

  return (
    <div id="memory-timeline-section" className="py-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-serif text-white font-bold mb-1 flex items-center justify-center sm:justify-start gap-2">
            <Milestone className="text-rose-500 w-7 h-7" /> Our Story Road
          </h2>
          <p className="text-xs text-rose-300 italic font-serif">
            A chronological timeline of special moments, trips, and beautiful days
          </p>
        </div>

        <button
          onClick={() => setIsAdding(true)}
          className="px-5 py-2.5 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-semibold text-sm flex items-center gap-2 shadow-lg shadow-rose-950/50 hover:scale-[1.03] transition-all cursor-pointer interactive-no-hearts"
        >
          <Plus className="w-4 h-4" /> Add a Timeline Milestone
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap justify-center gap-2 mb-8 bg-white/5 p-1.5 rounded-2xl border border-white/10 max-w-xl mx-auto backdrop-blur-md">
        {(['all', 'firsts', 'trips', 'milestones', 'daily'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold capitalize cursor-pointer transition-all ${
              activeTab === tab
                ? 'bg-rose-500/25 text-rose-100 border border-rose-500/40 shadow-inner'
                : 'text-rose-300 hover:text-white hover:bg-white/5'
            }`}
          >
            {tab === 'all' ? 'All Memories' : tab}
          </button>
        ))}
      </div>

      {/* Vertical Timeline Tree */}
      <div className="relative max-w-3xl mx-auto px-4 py-4">
        {/* Central Vertical Line */}
        <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-rose-500/20 via-pink-500 to-rose-500/20 transform md:-translate-x-1/2" />

        {/* Empty State */}
        {filteredEvents.length === 0 && (
          <div className="text-center py-12 bg-white/5 rounded-3xl border border-white/10 shadow-sm max-w-lg mx-auto">
            <Star className="w-8 h-8 text-rose-400 mx-auto mb-2 animate-bounce" />
            <p className="font-serif text-rose-200 italic">No milestones saved in this category yet.</p>
          </div>
        )}

        {/* Timeline Items */}
        <div className="space-y-12">
          {filteredEvents.map((event, index) => {
            const isLeft = index % 2 === 0;
            return (
              <div
                key={event.id}
                className={`flex flex-col md:flex-row relative items-start md:items-center ${
                  isLeft ? 'md:flex-row-reverse' : ''
                }`}
              >
                {/* Central Circle Node */}
                <div className="absolute left-6 md:left-1/2 w-6 h-6 rounded-full bg-stone-900 border-4 border-rose-500 flex items-center justify-center transform -translate-x-1/2 z-20 shadow-lg shadow-rose-950/50">
                  <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                </div>

                {/* Content block */}
                <div className={`w-full md:w-1/2 pl-12 md:pl-0 ${isLeft ? 'md:pr-12' : 'md:pl-12'}`}>
                  <motion.div
                    initial={{ opacity: 0, x: isLeft ? -20 : 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="immersive-card p-6 rounded-2xl shadow-xl relative group hover:border-white/20 transition-all duration-300"
                  >
                    {/* Emoji badge */}
                    <div className="absolute -top-4 -right-2 bg-white/10 backdrop-blur-md rounded-full w-10 h-10 flex items-center justify-center text-xl shadow-lg border border-white/10">
                      {event.emoji}
                    </div>

                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border capitalize ${getCategoryColor(event.category)}`}>
                        {event.category}
                      </span>
                      <span className="text-xs text-rose-300/80 font-mono font-medium flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-rose-400" />
                        {new Date(event.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white font-serif mb-2 group-hover:text-rose-200 transition-colors">
                      {event.title}
                    </h3>
                    <p className="text-rose-100/90 text-xs md:text-sm leading-relaxed italic">
                      "{event.description}"
                    </p>

                    {/* Delete Custom Event Button */}
                    {!defaultEvents.some(de => de.id === event.id) && (
                      <button
                        onClick={() => handleDeleteEvent(event.id)}
                        className="absolute bottom-4 right-4 p-1.5 rounded-full hover:bg-white/10 text-rose-400 hover:text-rose-300 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        title="Delete this milestone"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </motion.div>
                </div>

                {/* Empty block for layout alignment on desktop */}
                <div className="hidden md:block w-1/2" />
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Timeline Event Modal */}
      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-rose-950/90 backdrop-blur-xl rounded-3xl p-6 max-w-md w-full border border-white/10 shadow-2xl relative text-rose-100"
            >
              <button
                onClick={() => setIsAdding(false)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 text-rose-300 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-xl font-serif font-bold text-white mb-4 flex items-center gap-2">
                <Heart className="text-rose-500 w-5 h-5" /> Add New Milestone
              </h3>

              <form onSubmit={handleAddEvent} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-rose-300 uppercase tracking-wider mb-1 font-sans">
                    Milestone Title
                  </label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Our First Romantic Roadtrip"
                    className="w-full px-4 py-2 rounded-lg border border-white/10 focus:outline-none focus:ring-2 focus:ring-rose-500 bg-black/30 text-white font-medium"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-rose-300 uppercase tracking-wider mb-1 font-sans">
                      Date Occurred
                    </label>
                    <input
                      type="date"
                      required
                      value={newDate}
                      onChange={(e) => setNewDate(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-white/10 focus:outline-none focus:ring-2 focus:ring-rose-500 bg-black/30 text-white font-medium text-xs [color-scheme:dark]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-rose-300 uppercase tracking-wider mb-1 font-sans">
                      Milestone Category
                    </label>
                    <select
                      value={newCategory}
                      onChange={(e: any) => setNewCategory(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-white/10 focus:outline-none focus:ring-2 focus:ring-rose-500 bg-black/30 text-white font-medium text-xs [color-scheme:dark]"
                    >
                      <option value="firsts">Firsts</option>
                      <option value="trips">Trips & Travels</option>
                      <option value="milestones">Key Milestones</option>
                      <option value="daily">Daily Life / Fun</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-rose-300 uppercase tracking-wider mb-1 font-sans">
                      Emoji Icon
                    </label>
                    <select
                      value={newEmoji}
                      onChange={(e) => setNewEmoji(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-white/10 focus:outline-none focus:ring-2 focus:ring-rose-500 bg-black/30 text-white font-medium text-sm [color-scheme:dark]"
                    >
                      <option value="💕">💕 Hearts</option>
                      <option value="✨">✨ Sparkles</option>
                      <option value="☕">☕ Coffee/Dates</option>
                      <option value="⛰️">⛰️ Travel/Hikes</option>
                      <option value="🍕">🍕 Dinner/Food</option>
                      <option value="💍">💍 Proposal/Ring</option>
                      <option value="🎉">🎉 Celebration/Party</option>
                      <option value="🏡">🏡 Living/Home</option>
                      <option value="🐾">🐾 Pets/Animals</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-rose-300 uppercase tracking-wider mb-1 font-sans">
                    Description / Story
                  </label>
                  <textarea
                    required
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    rows={3}
                    placeholder="Describe how it felt, what happened, or special details you want to remember..."
                    className="w-full px-4 py-2 rounded-lg border border-white/10 focus:outline-none focus:ring-2 focus:ring-rose-500 bg-black/30 text-white font-medium text-sm"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAdding(false)}
                    className="px-4 py-2 rounded-lg border border-white/10 text-rose-300 hover:bg-white/10 text-xs font-semibold cursor-pointer"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white text-xs font-bold shadow-lg shadow-rose-950/50 cursor-pointer"
                  >
                    Add Milestone
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
