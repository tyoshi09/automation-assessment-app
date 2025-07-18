# 業務自動化評価システム 仕様書

## 概要

### システム名
**業務自動化評価システム**

### 目的
企業の業務に対してRPA（Robotic Process Automation）やAIエージェントの導入適性を評価し、最適な自動化技術を推奨するシステム

### 対象ユーザー
- 業務プロセス改善担当者
- IT部門担当者
- 経営企画・DX推進担当者
- コンサルタント

## システム構成

### アーキテクチャ
```
フロントエンド（React）
    ↓
Azure Static Web Apps
    ↓
（将来的にCosmos DB連携予定）
```

### 技術スタック
- **フロントエンド**: React 18 + TypeScript
- **スタイリング**: CSS3 + Responsive Design
- **ホスティング**: Azure Static Web Apps
- **デプロイ**: GitHub Actions（自動デプロイ）
- **コスト**: 完全無料（Azure無料枠使用）

### システム環境
- **本番URL**: https://polite-bay-08aef5400.2.azurestaticapps.net
- **リポジトリ**: https://github.com/tyoshi09/automation-assessment-app
- **リソースグループ**: automation-assessment-rg

## 機能仕様

### 1. 評価入力機能

#### 基本情報入力
| 項目 | 形式 | 必須 | 備考 |
|------|------|------|------|
| 企業名 | テキスト | ✓ | 評価対象の企業名 |
| 部門名 | テキスト | ✓ | 評価対象の部門名 |
| 業務名 | テキスト | ✓ | 評価対象の業務名 |
| 評価日 | 日付 | ✓ | デフォルト：当日 |
| 評価者 | テキスト | ✓ | 評価実施者名 |

#### 評価項目（13項目）
| No | 項目名 | 評価基準 | 配点 | 備考 |
|----|--------|----------|------|------|
| 1 | 定型・反復性 | 1:不定期〜5:毎日同じ作業 | 1-5点 | 定型性が高いほどRPA向き |
| 2 | ルール・手順の明確性 | 1:属人的〜5:完全にマニュアル化 | 1-5点 | 明確なほどRPA向き |
| 3 | 例外処理の頻度 | 1:頻繁に例外〜5:例外なし | 1-5点 | 例外が少ないほどRPA向き |
| 4 | 作業手順の決定 | 1:専門知識による判断〜5:完全にマニュアル通り | 1-5点 | 手順が決まっているほどRPA向き |
| 5 | 学習・適応の必要性 | 1:常に学習が必要〜5:固定パターン | 1-5点 | 学習が必要なほどAI向き |
| 6 | データ・情報の機密性 | 1:個人情報・機密情報〜5:一般情報 | 1-5点 | 機密性が高いと導入困難 |
| 7 | リアルタイム性要求 | 1:即座の対応必要〜5:時間的余裕あり | 1-5点 | 即座の対応が必要だと導入困難 |
| 8 | システム操作 | 1:複数システム〜5:単一システム | 1-5点 | システム数が多いほど難易度高 |
| 9 | データ処理 | 1:非構造化テキスト〜5:構造化データ | 1-5点 | 構造化されているほどRPA向き |
| 10 | API連携 | 1:画面操作のみ〜5:API完備 | 1-5点 | APIがあるほど安定 |
| 11 | セキュリティ制約 | 1:厳格な制約〜5:制約なし | 1-5点 | 制約が厳しいほど導入困難 |
| 12 | 時間短縮効果 | 1:微改善〜5:80%以上短縮 | 1-5点 | 効果が大きいほど投資価値高 |
| 13 | 品質向上効果 | 1:変化なし〜5:大幅改善 | 1-5点 | 品質改善効果が大きいほど価値高 |

### 2. 判定ロジック

#### 総得点計算
- **満点**: 65点（13項目 × 5点）
- **計算式**: 各項目の評価点の合計

#### ノックアウトファクター判定
以下の条件に該当する場合、導入困難と判定：
- データ・情報の機密性 = 1点
- リアルタイム性要求 = 1点
- セキュリティ制約 = 1点
- 時間短縮効果 = 1点

#### 技術レベル判定
1. **Lv1: RPA**
   - 条件：定型・反復性≧4 かつ ルール明確性≧4 かつ 例外処理≧4
   - 推奨ツール：UiPath・Power Automate・WinActor

2. **Lv2: AI+ワークフロー**
   - 条件：作業手順の決定=3 かつ 学習・適応=3
   - 推奨ツール：Dify・Zapier・Microsoft Copilot Studio

3. **Lv3: エージェントAI**
   - 条件：作業手順の決定≤2 かつ 学習・適応≤2
   - 推奨ツール：Claude・ChatGPT・カスタムAIエージェント

