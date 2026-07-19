import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HelpCircle, Award, CheckCircle2, XCircle, RotateCcw, Pencil, Sparkles, Heart, Check, ArrowRight, Settings, Sliders } from 'lucide-react';

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

const defaultQuestions: Question[] = [
  {
    id: 'q1',
    question: "Where did we go on our first official date?",
    options: ["A fancy Italian restaurant", "A cozy local coffee shop", "A peaceful picnic in the park", "The neighborhood cinema"],
    correctAnswerIndex: 1,
    explanation: "It was that sweet little coffee shop! We sat by the window for hours just talking."
  },
  {
    id: 'q2',
    question: "Who said 'I love you' first?",
    options: ["You did!", "I did!", "We blurted it out at the exact same time", "A friend accidentally let it slip first!"],
    correctAnswerIndex: 2,
    explanation: "We said it at the same time under the stars! Talk about telepathy. 💕"
  },
  {
    id: 'q3',
    question: "What is our absolute favorite late-night craving?",
    options: ["Fluffy pancakes", "Cheesy midnight pizza", "Spicy ramen noodles", "Strawberry ice cream tub"],
    correctAnswerIndex: 1,
    explanation: "Pizza always wins! Especially with extra cheese in the middle of the night."
  },
  {
    id: 'q4',
    question: "How long was our very first phone call?",
    options: ["Just a quick 5 minutes", "About an hour or so", "Over 4 hours long!", "We never called, only texted"],
    correctAnswerIndex: 2,
    explanation: "We talked for over 4 hours and forgot about sleep entirely! The connection was instant."
  },
  {
    id: 'q5',
    question: "What is our go-to activity on a lazy rainy Sunday?",
    options: ["Binging Netflix under cozy blankets", "Baking cookies and making a mess", "Battling in intense board games", "Sleeping all afternoon long"],
    correctAnswerIndex: 0,
    explanation: "Under the blankets with Netflix playing in the background is our ultimate happy place."
  }
];

