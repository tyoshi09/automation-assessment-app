import { EvaluationCriteria } from '../types/assessment';

export const evaluationCriteria: EvaluationCriteria[] = [
  // === ビジネスインパクト軸 ===
  {
    field: 'monthlyWorkTime',
    label: '月間作業時間',
    description: 'この業務に月間何時間を要しているか',
    category: 'business',
    options: [
      { value: 1, label: '5時間未満' },
      { value: 2, label: '5-10時間' },
      { value: 3, label: '10-20時間' },
      { value: 4, label: '20-40時間' },
      { value: 5, label: '40時間以上' }
    ]
  },
  {
    field: 'taskPersonality',
    label: '作業の属人性',
    description: 'この業務を実行できる人材の範囲',
    category: 'business',
    options: [
      { value: 1, label: '特定の専門家のみ可能' },
      { value: 2, label: '経験者のみ可能' },
      { value: 3, label: '部署内の複数人が可能' },
      { value: 4, label: '軽い研修で対応可能' },
      { value: 5, label: '誰でも実行可能' }
    ]
  },
  {
    field: 'errorFrequency',
    label: '現在のミス率',
    description: 'この業務でミスややり直しの発生頻度',
    category: 'business',
    options: [
      { value: 1, label: '月1回以上発生' },
      { value: 2, label: '2-3ヶ月に1回' },
      { value: 3, label: '半年に1回程度' },
      { value: 4, label: '年1回程度' },
      { value: 5, label: 'ほとんど発生しない' }
    ]
  },
  {
    field: 'urgencyLevel',
    label: '業務の緊急度',
    description: 'この業務の完了期限の厳しさ',
    category: 'business',
    options: [
      { value: 1, label: '翌日以降でも問題なし' },
      { value: 2, label: '当日中に完了' },
      { value: 3, label: '数時間以内に完了' },
      { value: 4, label: '1時間以内に完了' },
      { value: 5, label: 'リアルタイム処理が必要' }
    ]
  },

  // === 技術実現性軸 ===
  {
    field: 'dataStructure',
    label: 'データの整理度',
    description: '扱うデータの整理・構造化状況',
    category: 'technical',
    options: [
      { value: 1, label: '手書き文書・PDF・画像' },
      { value: 2, label: 'Word・Excel（形式バラバラ）' },
      { value: 3, label: 'CSV・定型Excel' },
      { value: 4, label: 'データベース・システム' },
      { value: 5, label: 'API連携済み' }
    ]
  },
  {
    field: 'procedureDocumentation',
    label: '作業手順書の完備度',
    description: '作業手順の文書化レベル',
    category: 'technical',
    options: [
      { value: 1, label: '口頭説明のみ' },
      { value: 2, label: '簡単なメモ程度' },
      { value: 3, label: '基本的な手順書' },
      { value: 4, label: '詳細なマニュアル' },
      { value: 5, label: '完全に標準化済み' }
    ]
  },
  {
    field: 'exceptionHandling',
    label: '例外対応の頻度',
    description: 'イレギュラーな対応が必要な頻度',
    category: 'technical',
    options: [
      { value: 1, label: '毎回異なる対応' },
      { value: 2, label: '頻繁に発生' },
      { value: 3, label: '月数回発生' },
      { value: 4, label: '年数回発生' },
      { value: 5, label: 'ほとんど発生しない' }
    ]
  },
  {
    field: 'taskComplexity',
    label: '作業の複雑度',
    description: '業務実行に必要な専門知識・スキルレベル',
    category: 'technical',
    options: [
      { value: 1, label: '高度な専門知識が必要' },
      { value: 2, label: '業務固有の知識が必要' },
      { value: 3, label: '基本的なPC操作スキル' },
      { value: 4, label: '簡単な操作のみ' },
      { value: 5, label: '単純作業のみ' }
    ]
  },

  // === 持続可能性軸 ===
  {
    field: 'taskFrequency',
    label: '作業実施頻度',
    description: 'この業務の実施頻度',
    category: 'sustainability',
    options: [
      { value: 1, label: '年数回の単発' },
      { value: 2, label: '月1回程度' },
      { value: 3, label: '週1回程度' },
      { value: 4, label: '毎日' },
      { value: 5, label: '1日に複数回' }
    ]
  },
  {
    field: 'departmentExpansion',
    label: '他部署展開の可能性',
    description: '同様の業務の他部署への展開可能性',
    category: 'sustainability',
    options: [
      { value: 1, label: '当部署のみ' },
      { value: 2, label: '展開は困難' },
      { value: 3, label: '調整すれば可能' },
      { value: 4, label: '容易に展開可能' },
      { value: 5, label: '全社共通業務' }
    ]
  },
  {
    field: 'businessContinuity',
    label: '業務の将来性',
    description: 'この業務の将来的な見通し',
    category: 'sustainability',
    options: [
      { value: 1, label: '廃止・縮小予定' },
      { value: 2, label: '縮小傾向' },
      { value: 3, label: '現状維持' },
      { value: 4, label: '拡大予定' },
      { value: 5, label: '戦略的に重要' }
    ]
  },
  {
    field: 'maintenanceEase',
    label: '保守・メンテナンス性',
    description: '自動化後の保守・運用の容易さ',
    category: 'sustainability',
    options: [
      { value: 1, label: '専門知識が必要' },
      { value: 2, label: 'IT部門に依存' },
      { value: 3, label: '研修が必要' },
      { value: 4, label: '簡単な操作' },
      { value: 5, label: '自動運用可能' }
    ]
  }
];