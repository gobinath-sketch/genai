import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Play, Upload, Settings, FileText, Download } from 'lucide-react';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  image?: string;
}

const onboardingSteps: OnboardingStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to AI Question Paper Generator',
    description: 'Create professional question papers in minutes using AI. Upload any syllabus format and let our AI generate questions automatically.',
    icon: <Play className="w-8 h-8" />
  },
  {
    id: 'upload',
    title: 'Upload Your Syllabus',
    description: 'Upload any format - PDF, Word, text, or even images. Our AI will extract and understand your syllabus content automatically.',
    icon: <Upload className="w-8 h-8" />
  },
  {
    id: 'configure',
    title: 'Configure Your Paper',
    description: 'Choose between simple mode or section-wise configuration. Set question types, difficulty levels, marks, and duration.',
    icon: <Settings className="w-8 h-8" />
  },
  {
    id: 'generate',
    title: 'Generate Questions',
    description: 'Click generate and watch AI create relevant questions based on your syllabus. Get instant results with proper formatting.',
    icon: <FileText className="w-8 h-8" />
  },
  {
    id: 'export',
    title: 'Export & Share',
    description: 'Download in multiple formats - PDF, Word, or real question paper styles. Share with colleagues or save for later use.',
    icon: <Download className="w-8 h-8" />
  }
];

interface OnboardingProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    onClose();
  };

  const currentStepData = onboardingSteps[currentStep];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 rounded-3xl shadow-3xl max-w-3xl w-full max-h-[90vh] overflow-hidden border border-gray-200 dark:border-gray-700 transition-colors duration-300 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-8 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              {currentStepData.icon}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Quick Start Guide</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Step {currentStep + 1} of {onboardingSteps.length}</p>
            </div>
          </div>
          <button
            onClick={handleSkip}
            className="p-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="p-8 flex-1 overflow-y-auto">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">{currentStepData.title}</h3>
            <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl mx-auto">{currentStepData.description}</p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between mb-4">
              {onboardingSteps.map((step, index) => (
                <div
                  key={step.id}
                  className={`w-4 h-4 rounded-full transition-all duration-300 ${
                    index <= currentStep ? 'bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                />
              ))}
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${((currentStep + 1) / onboardingSteps.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Feature Preview */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-700">
            <div className="text-center">
              <div className="text-5xl mb-4">🚀</div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-3 text-lg">Key Features</h4>
              <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-2 max-w-md mx-auto">
                <li className="flex items-center justify-center space-x-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  <span>AI-powered question generation</span>
                </li>
                <li className="flex items-center justify-center space-x-2">
                  <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                  <span>Multiple export formats</span>
                </li>
                <li className="flex items-center justify-center space-x-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span>Section-wise configuration</span>
                </li>
                <li className="flex items-center justify-center space-x-2">
                  <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                  <span>Professional formatting</span>
                </li>
                <li className="flex items-center justify-center space-x-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                  <span>Instant results</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer - Always Visible */}
        <div className="flex items-center justify-between p-8 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="flex items-center space-x-2 px-6 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <div className="flex space-x-3">
            <button
              onClick={handleSkip}
              className="px-6 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all duration-200 font-medium"
            >
              Skip
            </button>
            <button
              onClick={handleNext}
              className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl font-bold"
            >
              <span>{currentStep === onboardingSteps.length - 1 ? 'Get Started' : 'Next'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const OnboardingTrigger: React.FC<{ onStart: () => void }> = ({ onStart }) => {
  return (
    <button
      onClick={onStart}
      className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
    >
      <Play className="w-4 h-4" />
      <span>Quick Start Guide</span>
    </button>
  );
}; 