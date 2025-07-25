export interface Question {
  id: string;
  type: 'multiple-choice' | 'short-answer' | 'long-answer' | 'true-false';
  question: string;
  options?: string[];
  correctAnswer?: string;
  marks: number;
  difficulty: 'easy' | 'medium' | 'hard';
  topic: string;
  section?: string;
}

export interface QuestionPaper {
  id: string;
  title: string;
  subject: string;
  duration: number;
  totalMarks: number;
  questions: Question[];
  instructions: string[];
  createdAt: Date;
}

export interface GenerationConfig {
  questionTypes: string[];
  difficulty: string[];
  marksDistribution: (number | string)[];
  totalQuestions: number | string;
  totalMarks: number | string;
  duration: number | string;
  subject: string;
  sections: Section[];
}

export interface Section {
  id: string;
  name: string;
  questionTypes: string[];
  marks: number | string;
  questionCount: number;
  difficulty: string[];
}