export default function TriviaQuiz() {
  const [questions, setQuestions] = useState<Question[]>(defaultQuestions);
  const [quizState, setQuizState] = useState<'welcome' | 'playing' | 'results' | 'editing'>('welcome');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAns, setSelectedAns] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [answersLog, setAnswersLog] = useState<{ questionIdx: number; selected: number; isCorrect: boolean }[]>([]);

  // Editor states
  const [editingQuestions, setEditingQuestions] = useState<Question[]>(defaultQuestions);
  const [editingIdx, setEditingIdx] = useState(0);

  // Load questions from localstorage
  useEffect(() => {
    const saved = localStorage.getItem('anniversary_trivia_questions');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setQuestions(parsed);
          setEditingQuestions(parsed);
        }
      } catch (e) {
        console.error("Failed to load custom trivia questions", e);
      }
    }
  }, []);

  const handleStartQuiz = () => {
    setCurrentIdx(0);
    setSelectedAns(null);
    setIsSubmitted(false);
    setScore(0);
    setAnswersLog([]);
    setQuizState('playing');
  };

  const handleSelectOption = (idx: number) => {
    if (isSubmitted) return;
    setSelectedAns(idx);
  };

  const handleSubmitAnswer = () => {
    if (selectedAns === null || isSubmitted) return;
    setIsSubmitted(true);
    const correct = selectedAns === questions[currentIdx].correctAnswerIndex;
    if (correct) {
      setScore((prev) => prev + 1);
    }
    setAnswersLog((prev) => [
      ...prev,
      { questionIdx: currentIdx, selected: selectedAns, isCorrect: correct }
    ]);
  };

  const handleNextQuestion = () => {
    if (currentIdx + 1 < questions.length) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedAns(null);
      setIsSubmitted(false);
    } else {
      setQuizState('results');
    }
  };

  // Editor functions
  const handleEditQuestionField = (field: keyof Question, val: any) => {
    const updated = [...editingQuestions];
    updated[editingIdx] = {
      ...updated[editingIdx],
      [field]: val
    };
    setEditingQuestions(updated);
  };

  const handleEditOption = (optIdx: number, val: string) => {
    const updated = [...editingQuestions];
    const opts = [...updated[editingIdx].options];
    opts[optIdx] = val;
    updated[editingIdx] = {
      ...updated[editingIdx],
      options: opts
    };
    setEditingQuestions(updated);
  };

  const handleSaveCustomQuiz = () => {
    setQuestions(editingQuestions);
    localStorage.setItem('anniversary_trivia_questions', JSON.stringify(editingQuestions));
    setQuizState('welcome');
  };

  const handleResetDefaults = () => {
    if (window.confirm("Are you sure you want to restore the default sweet questions?")) {
      setQuestions(defaultQuestions);
      setEditingQuestions(defaultQuestions);
      localStorage.removeItem('anniversary_trivia_questions');
      setQuizState('welcome');
    }
  };

  const getDiplomaText = (finalScore: number) => {
    const ratio = finalScore / questions.length;
    if (ratio === 1) {
      return {
        title: "🏆 Ultimate Soulmate Status",
        desc: "Unbelievable! You remember every single detail perfectly. You two share a truly deep, synchronized connection. Truly meant to be!",
        bg: "from-rose-500/20 to-pink-500/20 border-rose-500/30"
      };
    } else if (ratio >= 0.7) {
      return {
        title: "💖 Certified Sweetheart",
        desc: "So close to perfection! You know almost everything and cherish our beautiful history. Your love is strong, beautiful, and vibrant!",
        bg: "from-rose-500/15 to-pink-500/10 border-rose-400/20"
      };
    } else if (ratio >= 0.4) {
      return {
        title: "🌸 Heartwarming Partner",
        desc: "You did great! Some memories got slightly fuzzy over time, but that's just a wonderful excuse to make new, unforgettable moments together.",
        bg: "from-white/5 to-white/5 border-white/10"
      };
    } else {
      return {
        title: "🧸 Cozy Date Night Recipient",
        desc: "Uh oh! Memory refresh is required! But don't worry, this is the ultimate romantic pass for a long, cozy date night talking about 'Our Story'!",
        bg: "from-amber-500/10 to-rose-500/5 border-amber-500/20"
      };
    }
  };

  return (
    <div id="trivia-quiz-widget" className="relative immersive-card rounded-3xl p-6 md:p-8 overflow-hidden max-w-2xl mx-auto shadow-2xl transition-all duration-300">
      {/* Decorative soft glowing corners */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-rose-500/10 to-transparent rounded-bl-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-pink-500/10 to-transparent rounded-tr-full pointer-events-none" />

      {/* Pulsing Glowing Heart Behind the Content */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden z-0 select-none">
        <motion.div
          animate={{
            scale: [1, 1.15, 1.05, 1.18, 1],
            opacity: [0.03, 0.08, 0.05, 0.09, 0.03],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="w-80 h-80 md:w-96 md:h-96 text-rose-500/20 flex items-center justify-center"
        >
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-full h-full filter blur-[2px] drop-shadow-[0_0_35px_rgba(244,63,94,0.35)]"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </motion.div>

        {/* Small internal floating heart shapes */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              y: 220, 
              x: (i - 2.5) * 80 + (Math.random() - 0.5) * 30, 
              opacity: 0, 
              scale: Math.random() * 0.4 + 0.3 
            }}
            animate={{ 
              y: -220, 
              opacity: [0, 0.15, 0.15, 0], 
              rotate: [0, (Math.random() - 0.5) * 90] 
            }}
            transition={{
              duration: Math.random() * 5 + 6,
              repeat: Infinity,
              delay: i * 1.5,
              ease: "linear"
            }}
            className="absolute text-rose-400"
            style={{ width: '20px', height: '20px' }}
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </motion.div>
        ))}
      </div>

      <div className="relative z-10">
        <AnimatePresence mode="wait">
          {/* WELCOME SCREEN */}
          {quizState === 'welcome' && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-center py-4"
            >
              <div className="flex justify-center items-center gap-2 mb-3">
                <HelpCircle className="w-6 h-6 text-rose-400 animate-pulse" />
                <span className="text-xs uppercase tracking-[0.3em] text-rose-300 font-bold font-sans">
                  Fun & Romance
                </span>
                <HelpCircle className="w-6 h-6 text-rose-400 animate-pulse" />
              </div>

              <h2 className="text-2xl md:text-3xl font-serif text-white font-bold mb-3">
                How Well Do You Know Us?
              </h2>

              <p className="text-xs md:text-sm text-rose-200/80 italic font-serif max-w-lg mx-auto mb-8 leading-relaxed">
                Take a romantic walk down memory lane! Test your knowledge on our special dates, inside jokes, and beautiful firsts.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={handleStartQuiz}
                  className="px-6 py-3 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-semibold text-sm flex items-center gap-2 shadow-lg shadow-rose-950/50 hover:scale-105 transition-all cursor-pointer interactive-no-hearts"
                >
                  <Sparkles className="w-4 h-4" /> Start the Quiz!
                </button>

                <button
                  onClick={() => {
                    setEditingQuestions(JSON.parse(JSON.stringify(questions)));
                    setEditingIdx(0);
                    setQuizState('editing');
                  }}
                  className="px-5 py-3 rounded-full bg-white/5 border border-white/10 text-rose-200 hover:text-white hover:bg-white/10 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer interactive-no-hearts"
                >
                  <Sliders className="w-3.5 h-3.5" /> Customize Questions
                </button>
              </div>
            </motion.div>
          )}

          {/* PLAYING SCREEN */}
          {quizState === 'playing' && (
            <motion.div
              key="playing"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {/* Quiz Header Info */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-rose-300">
                    Question {currentIdx + 1} of {questions.length}
                  </span>
                  <h3 className="text-lg md:text-xl font-serif font-bold text-white mt-1">
                    {questions[currentIdx].question}
                  </h3>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xs font-mono font-bold text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-full border border-rose-500/20">
                    Score: {score}
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-rose-500 to-pink-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentIdx) / questions.length) * 100}%` }}
                  transition={{ duration: 0.4 }}
                />
              </div>

              {/* Options Grid */}
              <div className="grid grid-cols-1 gap-3 pt-2">
                {questions[currentIdx].options.map((option, optIdx) => {
                  let buttonStyle = "bg-white/5 hover:bg-white/10 border-white/10 text-rose-100";
                  
                  if (selectedAns === optIdx) {
                    buttonStyle = "bg-rose-500/20 border-rose-400 text-white shadow-md shadow-rose-950/20";
                  }

                  if (isSubmitted) {
                    if (optIdx === questions[currentIdx].correctAnswerIndex) {
                      buttonStyle = "bg-emerald-500/20 border-emerald-500 text-emerald-200 font-bold";
                    } else if (selectedAns === optIdx) {
                      buttonStyle = "bg-rose-900/30 border-rose-600 text-rose-300/80 line-through";
                    } else {
                      buttonStyle = "bg-white/2 border-white/5 text-rose-100/40";
                    }
                  }

                  return (
                    <button
                      key={optIdx}
                      disabled={isSubmitted}
                      onClick={() => handleSelectOption(optIdx)}
                      className={`w-full px-5 py-4 rounded-xl text-left text-sm font-medium border transition-all flex items-center justify-between cursor-pointer ${buttonStyle}`}
                    >
                      <span>{option}</span>
                      <div className="shrink-0 flex items-center justify-center">
                        {isSubmitted && optIdx === questions[currentIdx].correctAnswerIndex && (
                          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        )}
                        {isSubmitted && selectedAns === optIdx && optIdx !== questions[currentIdx].correctAnswerIndex && (
                          <XCircle className="w-5 h-5 text-rose-500" />
                        )}
                        {!isSubmitted && selectedAns === optIdx && (
                          <div className="w-2.5 h-2.5 rounded-full bg-rose-400 animate-ping" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Explanation note / Next Actions */}
              <AnimatePresence mode="wait">
                {isSubmitted && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`p-4 rounded-xl border text-xs leading-relaxed italic font-serif flex items-start gap-2.5 ${
                      selectedAns === questions[currentIdx].correctAnswerIndex
                        ? 'bg-emerald-950/30 border-emerald-500/20 text-emerald-200'
                        : 'bg-rose-950/30 border-rose-500/20 text-rose-300'
                    }`}
                  >
                    <Heart className="w-4 h-4 shrink-0 text-rose-400 fill-rose-500/30 mt-0.5" />
                    <div>
                      <p className="font-bold font-sans not-italic uppercase tracking-wider text-[10px] mb-1">
                        {selectedAns === questions[currentIdx].correctAnswerIndex ? 'Correct! 🌟' : 'Sweet memory note:'}
                      </p>
                      {questions[currentIdx].explanation}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Action Buttons */}
              <div className="flex justify-end pt-2 border-t border-white/10">
                {!isSubmitted ? (
                  <button
                    disabled={selectedAns === null}
                    onClick={handleSubmitAnswer}
                    className="px-6 py-2.5 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 disabled:from-rose-900/40 disabled:to-pink-900/40 text-white font-bold text-xs flex items-center gap-1.5 shadow-md disabled:opacity-40 transition-all cursor-pointer"
                  >
                    Confirm Answer <Check className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    onClick={handleNextQuestion}
                    className="px-6 py-2.5 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
                  >
                    {currentIdx + 1 < questions.length ? (
                      <>Next Question <ArrowRight className="w-3.5 h-3.5" /></>
                    ) : (
                      <>See Results <Award className="w-3.5 h-3.5" /></>
                    )}
                  </button>
                )}
              </div>
            </motion.div>
          )}

          {/* RESULTS SCREEN */}
          {quizState === 'results' && (
            <motion.div
              key="results"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center py-4 space-y-6"
            >
              <div className="flex justify-center">
                <div className="w-16 h-16 rounded-full bg-rose-500/15 flex items-center justify-center border border-rose-500/20 text-rose-400">
                  <Award className="w-8 h-8" />
                </div>
              </div>

              <div>
                <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-rose-300">
                  Trivia Quiz Completed!
                </span>
                <h2 className="text-3xl font-serif font-black text-white mt-1">
                  Your Score: {score} / {questions.length}
                </h2>
              </div>

              {/* Relationship Diploma Container */}
              {(() => {
                const diploma = getDiplomaText(score);
                return (
                  <div className={`p-6 rounded-2xl border bg-gradient-to-b ${diploma.bg} relative max-w-md mx-auto text-center space-y-3`}>
                    <div className="absolute top-2 right-2 text-rose-500/20">
                      <Heart className="w-16 h-16 fill-current" />
                    </div>
                    <h3 className="font-serif font-bold text-lg text-white">
                      {diploma.title}
                    </h3>
                    <p className="text-xs text-rose-200/90 leading-relaxed italic">
                      "{diploma.desc}"
                    </p>
                  </div>
                );
              })()}

              {/* Action choices */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
                <button
                  onClick={handleStartQuiz}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-md hover:scale-[1.02] transition-all cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Replay Quiz
                </button>

                <button
                  onClick={() => {
                    setEditingQuestions(JSON.parse(JSON.stringify(questions)));
                    setEditingIdx(0);
                    setQuizState('editing');
                  }}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-rose-200 hover:text-white hover:bg-white/10 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <Pencil className="w-3.5 h-3.5" /> Customize Questions
                </button>

                <button
                  onClick={() => setQuizState('welcome')}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-transparent border border-transparent text-rose-300 hover:text-white hover:bg-white/5 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  Close Quiz
                </button>
              </div>
            </motion.div>
          )}

          {/* EDITING / CUSTOMIZATION SCREEN */}
          {quizState === 'editing' && (
            <motion.div
              key="editing"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6 text-left"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="font-serif font-bold text-white flex items-center gap-1.5 text-base">
                  <Settings className="w-4 h-4 text-rose-500" /> Customize Trivia Questions
                </h3>
                <span className="text-xs text-rose-300/60 font-semibold uppercase tracking-wider">
                  Question {editingIdx + 1} of {editingQuestions.length}
                </span>
              </div>

              {/* Simple horizontal selector for which question to edit */}
              <div className="flex justify-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10">
                {editingQuestions.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setEditingIdx(idx)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      editingIdx === idx
                        ? 'bg-rose-500/30 text-rose-100 border border-rose-500/30'
                        : 'text-rose-300 hover:bg-white/5'
                    }`}
                  >
                    Q{idx + 1}
                  </button>
                ))}
              </div>

              {/* Editing Form fields for selected question */}
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-rose-300 uppercase tracking-wider mb-1 font-sans">
                    Question Text
                  </label>
                  <input
                    type="text"
                    value={editingQuestions[editingIdx].question}
                    onChange={(e) => handleEditQuestionField('question', e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-white/10 focus:outline-none focus:ring-2 focus:ring-rose-500 bg-black/30 text-white font-medium text-xs"
                    placeholder="e.g. Where did we first hold hands?"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-rose-300 uppercase tracking-wider font-sans">
                    Multiple Choice Options (Select correct radio)
                  </label>
                  {editingQuestions[editingIdx].options.map((option, optIdx) => (
                    <div key={optIdx} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name={`correct-option-${editingIdx}`}
                        checked={editingQuestions[editingIdx].correctAnswerIndex === optIdx}
                        onChange={() => handleEditQuestionField('correctAnswerIndex', optIdx)}
                        className="w-4 h-4 accent-rose-500 border-white/10 cursor-pointer shrink-0"
                        title="Mark as correct answer"
                      />
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => handleEditOption(optIdx, e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg border border-white/10 focus:outline-none focus:ring-1 focus:ring-rose-500 bg-black/30 text-white text-xs font-medium"
                        placeholder={`Option ${optIdx + 1}`}
                      />
                    </div>
                  ))}
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-rose-300 uppercase tracking-wider mb-1 font-sans">
                    Sweet explanation / Story Note (revealed after answering)
                  </label>
                  <textarea
                    value={editingQuestions[editingIdx].explanation}
                    onChange={(e) => handleEditQuestionField('explanation', e.target.value)}
                    rows={2}
                    className="w-full px-4 py-2 rounded-lg border border-white/10 focus:outline-none focus:ring-2 focus:ring-rose-500 bg-black/30 text-white text-xs font-serif leading-relaxed"
                    placeholder="Tell the story or explain the right answer..."
                  />
                </div>
              </div>

              {/* Editor controls footer */}
              <div className="flex justify-between items-center pt-3 border-t border-white/10 text-xs">
                <button
                  type="button"
                  onClick={handleResetDefaults}
                  className="text-rose-400 hover:text-rose-300 cursor-pointer text-xs underline decoration-dotted"
                >
                  Reset defaults
                </button>

                <div className="flex gap-2">
                  <button
                    onClick={() => setQuizState('welcome')}
                    className="px-4 py-2 rounded-lg border border-white/10 text-rose-300 hover:bg-white/10 text-xs font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={handleSaveCustomQuiz}
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white text-xs font-bold shadow-lg shadow-rose-950/50 cursor-pointer flex items-center gap-1"
                  >
                    <Check className="w-3.5 h-3.5" /> Save Quiz
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
