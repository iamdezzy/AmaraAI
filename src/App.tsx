import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { OnboardingPage } from './pages/OnboardingPage';
import { SignUpPage } from './pages/SignUpPage';
import { SignInPage } from './pages/SignInPage';
import { ComparisonPricingPage } from './pages/ComparisonPricingPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen transition-colors duration-300">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/comparison-pricing" element={<ComparisonPricingPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;