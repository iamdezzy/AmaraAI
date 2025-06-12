import React, { useState, useEffect } from 'react';
import { X, Sparkles, MessageCircle, Mic, Heart, ArrowRight, Star, Crown, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface TrialLimitModalProps {
  onClose: () => void;
  userName: string;
}

export function TrialLimitModal({ onClose, userName }: TrialLimitModalProps) {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleTrialSignUp = () => {
    // Store the user's choice for post-signup routing
    sessionStorage.setItem('amara-signup-path', 'trial');
    navigate('/signup?plan=trial');
  };

  const handleFreemiumSignUp = () => {
    // Store the user's choice for post-signup routing
    sessionStorage.setItem('amara-signup-path', 'freemium');
    navigate('/signup?plan=freemium');
  };

  const handleSignIn = () => {
    navigate('/signin');
  };

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  const trialFeatures = [
    {
      icon: MessageCircle,
      text: "Unlimited conversations"
    },
    {
      icon: Mic,
      text: "Voice therapy sessions"
    },
    {
      icon: Heart,
      text: "Advanced mood tracking"
    },
    {
      icon: Star,
      text: "Personalized insights"
    }
  ];

  const freemiumFeatures = [
    {
      icon: MessageCircle,
      text: "5 conversations per day"
    },
    {
      icon: Heart,
      text: "Basic mood logging"
    },
    {
      icon: Zap,
      text: "Core AI support"
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm">
      <div 
        className={`relative w-full max-w-lg bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 transition-all duration-300 max-h-[90vh] overflow-y-auto ${
          isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
      >
        {/* Close Button */}
        <button
          onClick={handleDismiss}
          className="absolute top-3 sm:top-4 right-3 sm:right-4 p-1.5 sm:p-2 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 z-10"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* Content */}
        <div className="p-4 sm:p-6 lg:p-8">
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 animate-pulse">
              <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-purple-600 dark:text-purple-400" />
            </div>
            
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-3 sm:mb-4 px-2">
              Choose Your Healing Path
            </h2>
            
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed px-2">
              {userName}, you've experienced Amara's support. Continue your journey with the plan that fits your needs.
            </p>
          </div>

          {/* Plan Options */}
          <div className="space-y-4 sm:space-y-6 mb-6 sm:mb-8">
            {/* Premium Trial Option */}
            <div className="relative bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-2 border-purple-200 dark:border-purple-700/50 rounded-2xl p-4 sm:p-6">
              {/* Popular Badge */}
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                  <Crown className="w-3 h-3" />
                  Most Popular
                </div>
              </div>

              <div className="text-center mb-4">
                <h3 className="text-lg sm:text-xl font-bold text-purple-800 dark:text-purple-200 mb-2">
                  7-Day Free Trial
                </h3>
                <p className="text-sm text-purple-600 dark:text-purple-300 mb-4">
                  Full access to everything Amara offers
                </p>
                
                {/* Features */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {trialFeatures.map((feature, index) => {
                    const Icon = feature.icon;
                    return (
                      <div key={index} className="flex items-center gap-2 text-xs sm:text-sm text-purple-700 dark:text-purple-300">
                        <Icon className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                        <span>{feature.text}</span>
                      </div>
                    );
                  })}
                </div>

                <div className="text-xs text-purple-600 dark:text-purple-400 mb-4">
                  Credit card required • Cancel anytime
                </div>
              </div>

              <button
                onClick={handleTrialSignUp}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 sm:py-4 rounded-xl font-bold text-sm sm:text-base transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                <span>Start 7-Day Free Trial</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            {/* Freemium Option */}
            <div className="bg-white dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-2xl p-4 sm:p-6">
              <div className="text-center mb-4">
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                  Continue with Freemium
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                  Basic support, always free
                </p>
                
                {/* Features */}
                <div className="space-y-2 mb-4">
                  {freemiumFeatures.map((feature, index) => {
                    const Icon = feature.icon;
                    return (
                      <div key={index} className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-300 justify-center">
                        <Icon className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                        <span>{feature.text}</span>
                      </div>
                    );
                  })}
                </div>

                <div className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                  No credit card required
                </div>
              </div>

              <button
                onClick={handleFreemiumSignUp}
                className="w-full bg-gray-100 dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200 px-6 py-3 sm:py-4 rounded-xl font-semibold text-sm sm:text-base transition-all duration-200"
              >
                Continue with Freemium
              </button>
            </div>
          </div>

          {/* Sign In Option */}
          <div className="text-center mb-4">
            <button
              onClick={handleSignIn}
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors duration-200 underline"
            >
              Already have an account? Sign In
            </button>
          </div>

          {/* Dismiss Option */}
          <div className="text-center">
            <button
              onClick={handleDismiss}
              className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200"
            >
              Maybe later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}