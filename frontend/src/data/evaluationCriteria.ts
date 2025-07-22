import { EvaluationCriteria } from '../types/assessment';

export const evaluationCriteria: EvaluationCriteria[] = [
  // === ビジネスインパクト軸 ===
  {
    field: 'monthlyWorkTime',
    label: 'B1. 月間作業時間',
    description: 'この業務に月間何時間を要しているか',
    detailDescription: '自動化による時間削減効果を測定するため。月間作業時間が多いほど、自動化による投資対効果が高くなります。',
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
    label: 'B2. 作業の属人性',
    description: 'この業務を実行できる人材の範囲',
    detailDescription: '作業の標準化度合いを測定するため。属人性が低い（誰でもできる）ほど、自動化しやすく効果も高くなります。',
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
    label: 'B3. 現在のミス率',
    description: 'この業務でミスややり直しの発生頻度',
    detailDescription: 'ミスの発生頻度が高いほど、自動化による品質向上効果が期待できます。人的ミスの削減は大きなメリットです。',
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
    label: 'B4. 業務の緊急度',
    description: 'この業務の完了期限の厳しさ',
    detailDescription: '緊急度が高すぎる業務は自動化が困難です。適度な時間的余裕があることで、安定した自動化が可能になります。',
    category: 'business',
    options: [
      { value: 1, label: '翌日以降でも問題なし' },
      { value: 2, label: '当日中に完了' },
      { value: 3, label: '数時間以内に完了' },
      { value: 4, label: '1時間以内に完了' },
      { value: 5, label: 'リアルタイム処理が必要' }
    ]
  },
  {
    field: 'outsourcingStatus',
    label: 'B5. 現在の実施体制',
    description: 'この業務を実施している体制',
    detailDescription: '外注業務は自動化による直接的なコスト削減効果が高く、優先度が上がります。内製業務は品質向上や業務効率化の観点で評価します。',
    category: 'business',
    options: [
      { value: 1, label: '完全内製（自社社員のみ）' },
      { value: 2, label: '主に内製（一部外注）' },
      { value: 3, label: '内製と外注が半々' },
      { value: 4, label: '主に外注（一部内製）' },
      { value: 5, label: '完全外注' }
    ]
  },

  // === 技術実現性軸 ===
  {
    field: 'dataStructure',
    label: 'T1. データの整理度',
    description: '扱うデータの整理・構造化状況',
    detailDescription: 'データが構造化されているほど、Lv.1(ワークフロー型：RPA、n8n等)が適用しやすくなります。非構造化データはLv.2(検索＋生成型&AIエージェント型：Dify、Genspark等)が必要です。',
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
    label: 'T2. 作業手順書の完備度',
    description: '作業手順の文書化レベル',
    detailDescription: '手順書が整備されているほど、自動化の設計・実装が容易になります。文書化レベルが低いと導入に時間がかかります。',
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
    label: 'T3. 例外対応の頻度',
    description: 'イレギュラーな対応が必要な頻度',
    detailDescription: '例外処理が頻繁に発生する業務は、Lv.1(ワークフロー型)では対応困難です。Lv.2(検索＋生成型&AIエージェント型)が適している場合があります。',
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
    label: 'T4. 作業の複雑度',
    description: '業務実行に必要な専門知識・スキルレベル',
    detailDescription: '単純作業はLv.1(ワークフロー型：RPA、n8n等)、高度な専門知識や複雑な判断が必要な作業はLv.2(検索＋生成型&AIエージェント型：Dify、Genspark等)が適しています。',
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
    label: 'S1. 作業実施頻度',
    description: 'この業務の実施頻度',
    detailDescription: '作業頻度が高いほど、自動化の投資対効果が高くなります。単発作業は自動化のメリットが低いです。',
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
    field: 'businessContinuity',
    label: 'S2. 業務の将来性',
    description: 'この業務の将来的な見通し',
    detailDescription: '将来的に継続・拡大する業務ほど、自動化の投資価値が高くなります。廃止予定の業務は優先度が低いです。',
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
    label: 'S3. 保守・メンテナンス性',
    description: '自動化後の保守・運用の容易さ',
    detailDescription: '保守が容易な自動化システムほど、長期的な運用コストが低くなります。専門知識が必要なシステムはリスクが高いです。',
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