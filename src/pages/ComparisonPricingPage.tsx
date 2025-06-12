import React, { useState, useEffect } from 'react';
import { Check, X, Clock, MapPin, Shield, Heart, Brain, Zap, Crown, ArrowRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function ComparisonPricingPage() {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('yearly');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const comparisonPoints = [
    {
      category: 'Cost',
      icon: Crown,
      amara: 'Affordable Subscription',
      traditional: 'High Cost Per Session',
      amaraDetail: '$19/month or $15/month yearly',
      traditionalDetail: '$100-200+ per session'
    },
    {
      category: 'Availability',
      icon: Clock,
      amara: '24/7, On-Demand Access',
      traditional: 'Scheduled Appointments',
      amaraDetail: 'Instant support whenever you need it',
      traditionalDetail: 'Limited hours, weeks of waiting'
    },
    {
      category: 'Accessibility',
      icon: MapPin,
      amara: 'Anywhere with Internet',
      traditional: 'Location-Dependent',
      amaraDetail: 'From your home, office, or anywhere',
      traditionalDetail: 'Travel required, geographic limitations'
    },
    {
      category: 'Privacy & Comfort',
      icon: Shield,
      amara: 'Private, Non-Judgmental AI',
      traditional: 'In-Person Interaction',
      amaraDetail: 'Complete anonymity if desired',
      traditionalDetail: 'Potential social stigma concerns'
    },
    {
      category: 'Tools & Features',
      icon: Brain,
      amara: 'AI Insights & Digital Tools',
      traditional: 'Talk Therapy Focus',
      amaraDetail: 'Mood tracking, journaling, voice therapy',
      traditionalDetail: 'Conversation-based with homework'
    }
  ];

  const pricingPlans = {
    monthly: {
      price: 19,
      period: 'month',
      savings: null,
      description: 'Perfect for trying out premium features'
    },
    yearly: {
      price: 180,
      monthlyEquivalent: 15,
      period: 'year',
      savings: '20% off',
      description: 'Best value for your healing journey',
      popular: true
    }
  };

  const handleStartTrial = () => {
    // In a real app, this would redirect to payment processing
    console.log('Starting trial with plan:', selectedPlan);
    alert(`Starting 7-day free trial with ${selectedPlan} plan selected!`);
    // For demo purposes, redirect to a success page or dashboard
    navigate('/dashboard');
  };

  const handlePlanSelect = (plan: 'monthly' | 'yearly') => {
    setSelectedPlan(plan);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span 
              className="text-2xl sm:text-3xl font-light text-gray-800 dark:text-gray-100"
              style={{
                fontFamily: 'serif',
                letterSpacing: '0.02em',
                textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
              }}
            >
              𝒜𝓂𝒶𝓇𝒶
            </span>
          </div>
          <button
            onClick={() => navigate('/signin')}
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors duration-200"
          >
            Already have an account? Sign In
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Hero Section */}
        <div className={`text-center mb-12 sm:mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 border border-purple-200 dark:border-purple-700/50 px-4 py-2 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
              Welcome to Your Healing Journey
            </span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 dark:text-gray-100 mb-4 sm:mb-6">
            Amara vs. Traditional Therapy
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Discover the unique benefits Amara offers, designed to fit your life and budget
          </p>
        </div>

        {/* Comparison Section */}
        <div className={`mb-16 sm:mb-20 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100 text-center mb-8 sm:mb-12">
            Why Choose Amara?
          </h2>
          
          <div className="space-y-6 sm:space-y-8">
            {comparisonPoints.map((point, index) => {
              const Icon = point.icon;
              return (
                <div 
                  key={point.category}
                  className={`bg-white dark:bg-gray-800 rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-200 dark:border-gray-700 transition-all duration-1000`}
                  style={{ transitionDelay: `${400 + index * 100}ms` }}
                >
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
                    {/* Category */}
                    <div className="text-center lg:text-left">
                      <div className="flex items-center justify-center lg:justify-start gap-3 mb-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-xl flex items-center justify-center">
                          <Icon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                          {point.category}
                        </h3>
                      </div>
                    </div>

                    {/* Amara */}
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-4 border border-green-200 dark:border-green-700/50">
                      <div className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-green-800 dark:text-green-200 mb-1">
                            Amara: {point.amara}
                          </h4>
                          <p className="text-sm text-green-700 dark:text-green-300">
                            {point.amaraDetail}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Traditional */}
                    <div className="bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-800/50 dark:to-slate-800/50 rounded-xl p-4 border border-gray-200 dark:border-gray-600">
                      <div className="flex items-start gap-3">
                        <X className="w-5 h-5 text-gray-500 dark:text-gray-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-1">
                            Traditional: {point.traditional}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {point.traditionalDetail}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Pricing Section */}
        <div className={`transition-all duration-1000 delay-800 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">
              Choose Your Plan: Start Your 7-Day Free Trial
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              No commitment required • Cancel anytime during trial
            </p>
          </div>

          {/* Plan Selection */}
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-12">
              {/* Yearly Plan */}
              <div 
                className={`relative bg-white dark:bg-gray-800 rounded-2xl p-6 sm:p-8 border-2 cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                  selectedPlan === 'yearly' 
                    ? 'border-purple-500 shadow-lg shadow-purple-500/20' 
                    : 'border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600'
                }`}
                onClick={() => handlePlanSelect('yearly')}
              >
                {/* Popular Badge */}
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                    <Crown className="w-3 h-3" />
                    Best Value
                  </div>
                </div>

                <div className="text-center">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                    Yearly Plan
                  </h3>
                  <div className="mb-4">
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-3xl sm:text-4xl font-bold text-purple-600 dark:text-purple-400">
                        ${pricingPlans.yearly.price}
                      </span>
                      <span className="text-gray-600 dark:text-gray-400">/year</span>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Equals ${pricingPlans.yearly.monthlyEquivalent}/month
                    </div>
                    <div className="inline-flex items-center gap-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-1 rounded-full text-xs font-medium mt-2">
                      <Zap className="w-3 h-3" />
                      Save 20%
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {pricingPlans.yearly.description}
                  </p>
                </div>

                {/* Selection Indicator */}
                <div className={`absolute top-4 right-4 w-6 h-6 rounded-full border-2 transition-all duration-200 ${
                  selectedPlan === 'yearly'
                    ? 'border-purple-500 bg-purple-500'
                    : 'border-gray-300 dark:border-gray-600'
                }`}>
                  {selectedPlan === 'yearly' && (
                    <Check className="w-4 h-4 text-white absolute top-0.5 left-0.5" />
                  )}
                </div>
              </div>

              {/* Monthly Plan */}
              <div 
                className={`relative bg-white dark:bg-gray-800 rounded-2xl p-6 sm:p-8 border-2 cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                  selectedPlan === 'monthly' 
                    ? 'border-purple-500 shadow-lg shadow-purple-500/20' 
                    : 'border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600'
                }`}
                onClick={() => handlePlanSelect('monthly')}
              >
                <div className="text-center">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                    Monthly Plan
                  </h3>
                  <div className="mb-4">
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-3xl sm:text-4xl font-bold text-purple-600 dark:text-purple-400">
                        ${pricingPlans.monthly.price}
                      </span>
                      <span className="text-gray-600 dark:text-gray-400">/month</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {pricingPlans.monthly.description}
                  </p>
                </div>

                {/* Selection Indicator */}
                <div className={`absolute top-4 right-4 w-6 h-6 rounded-full border-2 transition-all duration-200 ${
                  selectedPlan === 'monthly'
                    ? 'border-purple-500 bg-purple-500'
                    : 'border-gray-300 dark:border-gray-600'
                }`}>
                  {selectedPlan === 'monthly' && (
                    <Check className="w-4 h-4 text-white absolute top-0.5 left-0.5" />
                  )}
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <div className="text-center">
              <button
                onClick={handleStartTrial}
                className="group bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 sm:px-12 py-4 sm:py-5 rounded-2xl text-lg sm:text-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-3 mx-auto animate-pulse"
              >
                <Heart className="w-6 h-6 animate-pulse" />
                <span>Start Your 7 Days Free Trial</span>
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
              
              <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                <p>✨ No commitment • Cancel anytime • Secure payment</p>
                <p className="mt-1">
                  After trial: ${selectedPlan === 'yearly' ? pricingPlans.yearly.monthlyEquivalent : pricingPlans.monthly.price}/month
                  {selectedPlan === 'yearly' && ' (billed annually)'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}