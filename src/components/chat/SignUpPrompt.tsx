import React from 'react';
import { Sparkles, ArrowRight, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function SignUpPrompt() {
  const navigate = useNavigate();

  const handleSignUp = () => {
    navigate('/signup');
  };

  const handleSignIn = () => {
    navigate('/signin');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-700/50 rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6">
        <div className="flex flex-col lg:flex-row items-center gap-3 sm:gap-4">
          {/* Icon */}
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>

          {/* Content */}
          <div className="flex-1 text-center lg:text-left">
            <h3 className="text-base sm:text-lg font-semibold text-purple-800 dark:text-purple-200 mb-1">
              Unlock Your Full Healing Journey
            </h3>
            <p className="text-purple-600 dark:text-purple-300 text-xs sm:text-sm mb-2 sm:mb-3">
              Get unlimited conversations, voice therapy, mood tracking, and personalized insights
            </p>
            
            {/* Features */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-2 sm:gap-3">
              <div className="flex items-center gap-1 text-xs text-purple-700 dark:text-purple-300">
                <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 flex-shrink-0" />
                <span className="whitespace-nowrap">7-day free trial</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-purple-700 dark:text-purple-300">
                <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 flex-shrink-0" />
                <span className="whitespace-nowrap">No commitment</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-purple-700 dark:text-purple-300">
                <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 flex-shrink-0" />
                <span className="whitespace-nowrap">Cancel anytime</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-2 w-full lg:w-auto">
            <button
              onClick={handleSignUp}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-medium transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl text-sm sm:text-base whitespace-nowrap"
            >
              <span className="hidden sm:inline">Start Free Trial</span>
              <span className="sm:hidden">Start Trial</span>
              <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
            
            <button
              onClick={handleSignIn}
              className="bg-white dark:bg-gray-800 border border-purple-200 dark:border-purple-700 text-purple-700 dark:text-purple-300 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-medium hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-200 text-sm sm:text-base whitespace-nowrap"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}