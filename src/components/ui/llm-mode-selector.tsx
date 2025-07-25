import React from 'react';
import { Cloud, Cpu, Zap, Shield, Wifi, WifiOff } from 'lucide-react';

export type LLMMode = 'api' | 'local' | 'both';
export type LocalLLMModel = 'phi3' | 'mistral';

interface LLMModeProps {
  mode: LLMMode;
  onModeChange: (mode: LLMMode) => void;
  localLLMReady: boolean;
  isLoading: boolean;
  className?: string;
  localModel?: LocalLLMModel;
  onModelChange?: (model: LocalLLMModel) => void;
}

export const LLMModeSelector: React.FC<LLMModeProps> = ({
  mode,
  onModeChange,
  localLLMReady,
  isLoading,
  className = '',
  localModel = 'mistral',
  onModelChange
}) => {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors duration-300 ${className}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-white">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold">AI Mode Selection</h3>
            <p className="text-purple-100 text-sm">Choose your preferred AI processing method</p>
          </div>
        </div>
      </div>

      <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* API Mode */}
          <div
            onClick={() => onModeChange('api')}
            className={`relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
              mode === 'api'
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-lg'
                : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 bg-gray-50 dark:bg-gray-700'
            }`}
          >
            {mode === 'api' && (
              <div className="absolute top-4 right-4 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            )}
            
            <div className="flex items-center space-x-4 mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                mode === 'api' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
              }`}>
                <Cloud className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-gray-900 dark:text-white">Cloud API</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Gemini AI</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4 text-green-500" />
                <span className="text-sm text-gray-700 dark:text-gray-300">Fast & Reliable</span>
              </div>
              <div className="flex items-center space-x-2">
                <Wifi className="w-4 h-4 text-blue-500" />
                <span className="text-sm text-gray-700 dark:text-gray-300">Requires Internet</span>
              </div>
              <div className="flex items-center space-x-2">
                <Cloud className="w-4 h-4 text-purple-500" />
                <span className="text-sm text-gray-700 dark:text-gray-300">Advanced AI Models</span>
              </div>
            </div>

            <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-xl">
              <p className="text-xs text-green-700 dark:text-green-400 font-medium">
                ✓ Recommended for best results
              </p>
            </div>
          </div>

          {/* Local Mode */}
          <div
            onClick={() => onModeChange('local')}
            className={`relative p-6 rounded-2xl border-2 transition-all duration-300 cursor-pointer ${
              mode === 'local'
                ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 shadow-lg'
                : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 bg-gray-50 dark:bg-gray-700'
            }`}
          >
            {mode === 'local' && (
              <div className="absolute top-4 right-4 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            )}
            
            <div className="flex items-center space-x-4 mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                mode === 'local' ? 'bg-purple-500 text-white' : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
              }`}>
                <Cpu className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-gray-900 dark:text-white">Local AI</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Ready - Instant AI
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-green-500" />
                <span className="text-sm text-gray-700 dark:text-gray-300">100% Private</span>
              </div>
              <div className="flex items-center space-x-2">
                <WifiOff className="w-4 h-4 text-orange-500" />
                <span className="text-sm text-gray-700 dark:text-gray-300">Works Offline</span>
              </div>
              <div className="flex items-center space-x-2">
                <Cpu className="w-4 h-4 text-purple-500" />
                <span className="text-sm text-gray-700 dark:text-gray-300">Runs in Browser</span>
              </div>
            </div>

            <div className={`mt-4 p-3 rounded-xl ${
              'bg-green-50 dark:bg-green-900/20'
            }`}>
              <p className={`text-xs font-medium ${
                'text-green-700 dark:text-green-400'
              }`}>
                ✓ Instant Local AI - Always Ready
              </p>
            </div>
          </div>
        </div>

        {/* Mode Comparison */}
        <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-700 rounded-2xl">
          <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Quick Comparison</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              <h5 className="font-semibold text-blue-600 dark:text-blue-400 mb-2">Cloud API Benefits:</h5>
              <ul className="space-y-1 text-gray-700 dark:text-gray-300">
                <li>• Fastest generation speed</li>
                <li>• Most advanced AI models</li>
                <li>• Supports image processing</li>
                <li>• No device resource usage</li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-purple-600 dark:text-purple-400 mb-2">Local AI Benefits:</h5>
              <ul className="space-y-1 text-gray-700 dark:text-gray-300">
                <li>• Complete privacy protection</li>
                <li>• Works without internet</li>
                <li>• No API costs or limits</li>
                <li>• Instant unlimited generation</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};