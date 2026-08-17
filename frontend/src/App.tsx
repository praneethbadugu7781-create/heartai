import React, { useState, useEffect } from 'react';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { LandingPage } from './pages/LandingPage';
import { AssessmentPage } from './pages/AssessmentPage';
import { ResultsPage } from './pages/ResultsPage';
import { ModelPerformancePage } from './pages/ModelPerformancePage';
import { HistoryPage } from './pages/HistoryPage';
import { AboutPage } from './pages/AboutPage';
import { AssessmentRecord } from './services/types';
import { storage } from './services/storage';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('landing');
  const [activeAssessment, setActiveAssessment] = useState<AssessmentRecord | null>(() => {
    return storage.getLastResult();
  });

  const handleAssessmentComplete = (record: AssessmentRecord) => {
    setActiveAssessment(record);
    setActiveTab('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectHistoryAssessment = (record: AssessmentRecord) => {
    setActiveAssessment(record);
    setActiveTab('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRetake = () => {
    setActiveTab('assessment');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF9] text-surface-body selection:bg-brand-100 selection:text-brand-900 font-sans">
      {/* Sticky Elevated Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Main Page Content Body */}
      <main className="flex-1 pt-20">
        {activeTab === 'landing' && (
          <LandingPage
            onStartAssessment={() => {
              setActiveTab('assessment');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onExploreModels={() => {
              setActiveTab('models');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onViewMethodology={() => {
              setActiveTab('about');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {activeTab === 'assessment' && (
          <AssessmentPage onAssessmentComplete={handleAssessmentComplete} />
        )}

        {activeTab === 'results' && (
          activeAssessment ? (
            <ResultsPage
              assessment={activeAssessment}
              onRetake={handleRetake}
            />
          ) : (
            <AssessmentPage onAssessmentComplete={handleAssessmentComplete} />
          )
        )}

        {activeTab === 'models' && <ModelPerformancePage />}

        {activeTab === 'history' && (
          <HistoryPage
            onSelectAssessment={handleSelectHistoryAssessment}
            onStartNew={handleRetake}
          />
        )}

        {activeTab === 'about' && <AboutPage />}
      </main>

      {/* Professional Medical SaaS Footer */}
      <Footer
        setActiveTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    </div>
  );
};

export default App;
