// A sweet, simple romantic music synthesizer using the Web Audio API.
// Plays a soft, music-box-like chord arpeggio with safe initialization on user click.

class RomanticSynth {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private intervalId: any = null;
  private tempo = 120; // BPM
  private currentStep = 0;

  // Romantic chord progression: Cmaj7 - Em7 - Am7 - Fmaj7
  private chords = [
    [261.63, 329.63, 392.00, 493.88], // Cmaj7 (C4, E4, G4, B4)
    [329.63, 392.00, 493.88, 587.33], // Em7 (E4, G4, B4, D5)
    [220.00, 329.63, 392.00, 440.00], // Am7 (A3, E4, G4, A4)
    [174.61, 261.63, 349.23, 440.00], // Fmaj7 (F3, C4, F4, A4)
  ];

  constructor() {}

  private init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggle(): boolean {
    this.init();
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.play();
      return true;
    }
  }

  private play() {
    if (this.isPlaying) return;
    this.isPlaying = true;
    this.currentStep = 0;

    const stepTime = 60 / this.tempo / 2; // Eighth notes
    let nextNoteTime = this.ctx!.currentTime;

    const scheduleNextNotes = () => {
      while (nextNoteTime < this.ctx!.currentTime + 0.1) {
        this.playNoteAtTime(nextNoteTime);
        nextNoteTime += stepTime;
        this.currentStep = (this.currentStep + 1) % 16;
      }
    };

    // Poll to schedule
    this.intervalId = setInterval(scheduleNextNotes, 50);
  }

  private playNoteAtTime(time: number) {
    if (!this.ctx) return;

    // Determine current chord (each chord lasts 4 steps = 2 beats)
    const chordIndex = Math.floor(this.currentStep / 4) % this.chords.length;
    const chord = this.chords[chordIndex];

    // Pick note from chord based on step pattern
    // Elegant arpeggio pattern: 0, 1, 2, 3, 2, 1, 3, 0...
    const notePattern = [0, 1, 2, 3, 2, 1, 3, 1, 0, 2, 1, 3, 2, 0, 3, 2];
    const noteIndex = notePattern[this.currentStep];
    const freq = chord[noteIndex % chord.length];

    // Main oscillator for music box sound
    const osc = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();

    // Soft chime-like triangle wave
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, time);

    // Filter to make it warmer
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1500, time);

    osc.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.ctx.destination);

    // Chime envelope: Fast attack, long decay/release
    gainNode.gain.setValueAtTime(0, time);
    gainNode.gain.linearRampToValueAtTime(0.15, time + 0.02); // gentle volume
    gainNode.gain.exponentialRampToValueAtTime(0.0001, time + 1.2); // ring out

    osc.start(time);
    osc.stop(time + 1.2);
  }

  public stop() {
    this.isPlaying = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }
}

export const romanticSynth = new RomanticSynth();
export default romanticSynth;
