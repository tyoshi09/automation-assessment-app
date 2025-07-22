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
      case 'Lv.1:ワークフロー型': return '#27ae60';
      case 'Lv.2:検索＋生成型&AIエージェント型': return '#3498db';
      case 'Lv.0:自動不可': return '#e74c3c';
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

  // 軸ごとのスコア計算（ダミー実装 - 実際は計算ロジックを統合）
  const calculateAxisScore = (result: AssessmentResult, axis: string) => {
    // 実際の実装では、各軸の項目を合計する
    if (axis === 'business') return Math.floor(result.totalScore * 0.42);
    if (axis === 'technical') return Math.floor(result.totalScore * 0.33);
    return Math.floor(result.totalScore * 0.25);
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
          <span className="score-max">/60</span>
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

      <div className="assessment-rationale">
        <h4>📊 判定根拠</h4>
        <div className="rationale-section">
          <h5>技術レベル判定の根拠</h5>
          <p>{result.techLevelReason || '総合的な評価により判定されました'}</p>
        </div>
        
        <div className="rationale-section">
          <h5>評価の内訳</h5>
          <div className="score-breakdown">
            <div className="score-item">
              <span className="score-label">ビジネスインパクト</span>
              <span className="score-value">{calculateAxisScore(result, 'business')}/25点</span>
            </div>
            <div className="score-item">
              <span className="score-label">技術実現性</span>
              <span className="score-value">{calculateAxisScore(result, 'technical')}/20点</span>
            </div>
            <div className="score-item">
              <span className="score-label">持続可能性</span>
              <span className="score-value">{calculateAxisScore(result, 'sustainability')}/15点</span>
            </div>
          </div>
        </div>

        {result.outsourcingStatus && result.outsourcingStatus >= 4 && (
          <div className="rationale-section outsourcing-note">
            <p>💡 この業務は外注で実施されているため、自動化によるコスト削減効果が特に期待できます。</p>
          </div>
        )}
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