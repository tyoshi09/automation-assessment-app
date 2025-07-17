import React, { useState } from 'react';
import { AssessmentForm as AssessmentFormType, AssessmentResult } from '../types/assessment';
import { evaluationCriteria } from '../data/evaluationCriteria';
import { calculateAssessmentResult } from '../utils/assessmentLogic';
import { assessmentService } from '../services/assessmentService';
import './AssessmentForm.css';

interface Props {
  onSubmit: (result: AssessmentResult) => void;
}

const AssessmentForm: React.FC<Props> = ({ onSubmit }) => {
  // 本日の日付を取得
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // ポップアップの状態管理
  const [showDetailPopup, setShowDetailPopup] = useState(false);
  const [selectedCriteria, setSelectedCriteria] = useState<typeof evaluationCriteria[0] | null>(null);

  const [form, setForm] = useState<AssessmentFormType>({
    companyName: '',
    department: '',
    businessName: '',
    evaluationDate: getTodayDate(),
    evaluator: '',
    // ビジネスインパクト軸
    monthlyWorkTime: 3,
    taskPersonality: 3,
    errorFrequency: 3,
    urgencyLevel: 3,
    // 技術実現性軸
    dataStructure: 3,
    procedureDocumentation: 3,
    exceptionHandling: 3,
    taskComplexity: 3,
    // 持続可能性軸
    taskFrequency: 3,
    businessContinuity: 3,
    maintenanceEase: 3
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = calculateAssessmentResult(form);
    
    try {
      const savedResult = await assessmentService.saveAssessment(result);
      onSubmit(savedResult);
    } catch (error) {
      console.error('評価結果の保存に失敗しました:', error);
      // エラーが発生してもローカルの結果を表示
      onSubmit(result);
    }
  };

  const handleInputChange = (field: keyof AssessmentFormType, value: string | number) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleShowDetail = (criteria: typeof evaluationCriteria[0]) => {
    setSelectedCriteria(criteria);
    setShowDetailPopup(true);
  };

  const handleCloseDetail = () => {
    setShowDetailPopup(false);
    setSelectedCriteria(null);
  };

  return (
    <div className="assessment-form">
      <h2>業務自動化評価</h2>
      
      <form onSubmit={handleSubmit}>
        {/* 基本情報 */}
        <div className="form-section">
          <h3>基本情報</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>企業名</label>
              <input
                type="text"
                value={form.companyName}
                onChange={(e) => handleInputChange('companyName', e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>部門名</label>
              <input
                type="text"
                value={form.department}
                onChange={(e) => handleInputChange('department', e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>業務名</label>
              <input
                type="text"
                value={form.businessName}
                onChange={(e) => handleInputChange('businessName', e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>評価日</label>
              <input
                type="date"
                value={form.evaluationDate}
                onChange={(e) => handleInputChange('evaluationDate', e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>評価者</label>
              <input
                type="text"
                value={form.evaluator}
                onChange={(e) => handleInputChange('evaluator', e.target.value)}
                required
              />
            </div>
          </div>
        </div>

        {/* 評価項目 */}
        <div className="form-section">
          <h3>評価項目</h3>
          
          {/* ビジネスインパクト軸 */}
          <div className="category-section">
            <h4 className="category-title">💰 ビジネスインパクト軸</h4>
            {evaluationCriteria.filter(c => c.category === 'business').map((criteria) => (
              <div key={criteria.field} className="evaluation-item">
                <div className="evaluation-header">
                  <h4 
                    className="clickable-label" 
                    onClick={() => handleShowDetail(criteria)}
                    title="クリックで詳細説明を表示"
                  >
                    {criteria.label} <span className="info-icon">ℹ️</span>
                  </h4>
                  <p>{criteria.description}</p>
                </div>
                <div className="evaluation-options">
                  {criteria.options.map((option) => (
                    <label key={option.value} className="radio-option">
                      <input
                        type="radio"
                        name={criteria.field}
                        value={option.value}
                        checked={form[criteria.field] === option.value}
                        onChange={(e) => handleInputChange(criteria.field, Number(e.target.value))}
                      />
                      <span className="radio-label">
                        <strong>{option.value}点:</strong> {option.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* 技術実現性軸 */}
          <div className="category-section">
            <h4 className="category-title">🔧 技術実現性軸</h4>
            {evaluationCriteria.filter(c => c.category === 'technical').map((criteria) => (
              <div key={criteria.field} className="evaluation-item">
                <div className="evaluation-header">
                  <h4 
                    className="clickable-label" 
                    onClick={() => handleShowDetail(criteria)}
                    title="クリックで詳細説明を表示"
                  >
                    {criteria.label} <span className="info-icon">ℹ️</span>
                  </h4>
                  <p>{criteria.description}</p>
                </div>
                <div className="evaluation-options">
                  {criteria.options.map((option) => (
                    <label key={option.value} className="radio-option">
                      <input
                        type="radio"
                        name={criteria.field}
                        value={option.value}
                        checked={form[criteria.field] === option.value}
                        onChange={(e) => handleInputChange(criteria.field, Number(e.target.value))}
                      />
                      <span className="radio-label">
                        <strong>{option.value}点:</strong> {option.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* 持続可能性軸 */}
          <div className="category-section">
            <h4 className="category-title">🔄 持続可能性軸</h4>
            {evaluationCriteria.filter(c => c.category === 'sustainability').map((criteria) => (
              <div key={criteria.field} className="evaluation-item">
                <div className="evaluation-header">
                  <h4 
                    className="clickable-label" 
                    onClick={() => handleShowDetail(criteria)}
                    title="クリックで詳細説明を表示"
                  >
                    {criteria.label} <span className="info-icon">ℹ️</span>
                  </h4>
                  <p>{criteria.description}</p>
                </div>
                <div className="evaluation-options">
                  {criteria.options.map((option) => (
                    <label key={option.value} className="radio-option">
                      <input
                        type="radio"
                        name={criteria.field}
                        value={option.value}
                        checked={form[criteria.field] === option.value}
                        onChange={(e) => handleInputChange(criteria.field, Number(e.target.value))}
                      />
                      <span className="radio-label">
                        <strong>{option.value}点:</strong> {option.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-btn">
            評価実行
          </button>
        </div>
      </form>

      {/* 詳細説明ポップアップ */}
      {showDetailPopup && selectedCriteria && (
        <div className="modal-overlay" onClick={handleCloseDetail}>
          <div className="modal detail-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{selectedCriteria.label}</h3>
              <button className="close-btn" onClick={handleCloseDetail}>×</button>
            </div>
            <div className="modal-content">
              <div className="detail-section">
                <h4>📝 概要</h4>
                <p>{selectedCriteria.description}</p>
              </div>
              <div className="detail-section">
                <h4>🎯 評価の目的</h4>
                <p>{selectedCriteria.detailDescription}</p>
              </div>
              <div className="detail-section">
                <h4>📊 評価基準</h4>
                <div className="criteria-options">
                  {selectedCriteria.options.map((option) => (
                    <div key={option.value} className="criteria-option">
                      <span className="option-score">{option.value}点</span>
                      <span className="option-label">{option.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssessmentForm;