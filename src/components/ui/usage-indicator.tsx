import React from 'react';
import { Zap, Crown, AlertCircle } from 'lucide-react';
import { SubscriptionService } from '../../services/subscriptionService';

interface UsageIndicatorProps {
  onUpgradeClick?: () => void;
  className?: string;
}

export const UsageIndicator: React.FC<UsageIndicatorProps> = ({ 
  onUpgradeClick, 
  className = '' 
}) => {
  const subscription = SubscriptionService.getSubscription();
  const remaining = SubscriptionService.getRemainingAPICalls();
  const status = SubscriptionService.getSubscriptionStatus();

  const getStatusColor = () => {
    if (subscription.plan !== 'free') return 'text-green-600 dark:text-green-400';
    if (remaining <= 1) return 'text-red-600 dark:text-red-400';
    if (remaining <= 2) return 'text-orange-600 dark:text-orange-400';
    return 'text-blue-600 dark:text-blue-400';
  };

  const getIcon = () => {
    if (subscription.plan !== 'free') return <Crown className="w-5 h-5" />;
    if (remaining <= 1) return <AlertCircle className="w-5 h-5" />;
    return <Zap className="w-5 h-5" />;
  };

  const getBgColor = () => {
    if (subscription.plan !== 'free') return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700';
    if (remaining <= 1) return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700';
    if (remaining <= 2) return 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-700';
    return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700';
  };

  return (
    <div className={`${getBgColor()} rounded-2xl p-4 border transition-colors duration-300 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`${getStatusColor()}`}>
            {getIcon()}
          </div>
          <div>
            <p className={`font-semibold ${getStatusColor()}`}>
              {subscription.plan === 'free' ? 'Free Plan' : `${subscription.plan.toUpperCase()} Plan`}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {subscription.plan === 'free' 
                ? `${remaining}/5 daily API calls remaining`
                : 'Unlimited API calls'
              }
            </p>
          </div>
        </div>

        {subscription.plan === 'free' && remaining <= 2 && onUpgradeClick && (
          <button
            onClick={onUpgradeClick}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 font-medium text-sm shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Upgrade
          </button>
        )}
      </div>

      {subscription.plan === 'free' && remaining === 0 && (
        <div className="mt-3 p-3 bg-red-100 dark:bg-red-900/30 rounded-xl">
          <p className="text-red-700 dark:text-red-300 text-sm font-medium">
            Daily API limit reached. Use Local AI (unlimited) or upgrade for more API calls.
          </p>
        </div>
      )}
    </div>
  );
};