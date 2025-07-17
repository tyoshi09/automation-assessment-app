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
    departmentExpansion: 3,
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
          {evaluationCriteria.map((criteria) => (
            <div key={criteria.field} className="evaluation-item">
              <div className="evaluation-header">
                <h4>{criteria.label}</h4>
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

        <div className="form-actions">
          <button type="submit" className="submit-btn">
            評価実行
          </button>
        </div>
      </form>
    </div>
  );
};

export default AssessmentForm;