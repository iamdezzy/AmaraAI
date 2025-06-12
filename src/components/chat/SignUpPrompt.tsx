import React from 'react';
import { Sparkles, ArrowRight, Star, Crown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function SignUpPrompt() {
  const navigate = useNavigate();

  const handleTrialSignUp = () => {
    sessionStorage.setItem('amara-signup-path', 'trial');
    navigate('/signup?plan=trial');
  };

  const handleFreemiumSignUp = () => {
    sessionStorage.setItem('amara-signup-path', 'freemium');
    navigate('/signup?plan=freemium');
  };

  const handleSignIn = () => {
    navigate('/signin');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-700/50 rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6">
        <div className="flex flex-col gap-4">
          {/* Header */}
          <div className="text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-2 mb-2">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 dark:text-purple-400" />
              <h3 className="text-base sm:text-lg font-semibold text-purple-800 dark:text-purple-200">
                Unlock Your Full Healing Journey
              </h3>
            </div>
            <p className="text-purple-600 dark:text-purple-300 text-xs sm:text-sm">
              Choose the plan that fits your needs and continue growing
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Trial Button - Primary */}
            <div className="flex-1">
              <button
                onClick={handleTrialSignUp}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 sm:px-6 py-3 sm:py-4 rounded-lg sm:rounded-xl font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 text-sm sm:text-base relative"
              >
                {/* Popular Badge */}
                <div className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 px-2 py-0.5 rounded-full text-xs font-bold flex items-center gap-1">
                  <Crown className="w-3 h-3" />
                  Popular
                </div>
                <span>Start 7-Day Free Trial</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <div className="text-center mt-1">
                <span className="text-xs text-purple-600 dark:text-purple-400">Credit card required</span>
              </div>
            </div>

            {/* Freemium Button - Secondary */}
            <div className="flex-1">
              <button
                onClick={handleFreemiumSignUp}
                className="w-full bg-white dark:bg-gray-800 border border-purple-200 dark:border-purple-700 text-purple-700 dark:text-purple-300 px-4 sm:px-6 py-3 sm:py-4 rounded-lg sm:rounded-xl font-medium hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-200 text-sm sm:text-base"
              >
                Choose Freemium
              </button>
              <div className="text-center mt-1">
                <span className="text-xs text-purple-600 dark:text-purple-400">Always free</span>
              </div>
            </div>

            {/* Sign In Button - Tertiary */}
            <div className="sm:w-auto">
              <button
                onClick={handleSignIn}
                className="w-full sm:w-auto bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-4 sm:px-6 py-3 sm:py-4 rounded-lg sm:rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 text-sm sm:text-base whitespace-nowrap"
              >
                Sign In
              </button>
            </div>
          </div>

          {/* Features Preview */}
          <div className="flex flex-wrap justify-center lg:justify-start gap-3 sm:gap-4 text-xs text-purple-700 dark:text-purple-300">
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 flex-shrink-0" />
              <span>No commitment</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 flex-shrink-0" />
              <span>Cancel anytime</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 flex-shrink-0" />
              <span>Instant access</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}