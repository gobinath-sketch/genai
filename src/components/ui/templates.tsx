import React from 'react';
import { BookOpen, Calculator, TestTube, Globe, Music, Palette, Code, Book } from 'lucide-react';
import { GenerationConfig, Section } from '../types';

export interface Template {
  id: string;
  name: string;
  subject: string;
  icon: React.ReactNode;
  description: string;
  config: Partial<GenerationConfig>;
  sections?: Partial<Section>[];
}

export const templates: Template[] = [
  {
    id: 'math-basic',
    name: 'Basic Mathematics',
    subject: 'Mathematics',
    icon: <Calculator className="w-6 h-6" />,
    description: 'Standard math questions with calculations and problem-solving',
    config: {
      questionTypes: ['multiple-choice', 'short-answer', 'long-answer'],
      difficulty: ['easy', 'medium', 'hard'],
      marksDistribution: [2, 4, 5, 6, 8, 10],
      totalQuestions: 20,
      totalMarks: 100,
      duration: 120,
      subject: 'Mathematics'
    },
    sections: [
      {
        name: 'Section A',
        questionTypes: ['multiple-choice'],
        marks: 2,
        questionCount: 10,
        difficulty: ['easy', 'medium']
      },
      {
        name: 'Section B',
        questionTypes: ['short-answer'],
        marks: 5,
        questionCount: 6,
        difficulty: ['medium']
      },
      {
        name: 'Section C',
        questionTypes: ['long-answer'],
        marks: 10,
        questionCount: 4,
        difficulty: ['hard']
      }
    ]
  },
  {
    id: 'science-physics',
    name: 'Physics',
    subject: 'Physics',
    icon: <TestTube className="w-6 h-6" />,
    description: 'Physics questions with numerical problems and theoretical concepts',
    config: {
      questionTypes: ['multiple-choice', 'short-answer', 'long-answer'],
      difficulty: ['easy', 'medium', 'hard'],
      marksDistribution: [2, 4, 5, 6, 8, 10],
      totalQuestions: 25,
      totalMarks: 100,
      duration: 150,
      subject: 'Physics'
    },
    sections: [
      {
        name: 'Section A',
        questionTypes: ['multiple-choice'],
        marks: 2,
        questionCount: 15,
        difficulty: ['easy', 'medium']
      },
      {
        name: 'Section B',
        questionTypes: ['short-answer'],
        marks: 4,
        questionCount: 8,
        difficulty: ['medium']
      },
      {
        name: 'Section C',
        questionTypes: ['long-answer'],
        marks: 8,
        questionCount: 2,
        difficulty: ['hard']
      }
    ]
  },
  {
    id: 'english-literature',
    name: 'English Literature',
    subject: 'English',
    icon: <Book className="w-6 h-6" />,
    description: 'Literature analysis, comprehension, and creative writing',
    config: {
      questionTypes: ['multiple-choice', 'short-answer', 'long-answer'],
      difficulty: ['easy', 'medium', 'hard'],
      marksDistribution: [2, 4, 5, 6, 8, 10],
      totalQuestions: 18,
      totalMarks: 80,
      duration: 120,
      subject: 'English Literature'
    },
    sections: [
      {
        name: 'Section A',
        questionTypes: ['multiple-choice'],
        marks: 2,
        questionCount: 10,
        difficulty: ['easy', 'medium']
      },
      {
        name: 'Section B',
        questionTypes: ['short-answer'],
        marks: 5,
        questionCount: 5,
        difficulty: ['medium']
      },
      {
        name: 'Section C',
        questionTypes: ['long-answer'],
        marks: 10,
        questionCount: 3,
        difficulty: ['hard']
      }
    ]
  },
  {
    id: 'computer-science',
    name: 'Computer Science',
    subject: 'Computer Science',
    icon: <Code className="w-6 h-6" />,
    description: 'Programming concepts, algorithms, and technical questions',
    config: {
      questionTypes: ['multiple-choice', 'short-answer', 'long-answer'],
      difficulty: ['easy', 'medium', 'hard'],
      marksDistribution: [2, 4, 5, 6, 8, 10],
      totalQuestions: 22,
      totalMarks: 100,
      duration: 120,
      subject: 'Computer Science'
    },
    sections: [
      {
        name: 'Section A',
        questionTypes: ['multiple-choice'],
        marks: 2,
        questionCount: 12,
        difficulty: ['easy', 'medium']
      },
      {
        name: 'Section B',
        questionTypes: ['short-answer'],
        marks: 5,
        questionCount: 6,
        difficulty: ['medium']
      },
      {
        name: 'Section C',
        questionTypes: ['long-answer'],
        marks: 10,
        questionCount: 4,
        difficulty: ['hard']
      }
    ]
  },
  {
    id: 'geography',
    name: 'Geography',
    subject: 'Geography',
    icon: <Globe className="w-6 h-6" />,
    description: 'Physical and human geography with map-based questions',
    config: {
      questionTypes: ['multiple-choice', 'short-answer', 'long-answer'],
      difficulty: ['easy', 'medium', 'hard'],
      marksDistribution: [2, 4, 5, 6, 8, 10],
      totalQuestions: 20,
      totalMarks: 80,
      duration: 120,
      subject: 'Geography'
    },
    sections: [
      {
        name: 'Section A',
        questionTypes: ['multiple-choice'],
        marks: 2,
        questionCount: 10,
        difficulty: ['easy', 'medium']
      },
      {
        name: 'Section B',
        questionTypes: ['short-answer'],
        marks: 5,
        questionCount: 6,
        difficulty: ['medium']
      },
      {
        name: 'Section C',
        questionTypes: ['long-answer'],
        marks: 10,
        questionCount: 4,
        difficulty: ['hard']
      }
    ]
  },
  {
    id: 'art-history',
    name: 'Art & History',
    subject: 'Art History',
    icon: <Palette className="w-6 h-6" />,
    description: 'Art history, cultural studies, and creative analysis',
    config: {
      questionTypes: ['multiple-choice', 'short-answer', 'long-answer'],
      difficulty: ['easy', 'medium', 'hard'],
      marksDistribution: [2, 4, 5, 6, 8, 10],
      totalQuestions: 16,
      totalMarks: 80,
      duration: 120,
      subject: 'Art History'
    },
    sections: [
      {
        name: 'Section A',
        questionTypes: ['multiple-choice'],
        marks: 2,
        questionCount: 8,
        difficulty: ['easy', 'medium']
      },
      {
        name: 'Section B',
        questionTypes: ['short-answer'],
        marks: 5,
        questionCount: 5,
        difficulty: ['medium']
      },
      {
        name: 'Section C',
        questionTypes: ['long-answer'],
        marks: 10,
        questionCount: 3,
        difficulty: ['hard']
      }
    ]
  }
];

