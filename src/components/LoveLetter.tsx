import { useState, useEffect } from 'react';
import { Mail, MailOpen, Edit, Heart, ChevronDown, Check, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { LoveNote } from '../types';

export default function LoveLetter() {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const templates = [
    {
      id: 'template-1',
      sender: 'Your Partner',
      title: 'Forever Yours (Devoted)',
      content: "To My Absolute Favorite Person,\n\nHappy Anniversary! There are no words in the universe that can fully explain how incredibly grateful I am to have you by my side. You have brought so much light, comfort, and sweet laughter into my life, turning every ordinary day into a beautiful adventure.\n\nThank you for loving me for exactly who I am, for supporting my dreams, and for holding my hand through life's twists and turns. Every single morning I wake up feeling like the luckiest person alive because I get to love you.\n\nI cherish every laugh, every quiet evening, and every memory we share. Here is to us, to our beautiful story, and to a lifetime of more milestones together.\n\nAll my love, forever and always.",
    },
    {
      id: 'template-2',
      sender: 'Your Partner',
      title: 'Playful & Cozy',
      content: "Hey Sweetheart!\n\nCan you believe we've made it to another anniversary? Time seriously flies when you're hanging out with your favorite human! Thank you for being the perfect partner-in-crime, the best movie cuddler, the master chef (or takeout-ordering specialist), and my absolute best friend.\n\nI love all our inside jokes, our weird conversations at 2 AM, and the way you can make me smile even when I'm having a rough day. Life with you is just incredibly fun, warm, and sweet.\n\nHappy Anniversary, cutie. Let's eat some delicious cake, take silly photos, and create even more ridiculous memories today!\n\nLove you tons!",
    },
    {
      id: 'template-3',
      sender: 'Your Partner',
      title: 'A Dream Come True',
      content: "My Dearest,\n\nBefore you came into my life, I used to wonder if true love was just something written in books or painted on cinema screens. But from the moment we started our journey together, you showed me a love that is real, gentle, and infinitely patient.\n\nThank you for being my safe harbor. You are the peace in my stormy weather, the melody in my silence, and the dream I never want to wake up from. With you, I am home.\n\nEvery day with you is a gift, and I cannot wait to write the rest of our beautiful chapters together.\n\nWith all my heart.",
    },
  ];

  const [activeNote, setActiveNote] = useState<LoveNote>(() => {
    const saved = localStorage.getItem('anniversary_letter');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {
      id: 'letter-custom',
      sender: 'Your Partner',
      content: templates[0].content,
      createdAt: new Date().toLocaleDateString(),
      color: 'pink',
    };
  });

  const [editText, setEditText] = useState(activeNote.content);
  const [editSender, setEditSender] = useState(activeNote.sender);
  const [selectedTemplate, setSelectedTemplate] = useState('template-1');

  // Save changes
  const handleSave = () => {
    const updated: LoveNote = {
      ...activeNote,
      content: editText,
      sender: editSender,
    };
    setActiveNote(updated);
    localStorage.setItem('anniversary_letter', JSON.stringify(updated));
    setIsEditing(false);
  };

  const handleApplyTemplate = (id: string) => {
    const template = templates.find((t) => t.id === id);
    if (template) {
      setEditText(template.content);
      setSelectedTemplate(id);
    }
  };

  return (
    <div id="love-letter-section" className="py-6 max-w-xl mx-auto text-center relative">
      <div className="mb-4">
        <h2 className="text-3xl font-serif text-white font-bold mb-1 flex items-center justify-center gap-2">
          <MailOpen className="text-rose-500 w-7 h-7" /> The Love Letter
        </h2>
        <p className="text-xs text-rose-300 italic font-serif">
          Click the envelope to read or customize our special letter
        </p>
      </div>

      <div className="relative py-12 flex justify-center items-center min-h-[360px]">
        {/* ENVELOPE / LETTER WRAPPER */}
        <AnimatePresence mode="wait">
          {!isOpen ? (
            /* CLOSED ENVELOPE */
            <motion.div
              key="envelope-closed"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={() => setIsOpen(true)}
              className="relative w-80 h-52 bg-gradient-to-br from-rose-900 to-red-950 rounded-2xl shadow-2xl hover:shadow-rose-500/10 hover:scale-105 cursor-pointer flex flex-col justify-center items-center text-white border border-rose-500/30 transition-all overflow-hidden group"
            >
              {/* Envelope flap aesthetic design */}
              <div className="absolute top-0 left-0 right-0 h-1/2 bg-rose-800/80 rounded-b-full shadow-inner transform scale-y-75 origin-top group-hover:scale-y-90 transition-transform duration-300" />

              <div className="relative z-10 flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-2 animate-bounce">
                  <Mail className="w-8 h-8 text-white" />
                </div>
                <span className="font-fancy text-2xl font-bold">Open Me</span>
                <span className="text-[10px] uppercase tracking-widest text-pink-100 font-sans mt-1">
                  Click to open letter
                </span>
              </div>

              {/* Heart Seal */}
              <div className="absolute bottom-4 right-4 text-white/10">
                <Heart className="w-16 h-16 fill-current" />
              </div>
            </motion.div>
          ) : (
            /* OPEN LETTER */
            <motion.div
              key="envelope-open"
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className="immersive-card rounded-3xl p-6 md:p-8 w-full shadow-2xl relative text-left"
            >
              {/* Heart Seal decoration */}
              <div className="absolute top-4 right-4 flex gap-1">
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-full hover:bg-white/10 text-rose-300 hover:text-white cursor-pointer text-xs font-semibold flex items-center gap-1 border border-white/10 font-sans"
                >
                  Close Letter
                </button>
              </div>

              {/* Form or Note content */}
              {!isEditing ? (
                <div>
                  <div className="flex items-center gap-2 mb-6 border-b border-white/10 pb-4">
                    <Heart className="w-5 h-5 text-rose-500 fill-rose-500 animate-pulse" />
                    <div>
                      <p className="text-xs uppercase tracking-widest text-rose-300/80 font-bold font-sans">Special Note</p>
                      <p className="text-xs text-rose-300 font-medium">From: {activeNote.sender}</p>
                    </div>

                    <button
                      onClick={() => {
                        setEditText(activeNote.content);
                        setEditSender(activeNote.sender);
                        setIsEditing(true);
                      }}
                      className="ml-auto p-1.5 rounded-full hover:bg-white/10 text-rose-300 hover:text-white flex items-center gap-1 transition-all cursor-pointer text-xs font-semibold font-sans border border-white/10"
                    >
                      <Edit className="w-3.5 h-3.5" /> Edit Message
                    </button>
                  </div>

                  <div className="whitespace-pre-line text-rose-100/90 leading-relaxed font-serif text-sm md:text-base italic px-1 md:px-4 max-h-[300px] overflow-y-auto mb-6 pr-2">
                    {activeNote.content}
                  </div>

                  <div className="border-t border-white/10 pt-4 flex justify-between items-center text-xs text-rose-300/60 font-mono">
                    <span>Anniversary Day</span>
                    <span className="flex items-center gap-1 text-rose-300 font-bold font-fancy text-lg">
                      Love Always, {activeNote.sender}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <h3 className="font-serif font-bold text-white flex items-center gap-1 text-base">
                      <Sparkles className="w-4 h-4 text-rose-500" /> Rewrite Love Letter
                    </h3>
                    <span className="text-xs text-rose-300/60">Custom Mode</span>
                  </div>

                  {/* Quick templates pick */}
                  <div>
                    <label className="block text-[10px] font-bold text-rose-300 uppercase tracking-wider mb-1 font-sans">
                      Or Choose a Romantic Preset Template:
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {templates.map((t) => (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => handleApplyTemplate(t.id)}
                          className={`px-3 py-1.5 rounded-lg text-[10px] font-bold cursor-pointer transition-all ${
                            selectedTemplate === t.id
                              ? 'bg-rose-500/30 text-rose-100 border border-rose-500/50'
                              : 'bg-white/5 text-rose-300 hover:bg-white/10 border border-white/10'
                          }`}
                        >
                          {t.title}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Editor */}
                  <div>
                    <label className="block text-[10px] font-bold text-rose-300 uppercase tracking-wider mb-1 font-sans">
                      Your Signature / Name
                    </label>
                    <input
                      type="text"
                      value={editSender}
                      onChange={(e) => setEditSender(e.target.value)}
                      placeholder="e.g., Your Sweetheart"
                      className="w-full px-3 py-2 text-xs bg-black/30 rounded-lg border border-white/10 focus:outline-none focus:ring-2 focus:ring-rose-500 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-rose-300 uppercase tracking-wider mb-1 font-sans">
                      Compose Letter Text
                    </label>
                    <textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      rows={8}
                      className="w-full p-4 text-sm bg-black/30 rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-rose-500 text-white font-serif leading-relaxed"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2 border-t border-white/10">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 rounded-lg border border-white/10 text-rose-300 hover:bg-white/10 text-xs font-semibold cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      className="px-4 py-2 rounded-lg bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white text-xs font-bold flex items-center gap-1 shadow-lg shadow-rose-950/50 cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" /> Save Letter
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
