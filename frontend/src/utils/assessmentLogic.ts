import { AssessmentForm, AssessmentResult } from '../types/assessment';

export const calculateAssessmentResult = (form: AssessmentForm): AssessmentResult => {
  // 総得点計算（12項目×5点=60点満点）
  const totalScore = 
    form.monthlyWorkTime + form.taskPersonality + form.errorFrequency + form.urgencyLevel + form.outsourcingStatus +
    form.dataStructure + form.procedureDocumentation + form.exceptionHandling + form.taskComplexity +
    form.taskFrequency + form.businessContinuity + form.maintenanceEase;

  // 実務的なノックアウトファクター判定
  const knockoutFactors: string[] = [];
  if (form.monthlyWorkTime === 1) knockoutFactors.push('月間作業時間が少なく投資対効果が低い');
  if (form.urgencyLevel === 5) knockoutFactors.push('リアルタイム処理が必要で自動化困難');
  if (form.taskPersonality === 1) knockoutFactors.push('専門性が高すぎて自動化困難');
  if (form.businessContinuity === 1) knockoutFactors.push('業務廃止予定のため導入効果が限定的');

  // 新しい3分類の技術レベル判定（根拠を明確化）
  let techLevel: AssessmentResult['techLevel'];
  let techLevelReason: string = '';
  
  if (knockoutFactors.length > 0) {
    techLevel = 'Lv.0:自動不可';
    techLevelReason = 'ノックアウト要因により自動化は推奨されません';
  } else {
    // ワークフロー型判定：構造化データ + 手順明確 + 例外少ない
    const workflowScore = form.dataStructure + form.procedureDocumentation + form.exceptionHandling;
    const isWorkflowSuitable = workflowScore >= 12 && form.taskComplexity >= 4;
    
    // AIエージェント型判定：非構造化データ + 複雑な判断
    const isAgentSuitable = form.dataStructure <= 2 && form.taskComplexity <= 2;
    
    // 検索+生成型判定：中間的な複雑さ
    const hybridSuitable = totalScore >= 30 && !isWorkflowSuitable && !isAgentSuitable;
    
    if (isWorkflowSuitable) {
      techLevel = 'Lv.1:ワークフロー型';
      techLevelReason = '定型的な手順で処理可能な業務のため、ルールベースの自動化（RPA、n8n等）が適しています';
    } else if (isAgentSuitable || hybridSuitable) {
      techLevel = 'Lv.2:検索＋生成型&AIエージェント型';
      techLevelReason = '情報検索・生成や複雑な判断が必要なため、RAG技術やAIエージェント（Dify、Genspark等）の活用が適しています';
    } else {
      techLevel = 'Lv.0:自動不可';
      techLevelReason = '現在の業務特性では自動化による効果が限定的です';
    }
  }

  // ビジネス価値重視の導入可能性判定
  let feasibility: AssessmentResult['feasibility'];
  const businessValue = form.monthlyWorkTime + form.taskFrequency + form.businessContinuity;
  const implementationEase = form.dataStructure + form.procedureDocumentation + form.exceptionHandling;
  const adjustedScore = businessValue + implementationEase;
  
  if (adjustedScore >= 12 && form.monthlyWorkTime >= 3) {
    feasibility = '高';
  } else if (adjustedScore >= 8 && techLevel !== 'Lv.0:自動不可') {
    feasibility = '中';
  } else {
    feasibility = '低';
  }

  // 戦略的優先度判定（外注業務を優先）
  let priority: AssessmentResult['priority'];
  const isOutsourced = form.outsourcingStatus >= 4; // 主に外注または完全外注
  
  if (feasibility === '高' && (form.businessContinuity >= 4 || isOutsourced)) {
    priority = '高';
  } else if (feasibility === '中' && (form.monthlyWorkTime >= 3 || form.taskFrequency >= 3 || isOutsourced)) {
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
    techLevelReason,
    feasibility,
    priority,
    recommendedTool,
    evaluationDate: form.evaluationDate,
    evaluator: form.evaluator,
    outsourcingStatus: form.outsourcingStatus
  };
};

const getRecommendedTool = (techLevel: AssessmentResult['techLevel'], form: AssessmentForm): string => {
  switch (techLevel) {
    case 'Lv.1:ワークフロー型':
      if (form.dataStructure >= 4) {
        return 'RPA製品（UiPath、Power Automate等）、ワークフローツール（n8n、Zapier等）での実装が可能です';
      } else {
        return 'デスクトップ型RPA製品やn8nのようなビジュアルワークフローツールから段階的に導入することを推奨します';
      }
    case 'Lv.2:検索＋生成型&AIエージェント型':
      if (form.dataStructure <= 2 || form.taskComplexity <= 2) {
        return 'AIエージェントプラットフォーム（Dify、LangChain、AutoGPT等）での実装を推奨します';
      } else {
        return 'RAG技術を活用した検索拡張生成システム（Genspark、Perplexity型システム）の構築が効果的です';
      }
    case 'Lv.0:自動不可':
      return '現段階では自動化よりも、業務プロセスの見直しと標準化を優先することを推奨します';
    default:
      return '個別に詳細な分析が必要です';
  }
};