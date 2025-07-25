import React from 'react';
import { Section } from '../types';
import { Plus, Trash2, Settings, Clock, BookOpen } from 'lucide-react';

interface SectionConfigurationProps {
  sections: Section[];
  onSectionsChange: (sections: Section[]) => void;
  subject: string;
  duration: number | string;
  onSubjectChange: (subject: string) => void;
  onDurationChange: (duration: number | string) => void;
}

export const SectionConfiguration: React.FC<SectionConfigurationProps> = ({ 
  sections, 
  onSectionsChange,
  subject,
  duration,
  onSubjectChange,
  onDurationChange
}) => {
  const questionTypes = [
    { value: 'multiple-choice', label: 'Multiple Choice' },
    { value: 'short-answer', label: 'Short Answer' },
    { value: 'long-answer', label: 'Long Answer' },
    { value: 'true-false', label: 'True/False' }
  ];

  const difficulties = [
    { value: 'easy', label: 'Easy' },
    { value: 'medium', label: 'Medium' },
    { value: 'hard', label: 'Hard' }
  ];

  const markOptions = [2, 4, 5, 6, 7, 8, 10, 12, 15, 16];

  const addSection = () => {
    const newSection: Section = {
      id: `section_${Date.now()}`,
      name: `Section ${String.fromCharCode(65 + sections.length)}`,
      questionTypes: [],
      marks: 0,
      questionCount: 0,
      difficulty: []
    };
    onSectionsChange([...sections, newSection]);
  };

  const removeSection = (sectionId: string) => {
    onSectionsChange(sections.filter(s => s.id !== sectionId));
  };

  const updateSection = (sectionId: string, updates: Partial<Section>) => {
    onSectionsChange(sections.map(s => 
      s.id === sectionId ? { ...s, ...updates } : s
    ));
  };

  const handleQuestionTypeChange = (sectionId: string, type: string, checked: boolean) => {
    const section = sections.find(s => s.id === sectionId);
    if (!section) return;

    const newTypes = checked 
      ? [...section.questionTypes, type]
      : section.questionTypes.filter(t => t !== type);
    
    updateSection(sectionId, { questionTypes: newTypes });
  };

  const handleDifficultyChange = (sectionId: string, difficulty: string, checked: boolean) => {
    const section = sections.find(s => s.id === sectionId);
    if (!section) return;

    const newDifficulties = checked 
      ? [...section.difficulty, difficulty]
      : section.difficulty.filter(d => d !== difficulty);
    
    updateSection(sectionId, { difficulty: newDifficulties });
  };

  const getTotalQuestions = () => sections.reduce((sum, s) => sum + s.questionCount, 0);
  const getTotalMarks = () => sections.reduce((sum, s) => sum + (s.marks * s.questionCount), 0);
  
  // Calculate estimated time based on questions and difficulty
  const getEstimatedTime = () => {
    return sections.reduce((time, section) => {
      let baseTime = 0;
      const hasMultipleChoice = section.questionTypes.includes('multiple-choice');
      const hasTrueFalse = section.questionTypes.includes('true-false');
      const hasShortAnswer = section.questionTypes.includes('short-answer');
      const hasLongAnswer = section.questionTypes.includes('long-answer');
      
      // Base time per question type
      if (hasMultipleChoice) baseTime += 1.5;
      if (hasTrueFalse) baseTime += 0.8;
      if (hasShortAnswer) baseTime += 4;
      if (hasLongAnswer) baseTime += 10;
      
      // Average if multiple types
      const typeCount = section.questionTypes.length;
      if (typeCount > 1) baseTime = baseTime / typeCount;
      
      // Adjust for difficulty
      const hasEasy = section.difficulty.includes('easy');
      const hasMedium = section.difficulty.includes('medium');
      const hasHard = section.difficulty.includes('hard');
      
      let difficultyMultiplier = 1;
      if (hasEasy && hasMedium && hasHard) difficultyMultiplier = 1.2;
      else if (hasHard) difficultyMultiplier = 1.5;
      else if (hasMedium) difficultyMultiplier = 1.1;
      else if (hasEasy) difficultyMultiplier = 0.8;
      
      return time + (baseTime * section.questionCount * difficultyMultiplier);
    }, 0);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
          {/* Section Configuration Title */}
          <div className="lg:col-span-2 flex flex-col items-center justify-center bg-white/10 rounded-xl p-4 h-20">
            <div className="flex items-center space-x-2">
              <Settings className="w-6 h-6" />
              <h3 className="text-lg font-bold">Section Configuration</h3>
            </div>
          </div>
          
          {/* Add Section Button */}
          <div className="flex flex-col items-center justify-center bg-white/10 rounded-xl p-4 h-20">
            <button
              onClick={addSection}
              className="flex items-center space-x-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl transition-all duration-200"
            >
              <Plus className="w-4 h-4" />
              <span className="font-medium">Add Section</span>
            </button>
          </div>
          
          {/* Total Questions */}
          <div className="flex flex-col items-center justify-center bg-white/10 rounded-xl p-4 h-20">
            <span className="text-blue-100 text-sm">Total Questions</span>
            <span className="font-bold text-lg">{getTotalQuestions()}</span>
          </div>
          
          {/* Total Marks */}
          <div className="flex flex-col items-center justify-center bg-white/10 rounded-xl p-4 h-20">
            <span className="text-blue-100 text-sm">Total Marks</span>
            <span className="font-bold text-lg">{getTotalMarks()}</span>
          </div>
          
          {/* Estimated Time */}
          <div className="flex flex-col items-center justify-center bg-white/10 rounded-xl p-4 h-20">
            <span className="text-blue-100 text-sm">Estimated Time</span>
            <span className="font-bold text-lg">{Math.round(getEstimatedTime())} min</span>
          </div>
        </div>
      </div>

      {/* Sections */}
      <div className="p-8">
        {/* Global Configuration */}
        <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-700 dark:to-gray-800 rounded-2xl p-6 mb-8 border border-gray-200 dark:border-gray-600">
          <div className="flex items-center space-x-3 mb-6">
            <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <h4 className="text-xl font-bold text-gray-900 dark:text-white">Paper Details</h4>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Subject Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Subject Name
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => onSubjectChange(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white bg-white dark:bg-gray-800 placeholder:text-gray-500 dark:placeholder:text-gray-400 transition-all duration-200"
                placeholder="e.g., Mathematics, Physics, Computer Science"
              />
            </div>
            
            {/* Duration */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Duration (minutes)
              </label>
              <input
                type="number"
                value={String(duration === '' ? '' : duration).replace(/^0+(?!$)/, '')}
                onChange={(e) => {
                  let val = e.target.value.replace(/^0+(?!$)/, '');
                  onDurationChange(parseInt(val) || '');
                }}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-gray-900 dark:text-white bg-white dark:bg-gray-800 appearance-none hide-number-spin placeholder:text-gray-500 dark:placeholder:text-gray-400 transition-all duration-200"
                min="1"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="120"
                style={{ MozAppearance: 'textfield' }}
              />
            </div>
          </div>
          
          {/* Estimated vs Actual Duration */}
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-medium text-blue-800 dark:text-blue-200">Time Analysis</span>
              </div>
              <div className="text-right">
                <div className="text-sm text-blue-700 dark:text-blue-300">
                  Estimated: <span className="font-bold">{Math.round(getEstimatedTime())} min</span>
                </div>
                <div className="text-sm text-blue-700 dark:text-blue-300">
                  Set Duration: <span className="font-bold">{duration || 0} min</span>
                </div>
              </div>
            </div>
            {duration && getEstimatedTime() > 0 && (
              <div className="mt-2">
                {getEstimatedTime() > Number(duration) * 1.2 ? (
                  <p className="text-xs text-orange-600 dark:text-orange-400">
                    ⚠️ Estimated time exceeds set duration. Consider reducing questions or increasing duration.
                  </p>
                ) : getEstimatedTime() < Number(duration) * 0.6 ? (
                  <p className="text-xs text-green-600 dark:text-green-400">
                    ✅ Good time allocation. Students will have adequate time.
                  </p>
                ) : (
                  <p className="text-xs text-blue-600 dark:text-blue-400">
                    ✅ Well-balanced time allocation.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {sections.length === 0 ? (
          <div className="text-center py-12">
            <Settings className="w-16 h-16 mx-auto mb-4 text-gray-400 dark:text-gray-500" />
            <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">No Sections Yet</h4>
            <p className="text-gray-500 dark:text-gray-400 mb-6">Create sections to organize your question paper</p>
            <button
              onClick={addSection}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 font-medium"
            >
              Create First Section
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {sections.map((section) => (
              <div key={section.id} className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-6 border border-gray-200 dark:border-gray-600 transition-all duration-300">
                {/* Section Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {section.name}
                  </div>
                  <button
                    onClick={() => removeSection(section.id)}
                    className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                {/* Main Configuration Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                  {/* Number of Questions */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                      Number of Questions
                    </label>
                    <input
                      type="number"
                      value={String(section.questionCount).replace(/^0+(?!$)/, '')}
                      onChange={(e) => {
                        let val = e.target.value.replace(/^0+(?!$)/, '');
                        updateSection(section.id, { questionCount: parseInt(val) || 0 });
                      }}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center appearance-none hide-number-spin bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all duration-200"
                      min="1"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      style={{ MozAppearance: 'textfield' }}
                    />
                  </div>

                  {/* Marks per Question */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                      Marks per Question
                    </label>
                    <select
                      value={section.marks}
                      onChange={(e) => updateSection(section.id, { marks: parseInt(e.target.value) })}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all duration-200"
                    >
                      <option value={0} disabled>Select</option>
                      {markOptions.map(mark => (
                        <option key={mark} value={mark}>{mark} marks</option>
                      ))}
                    </select>
                  </div>

                  {/* Section Total */}
                  <div>
                    <label className="block text-sm font-semibold text-green-700 dark:text-green-400 mb-2">
                      Section Total
                    </label>
                    <div className="w-full px-4 py-3 border border-green-200 dark:border-green-700 rounded-xl bg-green-50 dark:bg-green-900/20 font-bold text-green-800 dark:text-green-400 text-center">
                      {section.marks * section.questionCount} marks
                    </div>
                  </div>
                </div>

                {/* Question Types */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 mb-6 border border-gray-200 dark:border-gray-600">
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-4">
                    Question Types
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {questionTypes.map((type) => (
                      <label key={type.value} className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-200 border border-gray-200 dark:border-gray-600">
                        <input
                          type="checkbox"
                          checked={section.questionTypes.includes(type.value)}
                          onChange={(e) => handleQuestionTypeChange(section.id, type.value, e.target.checked)}
                          className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                        />
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{type.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Difficulty Levels */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-600">
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-4">
                    Difficulty Levels
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {difficulties.map((difficulty) => (
                      <label key={difficulty.value} className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-200 border border-gray-200 dark:border-gray-600">
                        <input
                          type="checkbox"
                          checked={section.difficulty.includes(difficulty.value)}
                          onChange={(e) => handleDifficultyChange(section.id, difficulty.value, e.target.checked)}
                          className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                        />
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{difficulty.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};