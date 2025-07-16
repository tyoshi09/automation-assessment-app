import React, { useState, useEffect } from 'react';
import { AssessmentResult } from '../types/assessment';
import { assessmentService } from '../services/assessmentService';
import './AdminDashboard.css';

const AdminDashboard: React.FC = () => {
  const [assessments, setAssessments] = useState<AssessmentResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'company' | 'score'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    loadAllAssessments();
  }, []);

  const loadAllAssessments = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await assessmentService.getAllAssessments();
      setAssessments(data);
    } catch (err) {
      setError('データの取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedItems.size === 0) return;

    try {
      setLoading(true);
      const deletePromises = Array.from(selectedItems).map(id => {
        const assessment = assessments.find(a => a.id === id);
        if (assessment) {
          return assessmentService.deleteAssessment(id, assessment.companyName);
        }
        return Promise.resolve();
      });

      await Promise.all(deletePromises);
      
      // データを再読み込み
      await loadAllAssessments();
      setSelectedItems(new Set());
      setShowDeleteConfirm(false);
    } catch (err) {
      setError('削除に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectItem = (id: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedItems(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedItems.size === filteredAndSortedAssessments.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(filteredAndSortedAssessments.map(a => a.id)));
    }
  };

  const filteredAndSortedAssessments = assessments
    .filter(assessment => 
      assessment.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assessment.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assessment.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assessment.evaluator.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'date':
          comparison = new Date(a.evaluationDate).getTime() - new Date(b.evaluationDate).getTime();
          break;
        case 'company':
          comparison = a.companyName.localeCompare(b.companyName);
          break;
        case 'score':
          comparison = a.totalScore - b.totalScore;
          break;
      }
      
      return sortOrder === 'desc' ? -comparison : comparison;
    });

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP');
  };

  const getUniqueCompanies = () => {
    const companies = new Set(assessments.map(a => a.companyName));
    return Array.from(companies).sort();
  };

  const getStats = () => {
    const totalAssessments = assessments.length;
    const uniqueCompanies = getUniqueCompanies().length;
    const averageScore = assessments.reduce((sum, a) => sum + a.totalScore, 0) / totalAssessments;
    
    return {
      totalAssessments,
      uniqueCompanies,
      averageScore: Math.round(averageScore * 10) / 10
    };
  };

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="loading">データを読み込み中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-dashboard">
        <div className="error-message">{error}</div>
        <button onClick={loadAllAssessments} className="retry-btn">
          再試行
        </button>
      </div>
    );
  }

  const stats = getStats();

  return (
    <div className="admin-dashboard">
      <h2>管理画面</h2>
      
      <div className="admin-stats">
        <div className="stat-card">
          <div className="stat-value">{stats.totalAssessments}</div>
          <div className="stat-label">総評価数</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.uniqueCompanies}</div>
          <div className="stat-label">企業数</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.averageScore}/65</div>
          <div className="stat-label">平均スコア</div>
        </div>
      </div>

      <div className="admin-controls">
        <div className="search-section">
          <input
            type="text"
            placeholder="企業名、業務名、部門名、評価者で検索..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="sort-section">
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value as 'date' | 'company' | 'score')}
            className="sort-select"
          >
            <option value="date">評価日順</option>
            <option value="company">企業名順</option>
            <option value="score">スコア順</option>
          </select>
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="sort-order-btn"
          >
            {sortOrder === 'desc' ? '↓' : '↑'}
          </button>
        </div>

        <div className="action-section">
          <button
            onClick={() => setShowDeleteConfirm(true)}
            disabled={selectedItems.size === 0}
            className="delete-btn"
          >
            選択項目を削除 ({selectedItems.size})
          </button>
          <button
            onClick={loadAllAssessments}
            className="refresh-btn"
          >
            🔄 更新
          </button>
        </div>
      </div>

      <div className="assessment-table-container">
        <table className="assessment-table">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={selectedItems.size === filteredAndSortedAssessments.length && filteredAndSortedAssessments.length > 0}
                  onChange={handleSelectAll}
                />
              </th>
              <th>企業名</th>
              <th>業務名</th>
              <th>部門</th>
              <th>評価者</th>
              <th>スコア</th>
              <th>技術レベル</th>
              <th>導入可能性</th>
              <th>評価日</th>
              <th>作成日時</th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedAssessments.map((assessment) => (
              <tr key={assessment.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedItems.has(assessment.id)}
                    onChange={() => handleSelectItem(assessment.id)}
                  />
                </td>
                <td>{assessment.companyName}</td>
                <td>{assessment.businessName}</td>
                <td>{assessment.department}</td>
                <td>{assessment.evaluator}</td>
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
                <td>{formatDate(assessment.evaluationDate)}</td>
                <td>{assessment.createdAt ? formatDate(assessment.createdAt) : '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredAndSortedAssessments.length === 0 && (
          <div className="no-data">
            {searchTerm ? '検索結果が見つかりません' : 'データがありません'}
          </div>
        )}
      </div>

      {showDeleteConfirm && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>削除確認</h3>
            <p>選択した {selectedItems.size} 件のデータを削除しますか？</p>
            <p className="warning">この操作は取り消せません。</p>
            <div className="modal-actions">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="cancel-btn"
              >
                キャンセル
              </button>
              <button
                onClick={handleDeleteSelected}
                className="confirm-delete-btn"
              >
                削除する
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;