4. **導入困難**
   - 条件：ノックアウトファクターが存在 or 上記条件に該当しない
   - 推奨：手動作業継続

#### 導入可能性判定
- **高**：総得点50-65点（積極的導入推奨）
- **中**：総得点35-49点（条件整備後に導入検討）
- **低**：総得点34点以下（現状では導入困難）

#### 優先度判定
- **高**：導入可能性=高
- **中**：導入可能性=中 かつ 技術レベル≠導入困難
- **低**：上記以外

### 3. 結果表示機能

#### 表示項目
- **基本情報**：企業名・部門名・業務名・評価日・評価者
- **総合得点**：65点満点での得点表示
- **技術レベル**：Lv1〜Lv3または導入困難（色分け表示）
- **導入可能性**：高・中・低（色分け表示）
- **優先度**：高・中・低（色分け表示）
- **推奨ツール**：技術レベルに応じた具体的なツール名
- **ノックアウトファクター**：該当する場合のみ警告表示

#### 色分け仕様
- **緑色**：良好（Lv1:RPA、導入可能性:高、優先度:高）
- **オレンジ色**：注意（Lv2:AI+ワークフロー、導入可能性:中、優先度:中）
- **紫色**：高度（Lv3:エージェントAI）
- **赤色**：問題（導入困難、導入可能性:低、優先度:低）

## UI/UX仕様

### デザイン原則
- **シンプル**：直感的で使いやすいインターフェース
- **レスポンシブ**：PC・タブレット・スマートフォン対応
- **アクセシブル**：明確な視覚的フィードバック

### 画面構成
1. **ヘッダー**：システム名・説明
2. **メイン画面**：評価入力フォーム or 結果表示
3. **アクション**：評価実行・新規評価ボタン

### レスポンシブ対応
- **PC**：1200px以上（グリッドレイアウト）
- **タブレット**：768px-1199px（2カラム）
- **スマートフォン**：767px以下（1カラム）

## データ仕様

### 入力データ構造
```typescript
interface AssessmentForm {
  // 基本情報
  companyName: string;
  department: string;
  businessName: string;
  evaluationDate: string;
  evaluator: string;
  
  // 評価項目（1-5点）
  regularity: number;
  procedureClarity: number;
  exceptionFrequency: number;
  procedureDecision: number;
  learningAdaptation: number;
  dataConfidentiality: number;
  realtimeRequirement: number;
  systemOperation: number;
  dataProcessing: number;
  apiIntegration: number;
  securityConstraints: number;
  timeSavingEffect: number;
  qualityImprovement: number;
}
```

### 出力データ構造
```typescript
interface AssessmentResult {
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
```

## 運用仕様

### デプロイ方法
1. **GitHub**へのコードpush
2. **GitHub Actions**による自動ビルド・デプロイ
3. **Azure Static Web Apps**での本番公開

### 監視・メンテナンス
- **GitHub Actions**：ビルド・デプロイ状況の確認
- **Azure Portal**：アプリケーションの稼働状況確認
- **コスト管理**：無料枠の使用状況監視

### バックアップ・復旧
- **ソースコード**：GitHubリポジトリでバージョン管理
- **設定情報**：Infrastructure as Code（設定のコード化）

## セキュリティ仕様

### 通信セキュリティ
- **HTTPS**：全通信の暗号化
- **Azure Static Web Apps**：標準セキュリティ機能

### データ保護
- **現在**：ローカルストレージ（クライアントサイド）
- **将来**：Azure Cosmos DB（暗号化ストレージ）

## 制限事項

### 現在の制限
- **ユーザー管理**：認証機能なし（全データが公開状態）
- **データ削除**：管理者による手動削除が必要
- **アクセス制御**：企業別データアクセス制限なし
- **セキュリティ**：基本的なHTTPS通信のみ

### パフォーマンス制限
- **Azure Static Web Apps**：無料枠での運用
- **GitHub Actions**：月間実行時間制限（パブリックリポジトリは無制限）

## 実装済み機能

### Phase 1: データ永続化機能 ✅
- **Cosmos DB連携**: Azure Cosmos DBによる評価結果の永続化
- **Azure Functions API**: サーバーレス関数による CRUD操作
- **環境変数管理**: 機密情報の安全な管理

### Phase 2: 企業分析機能 ✅
- **企業検索**: 企業名による評価結果の検索・表示
- **企業統計**: 企業別の総合統計情報
- **最新評価一覧**: 企業の最新評価結果の表示

### Phase 3: 統計・グラフ機能 ✅
- **円グラフ**: 技術レベル分布の可視化（Chart.js）
- **棒グラフ**: 導入可能性分布の可視化（Chart.js）
- **インタラクティブUI**: レスポンシブなグラフ表示
- **モバイル対応**: スマートフォン・タブレット対応

