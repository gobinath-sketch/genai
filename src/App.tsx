import React, { useState, useEffect } from 'react';
import { FileUpload } from './components/FileUpload';
import { ConfigurationPanel } from './components/ConfigurationPanel';
import { SectionConfiguration } from './components/SectionConfiguration';
import { QuestionDisplay } from './components/QuestionDisplay';
import { ApiKeyInput } from './components/ApiKeyInput';
import { LoadingSpinner } from './components/LoadingSpinner';
import { FileProcessor } from './services/fileProcessor';
import { GeminiService } from './services/geminiService';
import { LocalLLMService } from './services/localLLMService';
import { PDFExporter } from './services/pdfExporter';
import { Question, GenerationConfig, Section } from './types';
import { Brain, FileText, Settings, Zap, Sparkles, HelpCircle, Share2, Download, Copy, ChevronDown } from 'lucide-react';
import { BGPattern } from './components/ui/bg-pattern';
import { ToastProvider, useToast } from './components/ui/toast';
import { QuestionSkeleton, ConfigurationSkeleton, SectionSkeleton, FileUploadSkeleton } from './components/ui/skeleton';
import { ThemeToggle } from './components/ui/theme-toggle';
import { HelpTooltip } from './components/ui/tooltip';
import { TemplateSelector, Template } from './components/ui/templates';
import { QuestionPaperAnalytics } from './components/ui/analytics';
import { Onboarding, OnboardingTrigger } from './components/ui/onboarding';
import { LLMModeSelector, LLMMode } from './components/ui/llm-mode-selector';
import { LocalLLMProgress } from './components/ui/local-llm-progress';
import { SubscriptionModal } from './components/ui/subscription-modal';
import { UsageIndicator } from './components/ui/usage-indicator';
import { SubscriptionService } from './services/subscriptionService';