interface TemplateSelectorProps {
  onSelectTemplate: (template: Template) => void;
  className?: string;
}

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({ onSelectTemplate, className = '' }) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 w-full ${className}`}>
      {templates.map((template) => (
        <button
          key={template.id}
          onClick={() => onSelectTemplate(template)}
          className="min-w-[220px] max-w-sm w-full mx-auto p-6 bg-gray-50 dark:bg-gray-700 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-600 hover:scale-105 transition-transform duration-200 hover:shadow-2xl hover:border-blue-400 dark:hover:border-blue-400 text-left group flex flex-col h-full overflow-hidden focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <div className="flex items-center space-x-4 mb-2">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl group-hover:bg-blue-200 dark:group-hover:bg-blue-800 transition-all duration-300 shadow flex items-center justify-center">
              {template.icon}
            </div>
            <div className="flex-1 min-w-0">
              <h3
                className="font-bold text-gray-900 dark:text-white text-lg mb-1 truncate whitespace-nowrap overflow-hidden"
                title={template.name}
              >
                {template.name}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-300 font-medium truncate" title={template.subject}>{template.subject}</p>
            </div>
          </div>
          <p className="text-sm text-gray-700 dark:text-gray-200 mb-2 leading-relaxed line-clamp-3 break-words overflow-hidden">{template.description}</p>
          <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-100 dark:border-gray-600 gap-2">
            <span className="w-24 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-full font-semibold shadow text-center">{template.config.totalQuestions} questions</span>
            <span className="w-20 px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs rounded-full font-semibold shadow text-center">{template.config.totalMarks} marks</span>
            <span className="w-16 px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs rounded-full font-semibold shadow text-center">{template.config.duration} min</span>
          </div>
        </button>
      ))}
    </div>
  );
}; 