export interface Photo {
  id: string;
  url: string;
  caption: string;
  date?: string;
  isCustom?: boolean;
}

export interface TimelineEvent {
  id: string;
  title: string;
  date: string;
  description: string;
  category: 'firsts' | 'trips' | 'milestones' | 'daily';
  emoji: string;
}

export interface LoveNote {
  id: string;
  sender: string;
  content: string;
  createdAt: string;
  color: 'pink' | 'red' | 'rose' | 'coral';
}

export interface TimerConfig {
  targetDate: string;
  title: string;
}
