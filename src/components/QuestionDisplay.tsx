import React, { useState } from 'react';
import { Question } from '../types';

interface QuestionDisplayProps {
  questions: Question[];
  onEdit?: (index: number, updated: Partial<Question>) => void;
  className?: string;
}

export const QuestionDisplay: React.FC<QuestionDisplayProps> = ({ 
  questions,
  onEdit,
  className = ''
}) => {
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editText, setEditText] = useState('');
  const [editMarks, setEditMarks] = useState('');
  const [original, setOriginal] = useState<{ text: string; marks: string } | null>(null);

  const handleEdit = (index: number, question: Question) => {
    setEditIndex(index);
    setEditText(question.question);
    setEditMarks(String(question.marks));
    setOriginal({ text: question.question, marks: String(question.marks) });
  };

  const handleSave = (index: number) => {
    if (onEdit) {
      onEdit(index, { question: editText, marks: Number(editMarks) });
    }
    setEditIndex(null);
    setEditText('');
    setEditMarks('');
    setOriginal(null);
  };

  const handleCancel = () => {
    setEditIndex(null);
    setEditText('');
    setEditMarks('');
    setOriginal(null);
  };

  if (questions.length === 0) return null;

  // Group by section if any question has a section
  const hasSections = questions.some(q => q.section);
  let sectioned: { [section: string]: Question[] } = {};
  if (hasSections) {
    questions.forEach(q => {
      const section = q.section || 'Unsectioned';
      if (!sectioned[section]) sectioned[section] = [];
      sectioned[section].push(q);
    });
  }

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 transition-colors duration-300 ${className}`}>
      <div className="p-6">
        {hasSections ? (
          <div className="space-y-10">
            {Object.entries(sectioned).map(([section, qs], sIdx) => (
              <div key={section}>
                <div className="relative mb-6">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white text-center">
                    Section {section}
                  </div>
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-0.5 bg-blue-600 rounded-full"></div>
                </div>
                <div className="space-y-4">
                  {qs.map((question, idx) => {
                    // Remove any 'Section X:' prefix (robust, all cases, extra spaces)
                    const cleanText = question.question.replace(/section\s*[a-zA-Z]\s*:?\s*/i, '').trim();
                    // For debugging: console.log('CLEANED:', cleanText);
                    return (
                      <div key={question.id} className="flex items-start w-full p-6 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600">
                        <span className="mr-4 text-lg font-bold text-blue-600 dark:text-blue-400 min-w-[2.5rem]">{idx + 1}.</span>
                        <span className="flex-1 text-gray-900 dark:text-white leading-relaxed">
                          {cleanText ? cleanText : <span className="inline-block w-40 border-b-2 border-gray-400 dark:border-gray-500 align-middle" style={{height: 0}}></span>}
                        </span>
                        <span className="ml-4 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 font-semibold whitespace-nowrap rounded-full text-sm">
                          {question.marks} marks
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {questions.map((question, index) => (
              <div key={question.id} className="flex items-start w-full p-6 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600">
                <span className="mr-4 text-lg font-bold text-blue-600 dark:text-blue-400 min-w-[2.5rem]">{index + 1}.</span>
                <span className="flex-1 text-gray-900 dark:text-white leading-relaxed">
                  {question.question.trim() ? question.question : <span className="inline-block w-40 border-b-2 border-gray-400 dark:border-gray-500 align-middle" style={{height: 0}}></span>}
                </span>
                <span className="ml-4 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 font-semibold whitespace-nowrap rounded-full text-sm">
                  {question.marks} marks
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};