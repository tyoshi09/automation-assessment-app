import { AssessmentForm, AssessmentResult } from '../types/assessment';

export const calculateAssessmentResult = (form: AssessmentForm): AssessmentResult => {
  // 総得点計算（11項目×5点=55点満点）
  const totalScore = 
    form.monthlyWorkTime + form.taskPersonality + form.errorFrequency + form.urgencyLevel +
    form.dataStructure + form.procedureDocumentation + form.exceptionHandling + form.taskComplexity +
    form.taskFrequency + form.businessContinuity + form.maintenanceEase;

  // 実務的なノックアウトファクター判定
  const knockoutFactors: string[] = [];
  if (form.monthlyWorkTime === 1) knockoutFactors.push('月間作業時間が少なく投資対効果が低い');
  if (form.urgencyLevel === 5) knockoutFactors.push('リアルタイム処理が必要で自動化困難');
  if (form.taskPersonality === 1) knockoutFactors.push('専門性が高すぎて自動化困難');
  if (form.businessContinuity === 1) knockoutFactors.push('業務廃止予定のため導入効果が限定的');

  // 新しい3分類の技術レベル判定
  let techLevel: AssessmentResult['techLevel'];
  
  if (knockoutFactors.length > 0) {
    techLevel = '導入困難';
  } else {
    // ワークフロー型判定：構造化データ + 手順明確 + 例外少ない
    const workflowScore = form.dataStructure + form.procedureDocumentation + form.exceptionHandling;
    const isWorkflowSuitable = workflowScore >= 12 && form.taskComplexity >= 4;
    
    // AIエージェント型判定：非構造化データ + 複雑な判断
    const isAgentSuitable = form.dataStructure <= 2 && form.taskComplexity <= 2;
    
    // 検索+生成型判定：中間的な複雑さ
    const hybridSuitable = totalScore >= 30 && !isWorkflowSuitable && !isAgentSuitable;
    
    if (isWorkflowSuitable) {
      techLevel = 'ワークフロー型';
    } else if (isAgentSuitable) {
      techLevel = 'AIエージェント型';
    } else if (hybridSuitable) {
      techLevel = '検索+生成型';
    } else {
      techLevel = '導入困難';
    }
  }

  // ビジネス価値重視の導入可能性判定
  let feasibility: AssessmentResult['feasibility'];
  const businessValue = form.monthlyWorkTime + form.taskFrequency + form.businessContinuity;
  const implementationEase = form.dataStructure + form.procedureDocumentation + form.exceptionHandling;
  const adjustedScore = businessValue + implementationEase;
  
  if (adjustedScore >= 12 && form.monthlyWorkTime >= 3) {
    feasibility = '高';
  } else if (adjustedScore >= 8 && techLevel !== '導入困難') {
    feasibility = '中';
  } else {
    feasibility = '低';
  }

  // 戦略的優先度判定
  let priority: AssessmentResult['priority'];
  if (feasibility === '高' && form.businessContinuity >= 4) {
    priority = '高';
  } else if (feasibility === '中' && (form.monthlyWorkTime >= 3 || form.taskFrequency >= 3)) {
    priority = '中';
  } else {
    priority = '低';
  }

  // より具体的な推奨ツール
  const recommendedTool = getRecommendedTool(techLevel, form);

  return {
    id: Date.now().toString(),
    companyName: form.companyName,
    department: form.department,
    businessName: form.businessName,
    totalScore,
    knockoutFactors,
    techLevel,
    feasibility,
    priority,
    recommendedTool,
    evaluationDate: form.evaluationDate,
    evaluator: form.evaluator
  };
};

const getRecommendedTool = (techLevel: AssessmentResult['techLevel'], form: AssessmentForm): string => {
  switch (techLevel) {
    case 'ワークフロー型':
      if (form.dataStructure >= 4) {
        return 'Power Automate・UiPath・BizRobo!・Zapier';
      } else {
        return 'Power Automate Desktop・UiPath StudioX・n8n';
      }
    case '検索+生成型':
      if (form.dataStructure <= 2) {
        return 'ChatGPT・Claude・Microsoft Copilot（文書処理）';
      } else {
        return 'Microsoft Copilot Studio・Dify・RAGシステム';
      }
    case 'AIエージェント型':
      if (form.taskComplexity === 1) {
        return 'Claude・ChatGPT Enterprise・Genspark・AutoGPT';
      } else {
        return 'Dify・LangChain・カスタムAIエージェント開発';
      }
    case '導入困難':
      return '現段階では手動継続。業務標準化・データ整理後に再評価を推奨';
    default:
      return '要検討';
  }
};