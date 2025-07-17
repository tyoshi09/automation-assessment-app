export interface AssessmentForm {
  // 基本情報
  companyName: string;
  department: string;
  businessName: string;
  evaluationDate: string;
  evaluator: string;

  // ビジネスインパクト軸（1-5点）
  monthlyWorkTime: number;       // 月間作業時間
  taskPersonality: number;       // 作業の属人性
  errorFrequency: number;        // 現在のミス率
  urgencyLevel: number;          // 業務の緊急度

  // 技術実現性軸（1-5点）
  dataStructure: number;         // データの整理度
  procedureDocumentation: number; // 作業手順書の完備度
  exceptionHandling: number;     // 例外対応の頻度
  taskComplexity: number;        // 作業の複雑度

  // 持続可能性軸（1-5点）
  taskFrequency: number;         // 作業実施頻度
  businessContinuity: number;    // 業務の将来性
  maintenanceEase: number;       // 保守・メンテナンス性
}

export interface AssessmentResult {
  id: string;
  companyName: string;
  department: string;
  businessName: string;
  totalScore: number;
  knockoutFactors: string[];
  techLevel: 'ワークフロー型' | '検索+生成型' | 'AIエージェント型' | '導入困難';
  feasibility: '高' | '中' | '低';
  priority: '高' | '中' | '低';
  recommendedTool: string;
  evaluationDate: string;
  evaluator: string;
  createdAt?: string;
}

export interface EvaluationCriteria {
  field: keyof AssessmentForm;
  label: string;
  description: string;
  detailDescription: string;
  category: 'business' | 'technical' | 'sustainability';
  options: {
    value: number;
    label: string;
  }[];
}