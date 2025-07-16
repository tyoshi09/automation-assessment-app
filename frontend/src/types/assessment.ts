export interface AssessmentForm {
  // 基本情報
  companyName: string;
  department: string;
  businessName: string;
  evaluationDate: string;
  evaluator: string;

  // 評価項目（1-5点）
  regularity: number;            // 定型・反復性
  procedureClarity: number;      // ルール・手順の明確性
  exceptionFrequency: number;    // 例外処理の頻度
  procedureDecision: number;     // 作業手順の決定
  learningAdaptation: number;    // 学習・適応の必要性
  dataConfidentiality: number;   // データ・情報の機密性
  realtimeRequirement: number;   // リアルタイム性要求
  systemOperation: number;       // システム操作
  dataProcessing: number;        // データ処理
  apiIntegration: number;        // API連携
  securityConstraints: number;   // セキュリティ制約
  timeSavingEffect: number;      // 時間短縮効果
  qualityImprovement: number;    // 品質向上効果
}

export interface AssessmentResult {
  id: string;
  companyName: string;
  department: string;
  businessName: string;
  totalScore: number;
  knockoutFactors: string[];
  techLevel: 'Lv1:RPA' | 'Lv2:AI+ワークフロー' | 'Lv3:エージェントAI' | '導入困難';
  feasibility: '高' | '中' | '低';
  priority: '高' | '中' | '低';
  recommendedTool: string;
  evaluationDate: string;
  evaluator: string;
}

export interface EvaluationCriteria {
  field: keyof AssessmentForm;
  label: string;
  description: string;
  options: {
    value: number;
    label: string;
  }[];
}