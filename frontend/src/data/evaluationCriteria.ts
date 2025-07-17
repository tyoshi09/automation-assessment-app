import { EvaluationCriteria } from '../types/assessment';

export const evaluationCriteria: EvaluationCriteria[] = [
  {
    field: 'regularity',
    label: '業務の作業頻度',
    description: 'この業務は月に何回実施されますか？',
    options: [
      { value: 1, label: '月1回以下・単発作業' },
      { value: 3, label: '月2-10回・週数回' },
      { value: 5, label: '毎日・週5回以上' }
    ]
  },
  {
    field: 'procedureClarity',
    label: '作業手順の標準化',
    description: '作業手順は誰でもできるレベルまで標準化されていますか？',
    options: [
      { value: 1, label: '特定の人しかできない' },
      { value: 3, label: '経験者なら理解できる' },
      { value: 5, label: '新人でもマニュアル通りにできる' }
    ]
  },
  {
    field: 'exceptionFrequency',
    label: '判断業務の割合',
    description: '作業中に人間の判断が必要な場面はどの程度ありますか？',
    options: [
      { value: 1, label: '大部分が判断業務' },
      { value: 3, label: '一部で判断が必要' },
      { value: 5, label: 'ほぼ単純作業のみ' }
    ]
  },
  {
    field: 'procedureDecision',
    label: 'データ入力の複雑さ',
    description: 'データの入力・転記・チェック作業の複雑さは？',
    options: [
      { value: 1, label: '文章理解・要約が必要' },
      { value: 3, label: '簡単な計算・変換が必要' },
      { value: 5, label: '単純なコピー&ペースト' }
    ]
  },
  {
    field: 'learningAdaptation',
    label: '業務ルールの変更頻度',
    description: '業務のルールや手順はどの程度変更されますか？',
    options: [
      { value: 1, label: '月1回以上変更される' },
      { value: 3, label: '年数回変更される' },
      { value: 5, label: 'ほとんど変更されない' }
    ]
  },
  {
    field: 'dataConfidentiality',
    label: '扱うデータの機密レベル',
    description: '自動化ツールに任せられるデータですか？',
    options: [
      { value: 1, label: '個人情報・機密情報' },
      { value: 3, label: '社内データ（管理が必要）' },
      { value: 5, label: '公開情報・一般データ' }
    ]
  },
  {
    field: 'realtimeRequirement',
    label: '緊急対応の必要性',
    description: 'この業務はいつまでに完了する必要がありますか？',
    options: [
      { value: 1, label: '即座・リアルタイム' },
      { value: 3, label: '当日中・数時間以内' },
      { value: 5, label: '翌日以降でも問題なし' }
    ]
  },
  {
    field: 'systemOperation',
    label: '使用システム数',
    description: 'この業務で使用するシステム・アプリの数は？',
    options: [
      { value: 1, label: '5個以上の複数システム' },
      { value: 3, label: '2-4個のシステム' },
      { value: 5, label: '1個のシステムのみ' }
    ]
  },
  {
    field: 'dataProcessing',
    label: 'ファイル・文書の扱い',
    description: 'どのような形式のデータを扱いますか？',
    options: [
      { value: 1, label: 'PDF・画像・手書き文書' },
      { value: 3, label: 'Word・PowerPoint等' },
      { value: 5, label: 'Excel・CSV・システム画面' }
    ]
  },
  {
    field: 'apiIntegration',
    label: 'システム連携の難易度',
    description: 'システム間でのデータのやり取りは？',
    options: [
      { value: 1, label: '手作業でのコピー&ペースト' },
      { value: 3, label: 'ファイル出力・取り込み' },
      { value: 5, label: 'システム間の自動連携あり' }
    ]
  },
  {
    field: 'securityConstraints',
    label: 'セキュリティ・承認要件',
    description: '自動化導入時のセキュリティ制約は？',
    options: [
      { value: 1, label: '厳格な承認・監査が必要' },
      { value: 3, label: '上司の承認があれば可能' },
      { value: 5, label: '特に制約なし' }
    ]
  },
  {
    field: 'timeSavingEffect',
    label: '月間作業時間',
    description: 'この業務に月間何時間かけていますか？',
    options: [
      { value: 1, label: '5時間未満' },
      { value: 3, label: '5-20時間' },
      { value: 5, label: '20時間以上' }
    ]
  },
  {
    field: 'qualityImprovement',
    label: 'ミス・やり直しの頻度',
    description: 'この業務でのミスややり直しはどの程度発生しますか？',
    options: [
      { value: 1, label: 'ほとんど発生しない' },
      { value: 3, label: '月1-2回程度' },
      { value: 5, label: '週1回以上発生' }
    ]
  }
];