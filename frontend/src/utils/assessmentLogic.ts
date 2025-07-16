import { AssessmentForm, AssessmentResult } from '../types/assessment';

export const calculateAssessmentResult = (form: AssessmentForm): AssessmentResult => {
  // 総得点計算
  const totalScore = 
    form.regularity + form.procedureClarity + form.exceptionFrequency + 
    form.procedureDecision + form.learningAdaptation + form.dataConfidentiality + 
    form.realtimeRequirement + form.systemOperation + form.dataProcessing + 
    form.apiIntegration + form.securityConstraints + form.timeSavingEffect + 
    form.qualityImprovement;

  // ノックアウトファクター判定
  const knockoutFactors: string[] = [];
  if (form.dataConfidentiality === 1) knockoutFactors.push('データ・情報の機密性');
  if (form.realtimeRequirement === 1) knockoutFactors.push('リアルタイム性要求');
  if (form.securityConstraints === 1) knockoutFactors.push('セキュリティ制約');
  if (form.timeSavingEffect === 1) knockoutFactors.push('時間短縮効果');

  // 技術レベル判定
  let techLevel: AssessmentResult['techLevel'];
  if (knockoutFactors.length > 0) {
    techLevel = '導入困難';
  } else if (form.regularity >= 4 && form.procedureClarity >= 4 && form.exceptionFrequency >= 4) {
    techLevel = 'Lv1:RPA';
  } else if (form.procedureDecision === 3 && form.learningAdaptation === 3) {
    techLevel = 'Lv2:AI+ワークフロー';
  } else if (form.procedureDecision <= 2 && form.learningAdaptation <= 2) {
    techLevel = 'Lv3:エージェントAI';
  } else {
    techLevel = '導入困難';
  }

  // 導入可能性判定
  const feasibility: AssessmentResult['feasibility'] = 
    totalScore >= 50 ? '高' : totalScore >= 35 ? '中' : '低';

  // 優先度判定
  const priority: AssessmentResult['priority'] = 
    feasibility === '高' ? '高' : 
    (feasibility === '中' && techLevel !== '導入困難') ? '中' : '低';

  // 推奨ツール
  const recommendedTool = getRecommendedTool(techLevel);

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

const getRecommendedTool = (techLevel: AssessmentResult['techLevel']): string => {
  switch (techLevel) {
    case 'Lv1:RPA':
      return 'UiPath・Power Automate・WinActor';
    case 'Lv2:AI+ワークフロー':
      return 'Dify・Zapier・Microsoft Copilot Studio';
    case 'Lv3:エージェントAI':
      return 'Claude・ChatGPT・カスタムAIエージェント';
    case '導入困難':
      return '手動作業継続を推奨';
    default:
      return '要検討';
  }
};