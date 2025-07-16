import { EvaluationCriteria } from '../types/assessment';

export const evaluationCriteria: EvaluationCriteria[] = [
  {
    field: 'regularity',
    label: '定型・反復性',
    description: '業務の定型性・反復性の程度',
    options: [
      { value: 1, label: '不定期作業' },
      { value: 3, label: '週次・月次の定期作業' },
      { value: 5, label: '毎日同じ作業' }
    ]
  },
  {
    field: 'procedureClarity',
    label: 'ルール・手順の明確性',
    description: '作業手順の明確化・文書化の程度',
    options: [
      { value: 1, label: '属人的判断' },
      { value: 3, label: '基本手順あり' },
      { value: 5, label: '完全にマニュアル化' }
    ]
  },
  {
    field: 'exceptionFrequency',
    label: '例外処理の頻度',
    description: '例外的な処理が発生する頻度',
    options: [
      { value: 1, label: '頻繁に例外' },
      { value: 3, label: '月1-2回例外' },
      { value: 5, label: '例外なし' }
    ]
  },
  {
    field: 'procedureDecision',
    label: '作業手順の決定',
    description: '作業手順の決定方法',
    options: [
      { value: 1, label: '専門知識による判断' },
      { value: 3, label: '基本手順＋状況判断' },
      { value: 5, label: '完全にマニュアル通り' }
    ]
  },
  {
    field: 'learningAdaptation',
    label: '学習・適応の必要性',
    description: '継続的な学習・適応が必要な程度',
    options: [
      { value: 1, label: '常に学習が必要' },
      { value: 3, label: '時々パターン変更' },
      { value: 5, label: '固定パターン' }
    ]
  },
  {
    field: 'dataConfidentiality',
    label: 'データ・情報の機密性',
    description: '扱うデータ・情報の機密性レベル',
    options: [
      { value: 1, label: '個人情報・機密情報' },
      { value: 3, label: '社内限定' },
      { value: 5, label: '一般情報' }
    ]
  },
  {
    field: 'realtimeRequirement',
    label: 'リアルタイム性要求',
    description: '即座の対応が必要な程度',
    options: [
      { value: 1, label: '即座の対応必要' },
      { value: 3, label: '数時間以内' },
      { value: 5, label: '時間的余裕あり' }
    ]
  },
  {
    field: 'systemOperation',
    label: 'システム操作',
    description: '操作するシステムの数と複雑さ',
    options: [
      { value: 1, label: '複数システム' },
      { value: 3, label: '2-3システム' },
      { value: 5, label: '単一システム' }
    ]
  },
  {
    field: 'dataProcessing',
    label: 'データ処理',
    description: '処理するデータの構造化レベル',
    options: [
      { value: 1, label: '非構造化テキスト' },
      { value: 3, label: '半構造化' },
      { value: 5, label: '構造化データ' }
    ]
  },
  {
    field: 'apiIntegration',
    label: 'API連携',
    description: 'システム間連携の方法',
    options: [
      { value: 1, label: '画面操作のみ' },
      { value: 3, label: '一部API' },
      { value: 5, label: 'API完備' }
    ]
  },
  {
    field: 'securityConstraints',
    label: 'セキュリティ制約',
    description: 'セキュリティ要件の厳格さ',
    options: [
      { value: 1, label: '厳格な制約' },
      { value: 3, label: '中程度制約' },
      { value: 5, label: '制約なし' }
    ]
  },
  {
    field: 'timeSavingEffect',
    label: '時間短縮効果',
    description: '期待される時間短縮効果',
    options: [
      { value: 1, label: '微改善' },
      { value: 3, label: '30-50%短縮' },
      { value: 5, label: '80%以上短縮' }
    ]
  },
  {
    field: 'qualityImprovement',
    label: '品質向上効果',
    description: '期待される品質向上効果',
    options: [
      { value: 1, label: '変化なし' },
      { value: 3, label: '中程度改善' },
      { value: 5, label: '大幅改善' }
    ]
  }
];