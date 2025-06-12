import React, { useState } from 'react';
import { NameInputScreen } from './NameInputScreen';
import { CountryInputScreen } from './CountryInputScreen';
import { FeelingInputScreen } from './FeelingInputScreen';
import { ChatInterface } from '../chat/ChatInterface';

interface PersonalizationData {
  name: string;
  country: string;
  feeling: string;
}

export function PersonalizationFlow() {
  const [currentScreen, setCurrentScreen] = useState(0);
  const [userData, setUserData] = useState<PersonalizationData>({
    name: '',
    country: '',
    feeling: ''
  });

  const updateUserData = (field: keyof PersonalizationData, value: string) => {
    setUserData(prev => ({ ...prev, [field]: value }));
  };

  const handleComplete = () => {
    // Store user data temporarily (could be localStorage, context, etc.)
    // SECURITY FIX: Only store non-sensitive data and only in development
    if (import.meta.env.DEV) {
      console.log('Personalization flow completed');
    }
    
    // Store minimal data for chat interface
    localStorage.setItem('amara-user-data', JSON.stringify({
      name: userData.name,
      country: userData.country,
      feeling: userData.feeling
    }));
    
    // Navigate to chat experience
    setCurrentScreen(3);
  };

  const screens = [
    <NameInputScreen 
      key="name" 
      value={userData.name}
      onNext={(name) => {
        updateUserData('name', name);
        setCurrentScreen(1);
      }} 
    />,
    <CountryInputScreen 
      key="country" 
      value={userData.country}
      onNext={(country) => {
        updateUserData('country', country);
        setCurrentScreen(2);
      }} 
    />,
    <FeelingInputScreen 
      key="feeling" 
      value={userData.feeling}
      userName={userData.name}
      onNext={(feeling) => {
        updateUserData('feeling', feeling);
        handleComplete();
      }} 
    />,
    <ChatInterface
      key="chat"
      userName={userData.name}
      userFeeling={userData.feeling}
      userCountry={userData.country}
    />
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Progress Indicator - Only show for first 3 screens */}
      {currentScreen < 3 && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50">
          <div className="flex items-center gap-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-gray-200/50 dark:border-gray-700/50">
            {[0, 1, 2].map((step) => (
              <div key={step} className="flex items-center">
                <div 
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    step <= currentScreen 
                      ? 'bg-purple-500 scale-125' 
                      : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                />
                {step < 2 && (
                  <div 
                    className={`w-8 h-0.5 mx-1 transition-all duration-300 ${
                      step < currentScreen 
                        ? 'bg-purple-500' 
                        : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {screens[currentScreen]}
    </div>
  );
}