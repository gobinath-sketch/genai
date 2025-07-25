import React, { useState } from 'react';
import { X, Zap, Crown, Rocket, CreditCard, Check } from 'lucide-react';
import { Pricing } from './pricing';
import { SubscriptionService } from '../../services/subscriptionService';
import { useToast } from './toast';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade?: () => void;
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ 
  isOpen, 
  onClose, 
  onUpgrade 
}) => {
  const { addToast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  if (!isOpen) return null;

  const plans = [
    {
      name: "FREE",
      price: "0",
      yearlyPrice: "0",
      period: "forever",
      features: [
        "Unlimited Local AI Generation",
        "5 Cloud API calls per day",
        "All question types supported",
        "PDF & Word export",
        "Basic templates",
        "Community support"
      ],
      description: "Perfect for getting started with AI question papers",
      buttonText: "Current Plan",
      href: "#",
      isPopular: false,
      icon: <Zap className="w-8 h-8" />,
      badge: "UNLIMITED LOCAL"
    },
    {
      name: "PRO",
      price: "19",
      yearlyPrice: "15",
      period: "month",
      features: [
        "Everything in Free",
        "Unlimited Cloud API calls",
        "Advanced AI models",
        "Priority generation speed",
        "Premium templates",
        "Image processing support",
        "Priority support",
        "Advanced analytics"
      ],
      description: "Ideal for teachers and educational professionals",
      buttonText: "Upgrade to Pro",
      href: "#",
      isPopular: true,
      icon: <Crown className="w-8 h-8" />
    },
    {
      name: "ENTERPRISE",
      price: "49",
      yearlyPrice: "39",
      period: "month",
      features: [
        "Everything in Pro",
        "Custom AI model training",
        "Bulk question generation",
        "API access for integration",
        "Custom branding",
        "Dedicated account manager",
        "SLA guarantee",
        "Advanced security"
      ],
      description: "For institutions and large organizations",
      buttonText: "Upgrade to Enterprise",
      href: "#",
      isPopular: false,
      icon: <Rocket className="w-8 h-8" />
    }
  ];

  const handlePlanSelect = async (plan: any) => {
    if (plan.name === 'FREE') {
      addToast({
        type: 'info',
        title: 'Already on Free Plan',
        message: 'You are currently on the free plan with unlimited Local AI!',
        duration: 3000
      });
      return;
    }

    setSelectedPlan(plan.name);
    setIsProcessing(true);

    try {
      let success = false;
      
      if (plan.name === 'PRO') {
        success = await SubscriptionService.upgradeToPro();
      } else if (plan.name === 'ENTERPRISE') {
        success = await SubscriptionService.upgradeToEnterprise();
      }

      if (success) {
        addToast({
          type: 'success',
          title: 'Upgrade Successful!',
          message: `Welcome to ${plan.name} plan! You now have unlimited access.`,
          duration: 5000
        });

        // Track successful upgrade
        SubscriptionService.incrementUsageStats('planUpgrades');

        if (onUpgrade) onUpgrade();
        onClose();
      } else {
        throw new Error('Upgrade failed');
      }
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Upgrade Failed',
        message: 'There was an issue processing your upgrade. Please try again.',
        duration: 5000
      });
    } finally {
      setIsProcessing(false);
      setSelectedPlan(null);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-3xl max-w-7xl w-full max-h-[95vh] overflow-y-auto border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between rounded-t-3xl">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Choose Your Plan</h2>
            <p className="text-gray-600 dark:text-gray-400">Upgrade for unlimited cloud AI power and advanced features</p>
          </div>
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="p-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all duration-200 disabled:opacity-50"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Processing Overlay */}
        {isProcessing && (
          <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-10 rounded-3xl">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-2xl border border-gray-200 dark:border-gray-700 text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Processing Upgrade</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Upgrading to {selectedPlan} plan...
              </p>
            </div>
          </div>
        )}

        {/* Pricing Component */}
        <div className="p-6">
          <Pricing 
            plans={plans}
            title="Unlock the Full Power of AI"
            description="Start with unlimited local AI for free, upgrade for cloud power and advanced features\nAll plans include professional question paper generation and export capabilities."
            onPlanSelect={handlePlanSelect}
          />
        </div>

        {/* Trust Indicators */}
        <div className="px-6 pb-6">
          <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-2xl p-6 border border-green-200 dark:border-green-700">
            <div className="flex items-center justify-center space-x-8 text-sm text-gray-700 dark:text-gray-300">
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-green-600" />
                <span>Secure Payment</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-green-600" />
                <span>Cancel Anytime</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-green-600" />
                <span>30-Day Money Back</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-green-600" />
                <span>Instant Activation</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};