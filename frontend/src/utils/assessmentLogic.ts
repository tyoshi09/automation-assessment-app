import { AssessmentForm, AssessmentResult } from '../types/assessment';

export const calculateAssessmentResult = (form: AssessmentForm): AssessmentResult => {
  // 総得点計算
  const totalScore = 
    form.regularity + form.procedureClarity + form.exceptionFrequency + 
    form.procedureDecision + form.learningAdaptation + form.dataConfidentiality + 
    form.realtimeRequirement + form.systemOperation + form.dataProcessing + 
    form.apiIntegration + form.securityConstraints + form.timeSavingEffect + 
    form.qualityImprovement;

  // 実務的なノックアウトファクター判定
  const knockoutFactors: string[] = [];
  if (form.dataConfidentiality === 1) knockoutFactors.push('機密データのため自動化困難');
  if (form.realtimeRequirement === 1) knockoutFactors.push('リアルタイム対応が必要');
  if (form.securityConstraints === 1) knockoutFactors.push('セキュリティ承認が困難');
  if (form.timeSavingEffect === 1) knockoutFactors.push('投資対効果が低い（月5時間未満）');

  // より実践的な技術レベル判定
  let techLevel: AssessmentResult['techLevel'];
  
  if (knockoutFactors.length > 0) {
    techLevel = '導入困難';
  } else {
    // RPA適用条件：高頻度 + 標準化済み + 単純作業
    const rpaScore = form.regularity + form.procedureClarity + form.exceptionFrequency;
    
    // AI適用条件：判断業務 + 文書処理 + 複雑性
    const aiScore = (6 - form.exceptionFrequency) + (6 - form.procedureDecision) + form.dataProcessing;
    
    // システム間連携の複雑さ
    const systemComplexity = form.systemOperation + form.apiIntegration;
    
    if (rpaScore >= 12 && form.exceptionFrequency >= 4 && systemComplexity >= 6) {
      techLevel = 'Lv1:RPA';
    } else if (aiScore >= 8 && form.dataProcessing <= 3 && form.timeSavingEffect >= 3) {
      techLevel = 'Lv3:エージェントAI';
    } else if (totalScore >= 35) {
      techLevel = 'Lv2:AI+ワークフロー';
    } else {
      techLevel = '導入困難';
    }
  }

  // ROI重視の導入可能性判定
  let feasibility: AssessmentResult['feasibility'];
  const roiScore = form.timeSavingEffect + form.qualityImprovement + form.regularity;
  const complexityPenalty = (6 - form.procedureClarity) + (6 - form.securityConstraints);
  const adjustedScore = totalScore + roiScore - complexityPenalty;
  
  if (adjustedScore >= 45 && form.timeSavingEffect >= 3) {
    feasibility = '高';
  } else if (adjustedScore >= 30 && techLevel !== '導入困難') {
    feasibility = '中';
  } else {
    feasibility = '低';
  }

  // 実務的な優先度判定
  let priority: AssessmentResult['priority'];
  if (feasibility === '高' && form.timeSavingEffect >= 4) {
    priority = '高';
  } else if (feasibility === '中' && (form.qualityImprovement >= 4 || form.timeSavingEffect >= 3)) {
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
    case 'Lv1:RPA':
      if (form.systemOperation >= 4) {
        return 'Power Automate Desktop（シンプル操作）・UiPath StudioX';
      } else {
        return 'UiPath Studio・Power Automate・BizRobo!';
      }
    case 'Lv2:AI+ワークフロー':
      if (form.dataProcessing <= 2) {
        return 'Microsoft Copilot Studio・Zapier・Make（旧Integromat）';
      } else {
        return 'Power Platform・Dify・n8n';
      }
    case 'Lv3:エージェントAI':
      if (form.dataProcessing === 1) {
        return 'Claude・ChatGPT Enterprise・Microsoft Copilot';
      } else {
        return 'GPT-4・Anthropic Claude・カスタムAIアプリ開発';
      }
    case '導入困難':
      return '現段階では手動継続。業務標準化後に再評価を推奨';
    default:
      return '要検討';
  }
};