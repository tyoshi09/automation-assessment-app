import React, { useState } from 'react';
import AssessmentForm from './components/AssessmentForm';
import ResultView from './components/ResultView';
import { AssessmentResult } from './types/assessment';
import './App.css';

function App() {
  const [currentResult, setCurrentResult] = useState<AssessmentResult | null>(null);

  const handleAssessmentSubmit = (result: AssessmentResult) => {
    setCurrentResult(result);
  };

  const handleNewAssessment = () => {
    setCurrentResult(null);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>業務自動化評価システム</h1>
        <p>RPAやAIエージェントの導入適性を評価します</p>
      </header>
      
      <main className="App-main">
        {currentResult ? (
          <ResultView 
            result={currentResult} 
            onNewAssessment={handleNewAssessment}
          />
        ) : (
          <AssessmentForm onSubmit={handleAssessmentSubmit} />
        )}
      </main>
    </div>
  );
}

export default App;
