"use client";

import { buttonVariants } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Check, Star, Zap, Crown, Rocket } from "lucide-react";
import { useState, useRef } from "react";
import confetti from "canvas-confetti";

interface PricingPlan {
  name: string;
  price: string;
  yearlyPrice: string;
  period: string;
  features: string[];
  description: string;
  buttonText: string;
  href: string;
  isPopular: boolean;
  icon: React.ReactNode;
  badge?: string;
}

interface PricingProps {
  plans: PricingPlan[];
  title?: string;
  description?: string;
  onPlanSelect?: (plan: PricingPlan) => void;
}

export function Pricing({
  plans,
  title = "Choose Your AI Plan",
  description = "Start with unlimited local AI for free, upgrade for cloud power\nAll plans include professional question paper generation and export features.",
  onPlanSelect
}: PricingProps) {
  const [isMonthly, setIsMonthly] = useState(true);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const switchRef = useRef<HTMLButtonElement>(null);

  const handleToggle = (checked: boolean) => {
    setIsMonthly(!checked);
    if (checked && switchRef.current) {
      const rect = switchRef.current.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;

      confetti({
        particleCount: 50,
        spread: 60,
        origin: {
          x: x / window.innerWidth,
          y: y / window.innerHeight,
        },
        colors: [
          "#3b82f6",
          "#8b5cf6", 
          "#06b6d4",
          "#10b981",
        ],
        ticks: 200,
        gravity: 1.2,
        decay: 0.94,
        startVelocity: 30,
        shapes: ["circle"],
      });
    }
  };

  const handlePlanClick = (plan: PricingPlan) => {
    if (onPlanSelect) {
      onPlanSelect(plan);
    }
  };

  const formatPrice = (price: string) => {
    return price === "0" ? "Free" : `$${price}`;
  };

  return (
    <div className="container py-20 max-w-7xl mx-auto">
      <div className="text-center space-y-4 mb-12">
        <h2 className="text-4xl font-bold tracking-tight sm:text-5xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          {title}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-lg whitespace-pre-line max-w-3xl mx-auto">
          {description}
        </p>
      </div>

      <div className="flex justify-center items-center mb-10 space-x-4">
        <span className={`font-semibold transition-colors ${isMonthly ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
          Monthly
        </span>
        <label className="relative inline-flex items-center cursor-pointer">
          <Switch
            ref={switchRef as any}
            checked={!isMonthly}
            onCheckedChange={handleToggle}
            className="relative"
          />
        </label>
        <span className={`font-semibold transition-colors ${!isMonthly ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
          Annual
        </span>
        <span className="ml-2 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm font-semibold rounded-full">
          Save 20%
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan, index) => (
          <motion.div
            key={index}
            initial={{ y: 50, opacity: 0 }}
            whileInView={
              isDesktop
                ? {
                    y: plan.isPopular ? -20 : 0,
                    opacity: 1,
                    scale: plan.isPopular ? 1.05 : 1.0,
                  }
                : { y: 0, opacity: 1 }
            }
            viewport={{ once: true }}
            transition={{
              duration: 0.8,
              type: "spring",
              stiffness: 100,
              damping: 30,
              delay: index * 0.1,
            }}
            className={cn(
              `rounded-3xl border-2 p-8 bg-white dark:bg-gray-800 text-center relative shadow-xl hover:shadow-2xl transition-all duration-300`,
              plan.isPopular ? "border-blue-500 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20" : "border-gray-200 dark:border-gray-700",
              "flex flex-col h-full"
            )}
          >
            {plan.isPopular && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 px-6 rounded-full flex items-center shadow-lg">
                  <Star className="w-4 h-4 fill-current mr-2" />
                  <span className="font-bold text-sm">MOST POPULAR</span>
                </div>
              </div>
            )}

            {plan.badge && (
              <div className="absolute top-4 right-4 bg-green-500 text-white py-1 px-3 rounded-full text-xs font-bold">
                {plan.badge}
              </div>
            )}

            <div className="flex-1 flex flex-col">
              <div className="flex items-center justify-center mb-4">
                <div className={cn(
                  "w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg",
                  plan.name === "FREE" ? "bg-gradient-to-br from-green-500 to-emerald-600" :
                  plan.name === "PRO" ? "bg-gradient-to-br from-blue-500 to-blue-600" :
                  "bg-gradient-to-br from-purple-500 to-purple-600"
                )}>
                  <div className="text-white text-2xl">
                    {plan.icon}
                  </div>
                </div>
              </div>

              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {plan.name}
              </h3>

              <div className="mb-6">
                <div className="flex items-center justify-center gap-x-2">
                  <span className="text-5xl font-bold tracking-tight text-gray-900 dark:text-white">
                    {formatPrice(isMonthly ? plan.price : plan.yearlyPrice)}
                  </span>
                  {plan.price !== "0" && (
                    <span className="text-lg font-semibold text-gray-600 dark:text-gray-400">
                      /{plan.period}
                    </span>
                  )}
                </div>
                {plan.price !== "0" && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {isMonthly ? "billed monthly" : "billed annually"}
                  </p>
                )}
              </div>

              <ul className="space-y-4 mb-8 flex-1">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-left text-gray-700 dark:text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handlePlanClick(plan)}
                className={cn(
                  buttonVariants({
                    variant: plan.isPopular ? "default" : "outline",
                    size: "lg"
                  }),
                  "w-full text-lg font-bold py-4 rounded-xl transition-all duration-300 transform hover:scale-105",
                  plan.isPopular
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg"
                    : "border-2 hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400"
                )}
              >
                {plan.buttonText}
              </button>

              <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                {plan.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-16 text-center">
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          All plans include 24/7 support, regular updates, and access to new features
        </p>
        <div className="flex justify-center space-x-8 text-sm text-gray-500 dark:text-gray-400">
          <span>✓ No setup fees</span>
          <span>✓ Cancel anytime</span>
          <span>✓ 30-day money back</span>
        </div>
      </div>
    </div>
  );
}