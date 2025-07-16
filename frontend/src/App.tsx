import React, { useState } from 'react';
import AssessmentForm from './components/AssessmentForm';
import ResultView from './components/ResultView';
import CompanyDashboard from './components/CompanyDashboard';
import IndustryDashboard from './components/IndustryDashboard';
import { AssessmentResult } from './types/assessment';
import './App.css';

type ViewMode = 'assessment' | 'result' | 'dashboard' | 'industry';

function App() {
  const [currentView, setCurrentView] = useState<ViewMode>('assessment');
  const [currentResult, setCurrentResult] = useState<AssessmentResult | null>(null);

  const handleAssessmentSubmit = (result: AssessmentResult) => {
    setCurrentResult(result);
    setCurrentView('result');
  };

  const handleNewAssessment = () => {
    setCurrentResult(null);
    setCurrentView('assessment');
  };

  const handleViewChange = (view: ViewMode) => {
    setCurrentView(view);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>業務自動化評価システム</h1>
        <p>RPAやAIエージェントの導入適性を評価します</p>
        
        <nav className="App-nav">
          <button 
            className={currentView === 'assessment' ? 'active' : ''}
            onClick={() => handleViewChange('assessment')}
          >
            新規評価
          </button>
          <button 
            className={currentView === 'dashboard' ? 'active' : ''}
            onClick={() => handleViewChange('dashboard')}
          >
            企業分析
          </button>
          <button 
            className={currentView === 'industry' ? 'active' : ''}
            onClick={() => handleViewChange('industry')}
          >
            業界分析
          </button>
        </nav>
      </header>
      
      <main className="App-main">
        {currentView === 'assessment' && (
          <AssessmentForm onSubmit={handleAssessmentSubmit} />
        )}
        
        {currentView === 'result' && currentResult && (
          <ResultView 
            result={currentResult} 
            onNewAssessment={handleNewAssessment}
          />
        )}
        
        {currentView === 'dashboard' && (
          <CompanyDashboard />
        )}
        
        {currentView === 'industry' && (
          <IndustryDashboard />
        )}
      </main>
    </div>
  );
}

export default App;