function App() {
  const { addToast } = useToast();
  const [apiKey, setApiKey] = useState('AIzaSyCasBOSQjQtChdUzmAiHtDwr9W-04qOBzA');
  const [syllabusContent, setSyllabusContent] = useState('');
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isImageFile, setIsImageFile] = useState(false);
  const [useSections, setUseSections] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showDownloadDropdown, setShowDownloadDropdown] = useState(false);
  const [showRealSubmenu, setShowRealSubmenu] = useState(false);
  const [llmMode, setLLMMode] = useState<LLMMode>('api');
  const [localLLMService] = useState(() => new LocalLLMService());
  const [localLLMReady, setLocalLLMReady] = useState(true); // Always ready - instant AI
  const [isLocalLoading, setIsLocalLoading] = useState(false); // Never loading
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [subscription, setSubscription] = useState(SubscriptionService.getSubscription());
  
  const [config, setConfig] = useState<GenerationConfig>({
    questionTypes: [],
    difficulty: [],
    marksDistribution: [],
    totalQuestions: '',
    totalMarks: '',
    duration: '',
    subject: '',
    sections: []
  });

  // Check if user is new (first visit)
  useEffect(() => {
    const hasVisited = localStorage.getItem('hasVisited');
    if (!hasVisited) {
      setShowOnboarding(true);
      localStorage.setItem('hasVisited', 'true');
    }
    
    // Initialize subscription service
    SubscriptionService.checkDailyReset();
    setSubscription(SubscriptionService.getSubscription());
  }, []);

  // Check local LLM status periodically
  useEffect(() => {
    // Local AI is always ready - no need to check
    setLocalLLMReady(true);
    setIsLocalLoading(false);
  }, []);

  // Handle clicking outside dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.download-dropdown')) {
        setShowDownloadDropdown(false);
        setShowRealSubmenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle LLM mode change
  const handleLLMModeChange = async (mode: LLMMode) => {
    setLLMMode(mode);
    if (mode === 'local') {
      addToast({
        type: 'success',
        title: 'Local AI Activated!',
        message: 'You now have unlimited offline generation!',
        duration: 3000
      });
    }
  };

  // Handle clicking outside dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.download-dropdown')) {
        setShowDownloadDropdown(false);
        setShowRealSubmenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleFileSelect = async (file: File) => {
    setIsProcessingFile(true);
    setError(null);
    setUploadedFileName(file.name);
    setIsImageFile(file.type.startsWith('image/'));

    try {
          const content = await FileProcessor.processFile(file);
    setSyllabusContent(content);
    
    // Auto-set subject from filename if not already set
    if (!config.subject) {
      const fileName = file.name.split('.')[0];
      setConfig(prev => ({ ...prev, subject: fileName }));
    }
    
    addToast({
      type: 'success',
      title: 'File Processed!',
      message: `${file.name} has been successfully processed`,
      duration: 3000
    });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Failed to process file';
    setError(errorMessage);
    addToast({
      type: 'error',
      title: 'File Processing Failed',
      message: errorMessage,
      duration: 5000
    });
  } finally {
    setIsProcessingFile(false);
  }
  };

  const handleGenerateQuestions = async () => {
    if (llmMode === 'api') {
      if (!apiKey) {
        setError('Please enter your Gemini API key');
        addToast({
          type: 'error',
          title: 'API Key Required',
          message: 'Please enter your Gemini API key to use Cloud AI',
          duration: 5000
        });
        return;
      }
      
      // Check API usage limits
      if (!SubscriptionService.canUseAPI()) {
        setError('Daily API limit reached. Use Local AI (unlimited) or upgrade your plan.');
        setShowSubscriptionModal(true);
        addToast({
          type: 'warning',
          title: 'API Limit Reached',
          message: 'Switch to Local AI for unlimited generation or upgrade your plan',
          duration: 5000
        });
        return;
      }
    }

    if (llmMode === 'local' && !localLLMReady) {
      setError('Local AI is not ready. Please initialize it first or use API mode.');
      addToast({
        type: 'error',
        title: 'Local AI Not Ready',
        message: 'Please wait for Local AI to initialize or use Cloud API',
        duration: 5000
      });
      return;
    }

    if (!syllabusContent) {
      setError('Please upload a syllabus file first');
      addToast({
        type: 'error',
        title: 'Syllabus Required',
        message: 'Please upload a syllabus file before generating questions',
        duration: 5000
      });
      return;
    }

    // Validation for section-wise mode
    if (useSections) {
      if (config.sections.length === 0) {
        setError('Please add at least one section');
        return;
      }
      
      for (const section of config.sections) {
        if (section.questionTypes.length === 0) {
          setError(`Please select at least one question type in ${section.name}`);
          return;
        }
        if (section.difficulty.length === 0) {
          setError(`Please select at least one difficulty level in ${section.name}`);
          return;
        }
        if (section.questionCount <= 0) {
          setError(`Please set a valid number of questions for ${section.name}`);
          return;
        }
        if (section.marks <= 0) {
          setError(`Please select marks per question for ${section.name}`);
          return;
        }
      }
    } else {
      // Validation for simple mode
      if (config.questionTypes.length === 0) {
        setError('Please select at least one question type');
        return;
      }

      if (config.difficulty.length === 0) {
        setError('Please select at least one difficulty level');
        return;
      }

      if (config.marksDistribution.length === 0) {
        setError('Please select at least one marks option');
        return;
      }
    }

    setIsGenerating(true);
    setError(null);

    try {
      let generatedQuestions: Question[];
      
      if (llmMode === 'api') {
        // Use API call from subscription
        if (!SubscriptionService.useAPICall()) {
          setError('Failed to use API call. Please try again.');
          return;
        }
        
        const geminiService = new GeminiService(apiKey);
        generatedQuestions = await geminiService.generateQuestions(
          syllabusContent, 
          config,
          isImageFile
        );
        
        // Update subscription state
        setSubscription(SubscriptionService.getSubscription());
      } else if (llmMode === 'both') {
        // Run local first, then cloud, and show results progressively
        if (!apiKey) {
          setError('Please enter your Gemini API key');
          addToast({
            type: 'error',
            title: 'API Key Required',
            message: 'Please enter your Gemini API key to use Cloud AI',
            duration: 5000
          });
          return;
        }
        if (!SubscriptionService.canUseAPI()) {
          setError('Daily API limit reached. Use Local AI (unlimited) or upgrade your plan.');
          setShowSubscriptionModal(true);
          addToast({
            type: 'warning',
            title: 'API Limit Reached',
            message: 'Switch to Local AI for unlimited generation or upgrade your plan',
            duration: 5000
          });
          return;
        }
        if (!SubscriptionService.useAPICall()) {
          setError('Failed to use API call. Please try again.');
          return;
        }
        const geminiService = new GeminiService(apiKey);
        // Start local generation and show immediately
        const localPromise = localLLMService.generateQuestions(syllabusContent, config);
        localPromise.then(localQuestions => {
          setQuestions(localQuestions);
          setShowAnalytics(true);
        });
        // Start cloud generation and append when ready
        const apiQuestions = await geminiService.generateQuestions(syllabusContent, config, isImageFile);
        setQuestions(prev => [...prev, ...apiQuestions]);
        setSubscription(SubscriptionService.getSubscription());
        SubscriptionService.incrementUsageStats('questionsGenerated');
        generatedQuestions = [...(await localPromise), ...apiQuestions];
      } else {
        generatedQuestions = await localLLMService.generateQuestions(
          syllabusContent,
          config
        );
        
        // Track local generation
        SubscriptionService.incrementUsageStats('questionsGenerated');
      }
      
      setQuestions(generatedQuestions);
      setShowAnalytics(true);
      addToast({
        type: 'success',
        title: 'Questions Generated!',
        message: `Generated ${generatedQuestions.length} questions using ${llmMode === 'api' ? 'Cloud AI' : llmMode === 'both' ? 'Both (Local + Cloud)' : 'Instant Local AI'}${llmMode === 'api' && subscription.plan === 'free' ? ` (${SubscriptionService.getRemainingAPICalls()} free calls left)` : ''}`,
        duration: 5000
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate questions';
      setError(errorMessage);
      addToast({
        type: 'error',
        title: 'Generation Failed',
        message: errorMessage,
        duration: 7000
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleTemplateSelect = (template: Template) => {
    setConfig(prev => ({
      ...prev,
      ...template.config,
      sections: template.sections?.map((section, index) => ({
        id: `section_${Date.now()}_${index}`,
        name: section.name || `Section ${String.fromCharCode(65 + index)}`,
        questionTypes: section.questionTypes || [],
        marks: section.marks || 0,
        questionCount: section.questionCount || 0,
        difficulty: section.difficulty || []
      })) || []
    }));
    setUseSections(template.sections && template.sections.length > 0);
    setShowTemplates(false);
    
    addToast({
      type: 'success',
      title: 'Template Applied!',
      message: `${template.name} template has been loaded`,
      duration: 3000
    });
  };

  const handleDownload = async (format: 'pdf' | 'docx' | 'real' | 'image' | 'real-school' | 'real-college') => {
    const totalMarks = useSections ? sectionTotalMarks : config.totalMarks;
    
    try {
      if (format === 'pdf') {
        PDFExporter.generatePDF(questions, config.subject, config.duration, totalMarks);
        addToast({
          type: 'success',
          title: 'PDF Downloaded!',
          message: 'Question paper has been downloaded as PDF',
          duration: 3000
        });
      } else if (format === 'docx') {
        await PDFExporter.generateDocx(questions, config.subject, config.duration, totalMarks);
        addToast({
          type: 'success',
          title: 'DOCX Downloaded!',
          message: 'Question paper has been downloaded as Word document',
          duration: 3000
        });
      } else if (format === 'real' || format === 'real-school') {
        await PDFExporter.generateRealQuestionPaper(questions, config.subject, config.duration, totalMarks);
        addToast({
          type: 'success',
          title: 'Question Paper Downloaded!',
          message: 'Real question paper format has been downloaded',
          duration: 3000
        });
      } else if (format === 'real-college') {
        await PDFExporter.generateCollegeQuestionPaper(questions, config.subject, config.duration, totalMarks);
        addToast({
          type: 'success',
          title: 'College Style Downloaded!',
          message: 'College-style question paper has been downloaded',
          duration: 3000
        });
      }
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Download Failed',
        message: 'Failed to download question paper',
        duration: 5000
      });
    }
  };

  const handleDownloadDocx = async () => {
    const totalMarks = useSections ? sectionTotalMarks : config.totalMarks;
    await PDFExporter.generateDocx(questions, config.subject, config.duration, totalMarks);
  };

  const handleShare = async () => {
    const totalMarks = useSections ? sectionTotalMarks : config.totalMarks;
    try {
      await PDFExporter.shareQuestionPaper(questions, config.subject, config.duration, totalMarks);
      addToast({
        type: 'success',
        title: 'Shared Successfully!',
        message: 'Question paper has been shared',
        duration: 3000
      });
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Share Failed',
        message: 'Failed to share question paper',
        duration: 5000
      });
    }
  };

  const handleCopy = async () => {
    const totalMarks = useSections ? sectionTotalMarks : config.totalMarks;
    try {
      const content = `${config.subject.toUpperCase()} - QUESTION PAPER\n${'='.repeat(50)}\n\nDuration: ${config.duration} minutes\nTotal Marks: ${totalMarks}\nNumber of Questions: ${questions.length}\n\n${questions.map((q, i) => `${i + 1}. ${q.question} [${q.marks} marks]`).join('\n\n')}`;
      await PDFExporter.copyToClipboard(content, config.subject);
      addToast({
        type: 'success',
        title: 'Copied to Clipboard!',
        message: 'Question paper content has been copied',
        duration: 3000
      });
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Copy Failed',
        message: 'Failed to copy question paper',
        duration: 5000
      });
    }
  };

  const handleEditQuestion = (index: number, updated: Partial<Question>) => {
    setQuestions(prev => prev.map((q, i) => i === index ? { ...q, ...updated } : q));
  };

  // Calculate total marks for section-wise mode
  const sectionTotalMarks = config.sections.reduce((sum, s) => sum + (s.marks * s.questionCount), 0);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 relative overflow-hidden transition-colors duration-300">
      <BGPattern variant="grid" mask="none" fill="#e5e7eb" size={32} className="pointer-events-none dark:fill-gray-800" />
      {/* Header */}
      <header className="bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-black backdrop-blur-md shadow-xl border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <Sparkles className="w-4 h-4 text-yellow-400 absolute -top-1 -right-1 drop-shadow-lg" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  AI Question Paper Generator
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Professional Question Papers in Minutes</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <OnboardingTrigger onStart={() => setShowOnboarding(true)} />
              <ThemeToggle />
              <button
                onClick={() => setShowSubscriptionModal(true)}
                className={`px-4 py-2 rounded-xl transition-all duration-200 font-medium text-sm shadow-lg hover:shadow-xl ${
                  subscription.plan === 'free' 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700' 
                    : 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700'
                }`}
              >
                {subscription.plan === 'free' ? 'Upgrade Plan' : `${subscription.plan.toUpperCase()} Plan`}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Single Column Layout */}
          <div className="space-y-8">
            {/* File Upload Section */}
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 transition-colors duration-300">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Upload Syllabus</h3>
                  <p className="text-gray-600 dark:text-gray-400">Upload any format file</p>
                </div>
              </div>
              
              <FileUpload onFileSelect={handleFileSelect} isProcessing={isProcessingFile} />
              
              {uploadedFileName && !isProcessingFile && (
                <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-xl">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">✓</span>
                    </div>
                    <p className="text-green-600 dark:text-green-400 text-sm font-medium">{uploadedFileName} processed successfully</p>
                  </div>
                </div>
              )}
            </div>

            {/* Usage Indicator */}
            <UsageIndicator 
              onUpgradeClick={() => setShowSubscriptionModal(true)}
              className="mb-8"
            />
            
            {/* Quick Start Section */}
            <div className="space-y-8">
              {/* AI Mode Selection */}
              <LLMModeSelector
                mode={llmMode}
                onModeChange={handleLLMModeChange}
                localLLMReady={localLLMReady}
                isLoading={isLocalLoading}
              />
              
              {/* Quick Start Section */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-lg overflow-hidden">
              <div className="p-8 text-white">
                <div className="flex items-center space-x-3 mb-6">
                  <Settings className="w-6 h-6" />
                  <div>
                    <h3 className="text-xl font-bold">Quick Start</h3>
                    <p className="text-blue-100 mt-1">Choose a template or configure manually</p>
                  </div>
                </div>
                
                {/* Configuration Mode Toggle */}
                <div className="flex items-center justify-between bg-white/10 rounded-xl p-4">
                  <span className="font-medium text-white">Configuration Mode:</span>
                  <div className="flex items-center space-x-6">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="configMode"
                        checked={!useSections}
                        onChange={() => setUseSections(false)}
                        className="mr-2 text-white focus:ring-white"
                      />
                      <span className="font-medium text-white">Simple</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="configMode"
                        checked={useSections}
                        onChange={() => setUseSections(true)}
                        className="mr-2 text-white focus:ring-white"
                      />
                      <span className="font-medium text-white">Section-wise</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
            </div>

            {/* Configuration Section */}
            <div className="space-y-8">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                  <Settings className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {useSections ? 'Section-wise Configuration' : 'Question Configuration'}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">Configure your question paper settings</p>
                </div>
              </div>
              
              {isGenerating ? (
                <div className="space-y-4">
                  <ConfigurationSkeleton />
                  {useSections && <SectionSkeleton />}
                  subject={config.subject}
                  duration={config.duration}
                  onSubjectChange={(subject) => setConfig(prev => ({ ...prev, subject }))}
                  onDurationChange={(duration) => setConfig(prev => ({ ...prev, duration }))}
                </div>
              ) : (
                <>
                  {useSections ? (
                    <SectionConfiguration 
                      sections={config.sections} 
                      onSectionsChange={(sections) => setConfig(prev => ({ ...prev, sections }))}
                    />
                  ) : (
                    <ConfigurationPanel config={config} onChange={setConfig} />
                  )}
                </>
              )}
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerateQuestions}
              disabled={
                (llmMode === 'api' && !apiKey) || 
                !syllabusContent || 
                isGenerating || 
                isProcessingFile
              }
              className="w-full flex items-center justify-center space-x-3 px-8 py-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl font-bold text-lg group transform hover:scale-105"
            >
              <Zap className="w-6 h-6 group-hover:animate-pulse" />
              <span>
                {isGenerating 
                  ? `Generating with ${llmMode === 'api' ? 'Cloud AI' : llmMode === 'both' ? 'Both (Local + Cloud)' : 'Instant Local AI'}...` 
                  : `Generate Questions ${llmMode === 'api' ? '(Cloud AI)' : llmMode === 'both' ? '(Both - Local + Cloud)' : '(Instant Local AI - Unlimited)'}`
                }
              </span>
            </button>
          </div>

          {/* Results Section */}
          <div className="space-y-8">
            {error && (
              <div className="p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-2xl">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">!</span>
                  </div>
                  <p className="text-red-600 dark:text-red-400 font-medium">{error}</p>
                </div>
              </div>
            )}

            {isGenerating && (
              <div className="space-y-8">
                <div className="text-center py-20">
                  <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Generating Questions</h3>
                  <p className="text-gray-600 dark:text-gray-400">AI is creating your question paper...</p>
                </div>
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <QuestionSkeleton key={i} />
                  ))}
                </div>
              </div>
            )}

            {questions.length > 0 && !isGenerating && (
              <div className="space-y-6">
                {/* Analytics */}
                {showAnalytics && (
                  <QuestionPaperAnalytics 
                    questions={questions} 
                    duration={config.duration} 
                    className="mb-6"
                  />
                )}

                <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 transition-colors duration-300">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center">
                        <FileText className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Generated Questions</h2>
                        <p className="text-gray-600 dark:text-gray-400">{questions.length} questions ready</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        onClick={handleShare}
                        className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 font-medium"
                      >
                        <Share2 className="w-4 h-4" />
                        <span>Share</span>
                      </button>
                      <div className="relative download-dropdown">
                        <button
                          onClick={() => setShowDownloadDropdown(!showDownloadDropdown)}
                          className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all duration-200 font-medium"
                        >
                          <Download className="w-4 h-4" />
                          <span>Download</span>
                          <ChevronDown className="w-4 h-4" />
                        </button>
                        {showDownloadDropdown && (
                          <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-10 overflow-hidden">
                            <div className="p-2">
                              <button
                                onClick={() => { handleDownload('pdf'); setShowDownloadDropdown(false); }}
                                className="block w-full text-left px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors font-medium text-gray-900 dark:text-white"
                              >
                                📄 PDF
                              </button>
                              <button
                                onClick={() => { handleDownload('docx'); setShowDownloadDropdown(false); }}
                                className="block w-full text-left px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors font-medium text-gray-900 dark:text-white"
                              >
                                📝 Word (.docx)
                              </button>
                              <div className="relative group">
                                <button
                                  onClick={() => setShowRealSubmenu(!showRealSubmenu)}
                                  className={`block w-full text-left px-4 py-3 rounded-lg transition-colors font-medium flex justify-between items-center ${
                                    showRealSubmenu 
                                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' 
                                      : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white'
                                  }`}
                                >
                                  🎓 Real Question Paper (Indian Format)
                                  <span className={`ml-2 transition-transform ${showRealSubmenu ? 'rotate-90' : ''}`}>▶</span>
                                </button>
                                {showRealSubmenu && (
                                  <div className="ml-4 mt-1 space-y-1">
                                    <button
                                      onClick={() => { handleDownload('real-school'); setShowDownloadDropdown(false); setShowRealSubmenu(false); }}
                                      className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors font-medium text-gray-700 dark:text-gray-300 text-sm"
                                    >
                                      🏫 School Board Format (CBSE/State Board)
                                    </button>
                                    <button
                                      onClick={() => { handleDownload('real-college'); setShowDownloadDropdown(false); setShowRealSubmenu(false); }}
                                      className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors font-medium text-gray-700 dark:text-gray-300 text-sm"
                                    >
                                      🎓 College/University Format (Anna University)
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      <button
                        onClick={handleCopy}
                        className="flex items-center space-x-2 px-6 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-all duration-200 font-medium"
                      >
                        <Copy className="w-4 h-4" />
                        <span>Copy</span>
                      </button>
                    </div>
                  </div>
                  <QuestionDisplay 
                    questions={questions} 
                    onEdit={handleEditQuestion}
                    subject={config.subject}
                    duration={config.duration}
                    totalMarks={useSections ? sectionTotalMarks : config.totalMarks}
                    className="question-paper-export"
                  />
                </div>
              </div>
            )}

            {!isProcessingFile && !isGenerating && questions.length === 0 && syllabusContent && (
              <div className="bg-white dark:bg-gray-800 p-12 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 text-center transition-colors duration-300">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FileText className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Ready to Generate</h3>
                <p className="text-gray-600 dark:text-gray-400 text-lg">Configure your question paper settings and click "Generate Questions"</p>
              </div>
            )}

            {!syllabusContent && !isProcessingFile && (
              <div className="bg-white dark:bg-gray-800 p-12 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 text-center transition-colors duration-300">
                <div className="relative mx-auto mb-6 w-fit">
                  <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                    <Brain className="w-8 h-8 text-white" />
                  </div>
                  <Sparkles className="w-6 h-6 text-yellow-400 absolute -top-2 -right-2" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">AI Question Paper Generator</h3>
                <p className="text-gray-600 dark:text-gray-400 text-lg">Upload your syllabus in any format to start generating intelligent question papers</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Onboarding Modal */}
      <Onboarding isOpen={showOnboarding} onClose={() => setShowOnboarding(false)} />
      
      {/* Subscription Modal */}
      <SubscriptionModal
        isOpen={showSubscriptionModal}
        onClose={() => setShowSubscriptionModal(false)}
        onUpgrade={() => {
          setSubscription(SubscriptionService.getSubscription());
          addToast({
            type: 'success',
            title: 'Plan Upgraded!',
            message: 'You now have unlimited API access. Enjoy!',
            duration: 5000
          });
        }}
      />
    </div>
  );
}

// Wrap the App with ToastProvider
const AppWithToast: React.FC = () => {
  return (
    <ToastProvider>
      <App />
    </ToastProvider>
  );
};

export default AppWithToast;