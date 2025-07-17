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
  const [showCriteriaModal, setShowCriteriaModal] = useState(false);

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
            onClick={() => setShowCriteriaModal(true)}
            className="criteria-btn"
          >
            📊 評価基準
          </button>
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

      {showCriteriaModal && (
        <div className="modal-overlay">
          <div className="modal criteria-modal">
            <h3>評価基準・判定ロジック</h3>
            
            <div className="criteria-section">
              <h4>🎯 技術レベル判定（13項目×5点満点=65点）</h4>
              <div className="scoring-overview">
                <div className="scoring-summary">
                  <p><strong>📊 スコア配点システム：</strong></p>
                  <ul>
                    <li>各項目1-5点 × 13項目 = 最大65点</li>
                    <li>点数が高いほど自動化に適している</li>
                    <li>技術レベルは複数条件の組み合わせで決定</li>
                  </ul>
                </div>
              </div>
              <div className="criteria-grid">
                <div className="criteria-item">
                  <div className="criteria-header">
                    <span className="tech-level-badge" style={{ backgroundColor: '#28a745' }}>Lv1:RPA</span>
                  </div>
                  <div className="criteria-content">
                    <p><strong>🎯 判定条件（AND条件）：</strong></p>
                    <ul>
                      <li><strong>RPA適用スコア</strong>：作業頻度+手順標準化+判断業務 ≥ 12点</li>
                      <li><strong>単純作業</strong>：判断業務の割合 ≥ 4点</li>
                      <li><strong>システム連携</strong>：使用システム数+連携難易度 ≥ 6点</li>
                    </ul>
                    <p><strong>💡 計算例：</strong><br/>
                    毎日(5点) + マニュアル化済み(5点) + 単純作業(5点) = 15点 ✅<br/>
                    判断業務の割合(4点) ✅ / システム連携(3+3=6点) ✅</p>
                    <p><strong>適用例：</strong>毎日の定型作業、Excel・CSV処理</p>
                    <p><strong>推奨ツール：</strong>Power Automate・UiPath・BizRobo!</p>
                  </div>
                </div>

                <div className="criteria-item">
                  <div className="criteria-header">
                    <span className="tech-level-badge" style={{ backgroundColor: '#fd7e14' }}>Lv2:AI+ワークフロー</span>
                  </div>
                  <div className="criteria-content">
                    <p><strong>🎯 判定条件（AND条件）：</strong></p>
                    <ul>
                      <li><strong>総合スコア</strong>：13項目の合計 ≥ 35点</li>
                      <li><strong>作業量</strong>：月間作業時間 ≥ 3点（5時間以上）</li>
                      <li><strong>除外条件</strong>：RPA・エージェントAI条件に該当しない</li>
                    </ul>
                    <p><strong>💡 計算例：</strong><br/>
                    総合スコア：39点（平均3点×13項目） ✅<br/>
                    月間作業時間：3点（5-20時間） ✅</p>
                    <p><strong>適用例：</strong>週数回の作業、一部判断必要、複数システム</p>
                    <p><strong>推奨ツール：</strong>Power Platform・Zapier・Make</p>
                  </div>
                </div>

                <div className="criteria-item">
                  <div className="criteria-header">
                    <span className="tech-level-badge" style={{ backgroundColor: '#6f42c1' }}>Lv3:エージェントAI</span>
                  </div>
                  <div className="criteria-content">
                    <p><strong>🎯 判定条件（AND条件）：</strong></p>
                    <ul>
                      <li><strong>AI適用スコア</strong>：(6-判断業務)+(6-データ入力)+文書処理 ≥ 8点</li>
                      <li><strong>文書形式</strong>：PDF・画像等の扱い ≤ 3点</li>
                      <li><strong>作業量</strong>：月間作業時間 ≥ 3点（5時間以上）</li>
                    </ul>
                    <p><strong>💡 計算例：</strong><br/>
                    判断業務多い(2点→4点) + 文章理解必要(1点→5点) + PDF処理(1点) = 10点 ✅<br/>
                    文書形式：1点（PDF・画像） ✅ / 作業時間：3点 ✅</p>
                    <p><strong>適用例：</strong>文章理解・要約、PDF処理、判断業務中心</p>
                    <p><strong>推奨ツール：</strong>Claude・ChatGPT・Microsoft Copilot</p>
                  </div>
                </div>

                <div className="criteria-item">
                  <div className="criteria-header">
                    <span className="tech-level-badge" style={{ backgroundColor: '#dc3545' }}>導入困難</span>
                  </div>
                  <div className="criteria-content">
                    <p><strong>🎯 判定条件（OR条件・いずれか該当）：</strong></p>
                    <ul>
                      <li><strong>機密性：</strong>機密データ = 1点</li>
                      <li><strong>緊急性：</strong>リアルタイム対応 = 1点</li>
                      <li><strong>承認：</strong>セキュリティ承認 = 1点</li>
                      <li><strong>効果：</strong>月間作業時間 = 1点（5時間未満）</li>
                    </ul>
                    <p><strong>💡 計算例：</strong><br/>
                    機密データ(1点) → 自動的に導入困難 ❌<br/>
                    月5時間未満(1点) → ROI低く導入困難 ❌</p>
                    <p><strong>推奨：</strong>業務標準化・セキュリティ承認後に再評価</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="criteria-section">
              <h4>⚠️ 自動化導入の阻害要因</h4>
              <div className="knockout-list">
                <div className="knockout-item">機密データのため自動化困難</div>
                <div className="knockout-item">リアルタイム対応が必要</div>
                <div className="knockout-item">セキュリティ承認が困難</div>
                <div className="knockout-item">投資対効果が低い（月5時間未満）</div>
              </div>
            </div>

            <div className="criteria-section">
              <h4>📈 導入可能性判定（ROI重視）</h4>
              <div className="feasibility-grid">
                <div className="feasibility-item">
                  <span className="feasibility-badge" style={{ backgroundColor: '#28a745' }}>高</span>
                  <span>月20時間以上 + 高品質化効果 + 標準化済み</span>
                </div>
                <div className="feasibility-item">
                  <span className="feasibility-badge" style={{ backgroundColor: '#ffc107' }}>中</span>
                  <span>月5-20時間 + 一定の効果が見込める</span>
                </div>
                <div className="feasibility-item">
                  <span className="feasibility-badge" style={{ backgroundColor: '#dc3545' }}>低</span>
                  <span>月5時間未満 または 複雑すぎて効果が見込めない</span>
                </div>
              </div>
            </div>

            <div className="modal-actions">
              <button
                onClick={() => setShowCriteriaModal(false)}
                className="close-btn"
              >
                閉じる
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;