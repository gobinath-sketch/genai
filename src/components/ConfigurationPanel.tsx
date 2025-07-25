import React from 'react';
import { GenerationConfig } from '../types';

interface ConfigurationPanelProps {
  config: GenerationConfig;
  onChange: (config: GenerationConfig) => void;
}

export const ConfigurationPanel: React.FC<ConfigurationPanelProps> = ({ config, onChange }) => {
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

  const handleQuestionTypeChange = (type: string, checked: boolean) => {
    const newTypes = checked 
      ? [...config.questionTypes, type]
      : config.questionTypes.filter(t => t !== type);
    
    onChange({ ...config, questionTypes: newTypes });
  };

  const handleDifficultyChange = (difficulty: string, checked: boolean) => {
    const newDifficulties = checked 
      ? [...config.difficulty, difficulty]
      : config.difficulty.filter(d => d !== difficulty);
    
    onChange({ ...config, difficulty: newDifficulties });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
        <h3 className="text-xl font-bold">Question Configuration</h3>
        <p className="text-blue-100 mt-1 text-sm">Set up your question paper preferences</p>
      </div>
      
      <div className="p-8">
        {/* Basic Settings */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="lg:col-span-1">
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
              Subject Name
            </label>
            <input
              type="text"
              value={config.subject}
              onChange={(e) => onChange({ ...config, subject: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white bg-white dark:bg-gray-700 placeholder:text-gray-500 dark:placeholder:text-gray-400 transition-all duration-200"
              placeholder="e.g., Mathematics, Physics"
            />
          </div>
          <div className="col-span-1">
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
              Total Questions
            </label>
            <input
              type="number"
              value={String(config.totalQuestions === '' ? 0 : config.totalQuestions).replace(/^0+(?!$)/, '')}
              onChange={(e) => {
                let val = e.target.value.replace(/^0+(?!$)/, '');
                onChange({ ...config, totalQuestions: parseInt(val) || 0 });
              }}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-gray-900 dark:text-white bg-white dark:bg-gray-700 appearance-none hide-number-spin placeholder:text-gray-500 dark:placeholder:text-gray-400 transition-all duration-200"
              min="1"
              max="50"
              inputMode="numeric"
              pattern="[0-9]*"
              style={{ MozAppearance: 'textfield' }}
            />
          </div>
          <div className="col-span-1">
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
              Total Marks
            </label>
            <input
              type="number"
              value={String(config.totalMarks === '' ? 0 : config.totalMarks).replace(/^0+(?!$)/, '')}
              onChange={(e) => {
                let val = e.target.value.replace(/^0+(?!$)/, '');
                onChange({ ...config, totalMarks: parseInt(val) || 0 });
              }}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-gray-900 dark:text-white bg-white dark:bg-gray-700 appearance-none hide-number-spin placeholder:text-gray-500 dark:placeholder:text-gray-400 transition-all duration-200"
              min="1"
              inputMode="numeric"
              pattern="[0-9]*"
              style={{ MozAppearance: 'textfield' }}
            />
          </div>
          <div className="col-span-1">
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
              Duration (minutes)
            </label>
            <input
              type="number"
              value={String(config.duration === '' ? 0 : config.duration).replace(/^0+(?!$)/, '')}
              onChange={(e) => {
                let val = e.target.value.replace(/^0+(?!$)/, '');
                onChange({ ...config, duration: parseInt(val) || 0 });
              }}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-gray-900 dark:text-white bg-white dark:bg-gray-700 appearance-none hide-number-spin placeholder:text-gray-500 dark:placeholder:text-gray-400 transition-all duration-200"
              min="1"
              inputMode="numeric"
              pattern="[0-9]*"
              style={{ MozAppearance: 'textfield' }}
            />
          </div>
        </div>
        
        {/* Question Types */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 mb-8">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Question Types</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {questionTypes.map((type) => (
              <label key={type.value} className="flex items-center space-x-3 p-4 bg-white dark:bg-gray-600 rounded-xl cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-500 transition-all duration-200 border border-gray-200 dark:border-gray-500">
                <input
                  type="checkbox"
                  checked={config.questionTypes.includes(type.value)}
                  onChange={(e) => handleQuestionTypeChange(type.value, e.target.checked)}
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                />
                <span className="text-sm font-medium text-gray-900 dark:text-white">{type.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Marks Distribution */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 mb-8">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Marks per Question</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {[2, 4, 5, 6, 7, 8, 10, 12, 15, 16].map((marks) => (
              <label key={marks} className="flex flex-col items-center p-4 bg-white dark:bg-gray-600 rounded-xl cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-500 transition-all duration-200 border border-gray-200 dark:border-gray-500">
                <input
                  type="checkbox"
                  checked={config.marksDistribution.includes(marks)}
                  onChange={(e) => {
                    const newMarks = e.target.checked 
                      ? [...config.marksDistribution, marks]
                      : config.marksDistribution.filter(m => m !== marks);
                    onChange({ ...config, marksDistribution: newMarks });
                  }}
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 mb-2"
                />
                <span className="text-sm font-bold text-gray-900 dark:text-white">{marks}</span>
                <span className="text-xs text-gray-600 dark:text-gray-400">marks</span>
              </label>
            ))}
          </div>
        </div>

        {/* Difficulty Levels */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Difficulty Levels</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {difficulties.map((difficulty) => (
              <label key={difficulty.value} className="flex items-center space-x-3 p-4 bg-white dark:bg-gray-600 rounded-xl cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-500 transition-all duration-200 border border-gray-200 dark:border-gray-500">
                <input
                  type="checkbox"
                  checked={config.difficulty.includes(difficulty.value)}
                  onChange={(e) => handleDifficultyChange(difficulty.value, e.target.checked)}
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                />
                <span className="text-sm font-semibold text-gray-900 dark:text-white">{difficulty.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};