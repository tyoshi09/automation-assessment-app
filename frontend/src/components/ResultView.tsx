import React from 'react';
import { AssessmentResult } from '../types/assessment';
import './ResultView.css';

interface Props {
  result: AssessmentResult;
  onNewAssessment: () => void;
}

const ResultView: React.FC<Props> = ({ result, onNewAssessment }) => {
  const getTechLevelColor = (level: AssessmentResult['techLevel']) => {
    switch (level) {
      case 'Lv1:RPA': return '#27ae60';
      case 'Lv2:AI+ワークフロー': return '#f39c12';
      case 'Lv3:エージェントAI': return '#9b59b6';
      case '導入困難': return '#e74c3c';
      default: return '#95a5a6';
    }
  };

  const getFeasibilityColor = (feasibility: AssessmentResult['feasibility']) => {
    switch (feasibility) {
      case '高': return '#27ae60';
      case '中': return '#f39c12';
      case '低': return '#e74c3c';
      default: return '#95a5a6';
    }
  };

  return (
    <div className="result-view">
      <h2>評価結果</h2>
      
      <div className="result-header">
        <div className="business-info">
          <h3>{result.companyName} - {result.department}</h3>
          <h4>{result.businessName}</h4>
          <p>評価日: {result.evaluationDate} | 評価者: {result.evaluator}</p>
        </div>
        <div className="total-score">
          <span className="score-label">総合得点</span>
          <span className="score-value">{result.totalScore}</span>
          <span className="score-max">/65</span>
        </div>
      </div>

      <div className="result-grid">
        <div className="result-card">
          <h4>技術レベル</h4>
          <div 
            className="tech-level"
            style={{ backgroundColor: getTechLevelColor(result.techLevel) }}
          >
            {result.techLevel}
          </div>
        </div>

        <div className="result-card">
          <h4>導入可能性</h4>
          <div 
            className="feasibility"
            style={{ backgroundColor: getFeasibilityColor(result.feasibility) }}
          >
            {result.feasibility}
          </div>
        </div>

        <div className="result-card">
          <h4>優先度</h4>
          <div 
            className="priority"
            style={{ backgroundColor: getFeasibilityColor(result.priority) }}
          >
            {result.priority}
          </div>
        </div>
      </div>

      <div className="recommended-tool">
        <h4>推奨ツール</h4>
        <p>{result.recommendedTool}</p>
      </div>

      {result.knockoutFactors.length > 0 && (
        <div className="knockout-factors">
          <h4>⚠️ ノックアウトファクター</h4>
          <ul>
            {result.knockoutFactors.map((factor, index) => (
              <li key={index}>{factor}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="result-actions">
        <button onClick={onNewAssessment} className="new-assessment-btn">
          新しい評価を開始
        </button>
      </div>
    </div>
  );
};

export default ResultView;