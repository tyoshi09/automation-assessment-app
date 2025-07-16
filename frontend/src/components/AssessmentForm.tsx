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
  const [form, setForm] = useState<AssessmentFormType>({
    companyName: '',
    department: '',
    businessName: '',
    evaluationDate: new Date().toISOString().split('T')[0],
    evaluator: '',
    regularity: 3,
    procedureClarity: 3,
    exceptionFrequency: 3,
    procedureDecision: 3,
    learningAdaptation: 3,
    dataConfidentiality: 3,
    realtimeRequirement: 3,
    systemOperation: 3,
    dataProcessing: 3,
    apiIntegration: 3,
    securityConstraints: 3,
    timeSavingEffect: 3,
    qualityImprovement: 3
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