### Phase 4: 業界横断分析機能 ✅
- **業界統計**: 全参加企業の概況表示
- **企業ランキング**: 平均スコア順での企業順位表示
- **類似業務マッチング**: 同じ業務を行う企業の発見
- **類似度スコア**: 独自アルゴリズムによる業務類似度算出
- **検索・フィルタ**: 業務名・企業名での絞り込み機能

## 今後の拡張予定

### Phase 5: セキュリティ強化
- **Azure AD B2C**: ユーザー認証システム
- **ロールベースアクセス制御**: 企業別データアクセス管理
- **API認証**: Azure Functions の認証レベル強化

### Phase 6: 高度機能
- **レポート出力**: PDF・Excel形式でのレポート生成
- **時系列分析**: 評価結果の時系列変化追跡
- **API提供**: 外部システム連携用のREST API

## 付録

### 参考資料
- [Azure Static Web Apps Documentation](https://docs.microsoft.com/en-us/azure/static-web-apps/)
- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)

### 開発環境
- **OS**: macOS
- **Node.js**: 18.x
- **エディタ**: Visual Studio Code
- **バージョン管理**: Git + GitHub

---

**最終更新日**: 2025年7月16日  
**バージョン**: 2.0.0  
**作成者**: 業務自動化評価システム開発チーム

## データ削除方法

### テストデータの削除
テスト用に作成したデータを削除するには、以下の方法があります：

#### 1. Azure Portalでの削除
1. Azure Portalにログイン
2. Cosmos DB「business-automation-assess-db」を選択
3. 「データエクスプローラー」を開く
4. 「AssessmentResults」コンテナを選択
5. 削除したいアイテムを選択して削除

#### 2. コマンドラインでの削除
```bash
# 特定企業のデータを削除
az cosmosdb sql container delete-item \
  --account-name business-automation-assess-db \
  --resource-group automation-assessment-rg \
  --database-name AssessmentDB \
  --container-name AssessmentResults \
  --item-id <アイテムID> \
  --partition-key-value <企業名>

# 全データを削除（注意：復元不可）
az cosmosdb sql container delete \
  --account-name business-automation-assess-db \
  --resource-group automation-assessment-rg \
  --database-name AssessmentDB \
  --name AssessmentResults

# コンテナの再作成
az cosmosdb sql container create \
  --account-name business-automation-assess-db \
  --resource-group automation-assessment-rg \
  --database-name AssessmentDB \
  --name AssessmentResults \
  --partition-key-path "/companyName"
```

## セキュリティ強化施策

### 低コスト・簡単な施策

#### 1. Azure Static Web Apps の認証機能（無料）
```yaml
# staticwebapp.config.json
{
  "auth": {
    "identityProviders": {
      "azureActiveDirectory": {
        "userDetailsClaim": "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"
      }
    }
  },
  "routes": [
    {
      "route": "/api/*",
      "allowedRoles": ["authenticated"]
    }
  ]
}
```

#### 2. Azure Functions の認証レベル変更
```javascript
// function.json
{
  "bindings": [
    {
      "authLevel": "function", // anonymous → function に変更
      "type": "httpTrigger"
    }
  ]
}
```

#### 3. CORS設定の強化
```json
{
  "cors": {
    "allowedOrigins": ["https://polite-bay-08aef5400.2.azurestaticapps.net"],
    "allowedMethods": ["GET", "POST", "DELETE"],
    "allowedHeaders": ["Content-Type", "Authorization"]
  }
}
```

#### 4. Cosmos DB のファイアウォール設定
```bash
# 特定IPアドレスからのみアクセス許可
az cosmosdb network-rule add \
  --account-name business-automation-assess-db \
  --resource-group automation-assessment-rg \
  --ip-address <許可するIPアドレス>
```

#### 5. 入力検証の強化
```typescript
// バリデーション関数の追加
const validateInput = (data: any): boolean => {
  // SQLインジェクション対策
  const sqlPattern = /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER)\b)/i;
  
  // XSS対策
  const xssPattern = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
  
  for (const value of Object.values(data)) {
    if (typeof value === 'string') {
      if (sqlPattern.test(value) || xssPattern.test(value)) {
        return false;
      }
    }
  }
  return true;
};
```

### 実装優先度
1. **高**: Azure Static Web Apps認証（無料、簡単）
2. **中**: Azure Functions認証レベル変更（無料、簡単）
3. **中**: 入力検証強化（無料、開発工数少）
4. **低**: CORS設定（無料、設定変更のみ）
5. **低**: Cosmos DB ファイアウォール（無料、運用考慮必要）