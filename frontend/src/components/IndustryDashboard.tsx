import React, { useState, useEffect } from 'react';
import { AssessmentResult } from '../types/assessment';
import { assessmentService } from '../services/assessmentService';
import StatisticsCharts from './StatisticsCharts';
import './IndustryDashboard.css';

interface IndustryStatistics {
  companiesCount: number;
  totalAssessments: number;
  averageScore: number;
  techLevelDistribution: Record<string, number>;
  feasibilityDistribution: Record<string, number>;
  topCompanies: Array<{
    companyName: string;
    assessmentCount: number;
    averageScore: number;
  }>;
}

interface SimilarBusiness {
  businessName: string;
  companyName: string;
  department: string;
  techLevel: string;
  totalScore: number;
  similarityScore: number;
}

const IndustryDashboard: React.FC = () => {
  const [statistics, setStatistics] = useState<IndustryStatistics | null>(null);
  const [similarBusinesses, setSimilarBusinesses] = useState<SimilarBusiness[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadIndustryData();
  }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  const loadIndustryData = async () => {
    try {
      setLoading(true);
      const stats = await assessmentService.getIndustryStatistics();
      setStatistics(stats);
      
      // 類似業務の計算
      const allAssessments = await assessmentService.getAllAssessments();
      const similar = findSimilarBusinesses(allAssessments);
      setSimilarBusinesses(similar);
    } catch (err) {
      setError('業界データの取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const findSimilarBusinesses = (assessments: AssessmentResult[]): SimilarBusiness[] => {
    const businessMap = new Map<string, AssessmentResult[]>();
    
    // 業務名でグループ化
    assessments.forEach(assessment => {
      const key = assessment.businessName.toLowerCase();
      if (!businessMap.has(key)) {
        businessMap.set(key, []);
      }
      businessMap.get(key)!.push(assessment);
    });

    const similarBusinesses: SimilarBusiness[] = [];
    
    // 複数の企業で同じ業務がある場合を抽出
    businessMap.forEach((businesses, businessName) => {
      if (businesses.length >= 2) {
        const uniqueCompanies = new Set(businesses.map(b => b.companyName));
        if (uniqueCompanies.size >= 2) {
          businesses.forEach(business => {
            const similarityScore = calculateSimilarityScore(business, businesses);
            similarBusinesses.push({
              businessName: business.businessName,
              companyName: business.companyName,
              department: business.department,
              techLevel: business.techLevel,
              totalScore: business.totalScore,
              similarityScore
            });
          });
        }
      }
    });

    return similarBusinesses
      .sort((a, b) => b.similarityScore - a.similarityScore)
      .slice(0, 20);
  };

  const calculateSimilarityScore = (target: AssessmentResult, group: AssessmentResult[]): number => {
    const others = group.filter(g => g.companyName !== target.companyName);
    if (others.length === 0) return 0;

    const scoreDiff = others.reduce((sum, other) => {
      return sum + Math.abs(target.totalScore - other.totalScore);
    }, 0) / others.length;

    const techLevelMatch = others.filter(other => other.techLevel === target.techLevel).length / others.length;
    
    return Math.round((100 - scoreDiff) * 0.7 + techLevelMatch * 100 * 0.3);
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

  const filteredSimilarBusinesses = similarBusinesses.filter(business =>
    business.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    business.companyName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="industry-dashboard">
        <div className="loading">業界データを読み込み中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="industry-dashboard">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  if (!statistics) {
    return (
      <div className="industry-dashboard">
        <div className="no-data">データが見つかりません</div>
      </div>
    );
  }

  return (
    <div className="industry-dashboard">
      <h2>業界横断分析</h2>
      
      <div className="industry-overview">
        <div className="overview-header">
          <h3>業界全体の概況</h3>
          <div className="overview-stats">
            <div className="stat-item">
              <span className="stat-label">参加企業数</span>
              <span className="stat-value">{statistics.companiesCount}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">総評価数</span>
              <span className="stat-value">{statistics.totalAssessments}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">業界平均スコア</span>
              <span className="stat-value">{statistics.averageScore}/65</span>
            </div>
          </div>
        </div>

        <StatisticsCharts
          techLevelDistribution={statistics.techLevelDistribution}
          feasibilityDistribution={statistics.feasibilityDistribution}
          totalAssessments={statistics.totalAssessments}
        />
      </div>

      <div className="top-companies">
        <h3>トップ企業ランキング</h3>
        <div className="companies-grid">
          {statistics.topCompanies.map((company, index) => (
            <div key={company.companyName} className="company-card">
              <div className="company-rank">#{index + 1}</div>
              <div className="company-info">
                <h4>{company.companyName}</h4>
                <p>{company.assessmentCount}件の評価</p>
                <div className="company-score">
                  平均スコア: {company.averageScore}/65
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="similar-businesses">
        <h3>類似業務マッチング</h3>
        <div className="search-container">
          <input
            type="text"
            placeholder="業務名・企業名で検索"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="similar-businesses-grid">
          {filteredSimilarBusinesses.map((business, index) => (
            <div key={`${business.companyName}-${business.businessName}-${index}`} className="similar-business-card">
              <div className="business-header">
                <h4>{business.businessName}</h4>
                <div className="similarity-score">
                  類似度: {business.similarityScore}%
                </div>
              </div>
              <div className="business-details">
                <p><strong>企業:</strong> {business.companyName}</p>
                <p><strong>部門:</strong> {business.department}</p>
                <p><strong>スコア:</strong> {business.totalScore}/65</p>
                <div className="tech-level">
                  <span
                    className="tech-level-badge"
                    style={{ backgroundColor: getTechLevelColor(business.techLevel) }}
                  >
                    {business.techLevel}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {filteredSimilarBusinesses.length === 0 && (
          <div className="no-results">
            {searchTerm ? '検索結果が見つかりません' : '類似業務が見つかりません'}
          </div>
        )}
      </div>
    </div>
  );
};

export default IndustryDashboard;