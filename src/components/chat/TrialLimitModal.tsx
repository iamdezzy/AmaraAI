import React, { useState, useEffect } from 'react';
import { X, Sparkles, MessageCircle, Mic, Heart, ArrowRight, Star } from 'lucide-react';
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

  const handleSignUp = () => {
    navigate('/signup');
  };

  const handleSignIn = () => {
    navigate('/signin');
  };

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  const features = [
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
      text: "Mood tracking & insights"
    },
    {
      icon: Star,
      text: "Personalized guidance"
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm">
      <div 
        className={`relative w-full max-w-sm sm:max-w-md bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 transition-all duration-300 max-h-[90vh] overflow-y-auto ${
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
          <div className="text-center mb-4 sm:mb-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 animate-pulse">
              <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-purple-600 dark:text-purple-400" />
            </div>
            
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-3 sm:mb-4 px-2">
              Unlock More Conversations
            </h2>
            
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed px-2">
              {userName}, you've reached your anonymous trial limit. Continue your healing journey with full access to Amara.
            </p>
          </div>

          {/* Features */}
          <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div 
                  key={index}
                  className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl"
                >
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <span className="text-gray-700 dark:text-gray-300 font-medium text-sm sm:text-base lg:text-lg">
                    {feature.text}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Trial Offer */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-700/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8">
            <div className="text-center">
              <p className="text-xs sm:text-sm text-purple-700 dark:text-purple-300 font-medium mb-1 sm:mb-2">
                🎉 Special Offer
              </p>
              <p className="text-xl sm:text-2xl font-bold text-purple-800 dark:text-purple-200 mb-1">
                7 Days Free Trial
              </p>
              <p className="text-xs sm:text-sm text-purple-600 dark:text-purple-400">
                No commitment • Cancel anytime
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 sm:space-y-4">
            <button
              onClick={handleSignUp}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 sm:px-8 py-4 sm:py-5 rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 sm:gap-3"
            >
              <span>Start 7-Day Free Trial</span>
              <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            
            <button
              onClick={handleSignIn}
              className="w-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-semibold transition-all duration-200 text-sm sm:text-base"
            >
              Already have an account? Sign In
            </button>
          </div>

          {/* Dismiss Option */}
          <div className="text-center mt-4 sm:mt-6">
            <button
              onClick={handleDismiss}
              className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200 underline"
            >
              Maybe later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}