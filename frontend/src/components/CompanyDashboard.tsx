import React, { useState } from 'react';
import { AssessmentResult } from '../types/assessment';
import { assessmentService } from '../services/assessmentService';
import StatisticsCharts from './StatisticsCharts';
import './CompanyDashboard.css';

interface CompanyStatistics {
  totalAssessments: number;
  averageScore: number;
  techLevelDistribution: Record<string, number>;
  feasibilityDistribution: Record<string, number>;
  recentAssessments: AssessmentResult[];
}

const CompanyDashboard: React.FC = () => {
  const [companyName, setCompanyName] = useState('');
  const [statistics, setStatistics] = useState<CompanyStatistics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const stats = await assessmentService.getCompanyStatistics(companyName);
      setStatistics(stats);
    } catch (err) {
      setError('企業データの取得に失敗しました');
      setStatistics(null);
    } finally {
      setLoading(false);
    }
  };

  const getTechLevelColor = (level: string) => {
    switch (level) {
      case 'Lv1:RPA': return '#28a745';
      case 'Lv2:AI+ワークフロー': return '#fd7e14';
      case 'Lv3:エージェントAI': return '#6f42c1';
      case '導入困難': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const getFeasibilityColor = (feasibility: string) => {
    switch (feasibility) {
      case '高': return '#28a745';
      case '中': return '#ffc107';
      case '低': return '#dc3545';
      default: return '#6c757d';
    }
  };

  return (
    <div className="company-dashboard">
      <h2>企業分析ダッシュボード</h2>
      
      <form onSubmit={handleSearch} className="search-form">
        <div className="search-group">
          <input
            type="text"
            placeholder="企業名を入力してください"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? '検索中...' : '分析開始'}
          </button>
        </div>
      </form>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {statistics && (
        <div className="statistics-container">
          <div className="stats-header">
            <h3>{companyName} の業務自動化分析結果</h3>
            <div className="stats-summary">
              <div className="stat-item">
                <span className="stat-label">総評価数</span>
                <span className="stat-value">{statistics.totalAssessments}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">平均スコア</span>
                <span className="stat-value">{statistics.averageScore}/65</span>
              </div>
            </div>
          </div>

          <StatisticsCharts
            techLevelDistribution={statistics.techLevelDistribution}
            feasibilityDistribution={statistics.feasibilityDistribution}
            totalAssessments={statistics.totalAssessments}
          />

          <div className="recent-assessments">
            <h4>最近の評価結果</h4>
            <div className="assessments-table">
              <table>
                <thead>
                  <tr>
                    <th>業務名</th>
                    <th>部門</th>
                    <th>スコア</th>
                    <th>技術レベル</th>
                    <th>導入可能性</th>
                    <th>評価日</th>
                  </tr>
                </thead>
                <tbody>
                  {statistics.recentAssessments.map((assessment) => (
                    <tr key={assessment.id}>
                      <td>{assessment.businessName}</td>
                      <td>{assessment.department}</td>
                      <td>{assessment.totalScore}/65</td>
                      <td>
                        <span
                          className="tech-level-badge"
                          style={{ backgroundColor: getTechLevelColor(assessment.techLevel) }}
                        >
                          {assessment.techLevel}
                        </span>
                      </td>
                      <td>
                        <span
                          className="feasibility-badge"
                          style={{ backgroundColor: getFeasibilityColor(assessment.feasibility) }}
                        >
                          {assessment.feasibility}
                        </span>
                      </td>
                      <td>{assessment.evaluationDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyDashboard;