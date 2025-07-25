import React from 'react';
import { BarChart3, Clock, Target, TrendingUp, PieChart } from 'lucide-react';
import { Question } from '../../types';

interface QuestionPaperAnalytics {
  totalQuestions: number;
  totalMarks: number;
  estimatedTime: number;
  difficultyDistribution: { easy: number; medium: number; hard: number };
  typeDistribution: { [key: string]: number };
  averageMarks: number;
  topicCoverage: string[];
}

interface AnalyticsProps {
  questions: Question[];
  duration: number;
  className?: string;
}

export const QuestionPaperAnalytics: React.FC<AnalyticsProps> = ({ questions, duration, className = '' }) => {
  const analytics = calculateAnalytics(questions, duration);

  return (
    <div className={`bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 rounded-2xl p-8 shadow-2xl border border-gray-200 dark:border-gray-700 transition-colors duration-300 ${className}`}>
      <div className="flex items-center space-x-3 mb-8">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
          <BarChart3 className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Question Paper Analytics</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Detailed insights about your question paper</p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <MetricCard
          icon={<Target className="w-5 h-5" />}
          title="Total Questions"
          value={analytics.totalQuestions.toString()}
          color="blue"
        />
        <MetricCard
          icon={<TrendingUp className="w-5 h-5" />}
          title="Total Marks"
          value={analytics.totalMarks.toString()}
          color="green"
        />
        <MetricCard
          icon={<Clock className="w-5 h-5" />}
          title="Est. Time"
          value={`${analytics.estimatedTime} min`}
          color="purple"
        />
        <MetricCard
          icon={<BarChart3 className="w-5 h-5" />}
          title="Avg Marks"
          value={analytics.averageMarks.toFixed(1)}
          color="orange"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Difficulty Distribution */}
        <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 transition-colors duration-300">
          <h4 className="font-bold text-gray-900 dark:text-white mb-6 text-lg">Difficulty Distribution</h4>
          <div className="space-y-4">
            <DifficultyBar label="Easy" count={analytics.difficultyDistribution.easy} total={analytics.totalQuestions} color="green" />
            <DifficultyBar label="Medium" count={analytics.difficultyDistribution.medium} total={analytics.totalQuestions} color="yellow" />
            <DifficultyBar label="Hard" count={analytics.difficultyDistribution.hard} total={analytics.totalQuestions} color="red" />
          </div>
        </div>

        {/* Question Type Distribution */}
        <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 transition-colors duration-300">
          <h4 className="font-bold text-gray-900 dark:text-white mb-6 text-lg">Question Types</h4>
          <div className="space-y-4">
            {Object.entries(analytics.typeDistribution).map(([type, count]) => (
              <QuestionTypeBar
                key={type}
                label={type}
                count={count}
                total={analytics.totalQuestions}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Topic Coverage */}
      {analytics.topicCoverage.length > 0 && (
        <div className="mt-8">
          <h4 className="font-bold text-gray-900 dark:text-white mb-4 text-lg">Topics Covered</h4>
          <div className="flex flex-wrap gap-3">
            {analytics.topicCoverage.slice(0, 8).map((topic, index) => (
              <span
                key={index}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-full font-medium shadow-lg"
              >
                {topic}
              </span>
            ))}
            {analytics.topicCoverage.length > 8 && (
              <span className="px-4 py-2 bg-gradient-to-r from-gray-500 to-gray-600 text-white text-sm rounded-full font-medium shadow-lg">
                +{analytics.topicCoverage.length - 8} more
              </span>
            )}
          </div>
        </div>
      )}
      
      {/* Time Analysis */}
      <div className="mt-8 p-6 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-2xl border border-purple-200 dark:border-purple-700">
        <h4 className="font-bold text-gray-900 dark:text-white mb-4 text-lg flex items-center">
          <Clock className="w-5 h-5 mr-2 text-purple-600 dark:text-purple-400" />
          Time Analysis
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-xl">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{analytics.estimatedTime} min</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Estimated Time</div>
          </div>
          <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-xl">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{duration} min</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Set Duration</div>
          </div>
          <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-xl">
            <div className={`text-2xl font-bold ${
              analytics.estimatedTime > duration * 1.2 ? 'text-red-600 dark:text-red-400' :
              analytics.estimatedTime < duration * 0.6 ? 'text-green-600 dark:text-green-400' :
              'text-blue-600 dark:text-blue-400'
            }`}>
              {analytics.estimatedTime > duration * 1.2 ? '⚠️' :
               analytics.estimatedTime < duration * 0.6 ? '✅' : '✅'}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {analytics.estimatedTime > duration * 1.2 ? 'Too Long' :
               analytics.estimatedTime < duration * 0.6 ? 'Good Buffer' : 'Well Balanced'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface MetricCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  color: 'blue' | 'green' | 'purple' | 'orange';
}

const MetricCard: React.FC<MetricCardProps> = ({ icon, title, value, color }) => {
  const colorClasses = {
    blue: 'bg-gradient-to-br from-blue-500 to-blue-600',
    green: 'bg-gradient-to-br from-green-500 to-green-600',
    purple: 'bg-gradient-to-br from-purple-500 to-purple-600',
    orange: 'bg-gradient-to-br from-orange-500 to-orange-600'
  };

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
      <div className="flex items-center space-x-4">
        <div className={`p-3 rounded-xl shadow-lg ${colorClasses[color]}`}>
          {icon}
        </div>
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
        </div>
      </div>
    </div>
  );
};

interface DifficultyBarProps {
  label: string;
  count: number;
  total: number;
  color: 'green' | 'yellow' | 'red';
}

const DifficultyBar: React.FC<DifficultyBarProps> = ({ label, count, total, color }) => {
  const percentage = total > 0 ? (count / total) * 100 : 0;
  const colorClasses = {
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500'
  };

  return (
    <div className="flex items-center space-x-3">
      <span className="text-sm text-gray-600 dark:text-gray-400 w-12">{label}</span>
      <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div
          className={`h-2 rounded-full ${colorClasses[color]}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-sm text-gray-600 dark:text-gray-400 w-8">{count}</span>
    </div>
  );
};

interface QuestionTypeBarProps {
  label: string;
  count: number;
  total: number;
}

const QuestionTypeBar: React.FC<QuestionTypeBarProps> = ({ label, count, total }) => {
  const percentage = total > 0 ? (count / total) * 100 : 0;
  const formatLabel = (label: string) => {
    return label.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <div className="flex items-center space-x-3">
      <span className="text-sm text-gray-600 dark:text-gray-400 w-20">{formatLabel(label)}</span>
      <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div
          className="h-2 rounded-full bg-blue-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-sm text-gray-600 dark:text-gray-400 w-8">{count}</span>
    </div>
  );
};

function calculateAnalytics(questions: Question[], duration: number): QuestionPaperAnalytics {
  const totalQuestions = questions.length;
  const totalMarks = questions.reduce((sum, q) => sum + q.marks, 0);
  const averageMarks = totalQuestions > 0 ? totalMarks / totalQuestions : 0;

  // Calculate difficulty distribution
  const difficultyDistribution = questions.reduce((acc, q) => {
    acc[q.difficulty as keyof typeof acc]++;
    return acc;
  }, { easy: 0, medium: 0, hard: 0 });

  // Calculate type distribution
  const typeDistribution = questions.reduce((acc, q) => {
    acc[q.type] = (acc[q.type] || 0) + 1;
    return acc;
  }, {} as { [key: string]: number });

  // Extract unique topics
  const topicCoverage = [...new Set(questions.map(q => q.topic))];

  // Estimate time based on question types and difficulty
  const estimatedTime = questions.reduce((time, q) => {
    let baseTime = 0;
    switch (q.type) {
      case 'multiple-choice':
        baseTime = 1;
        break;
      case 'true-false':
        baseTime = 0.5;
        break;
      case 'short-answer':
        baseTime = 3;
        break;
      case 'long-answer':
        baseTime = 8;
        break;
    }
    
    // Adjust for difficulty
    switch (q.difficulty) {
      case 'easy':
        baseTime *= 0.8;
        break;
      case 'hard':
        baseTime *= 1.5;
        break;
    }
    
    return time + baseTime;
  }, 0);

  return {
    totalQuestions,
    totalMarks,
    estimatedTime: Math.round(estimatedTime),
    difficultyDistribution,
    typeDistribution,
    averageMarks,
    topicCoverage
  };
} 