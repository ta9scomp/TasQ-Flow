# TasQ Flow プロトタイプ

TasQ Flowのプロトタイプ実装です。React + TypeScript + Material-UIを使用して、基本的なガントチャート機能を実装しています。

## 機能

### 実装済み機能 ✅
- **ガントチャート表示**
  - タスクバーの表示（優先度に応じた色分け）
  - 時間軸（月・日表示）
  - タスクリスト
  - 進捗表示
  - 優先度インジケーター
  - カスタム縁取り（ボーダー）機能
  - クリックでタスク編集

- **高度な検索機能**
  - 記号による検索（@担当者 #タグ %進捗 !優先度 $ステータス ^稼働率）
  - サジェスト表示
  - フィルタチップ機能
  - リアルタイム検索

- **タスク編集ダイアログ**
  - 包括的なタスク編集機能
  - 優先度スライダー（0-100）
  - 日付ピッカー
  - 担当者・タグの管理
  - 縁取りスタイルのカスタマイズ

- **メンバー管理**
  - メンバー一覧表示
  - 権限管理（オーナー・管理者・メンバー・閲覧者）
  - タスク割当状況の可視化
  - ヒートマップ表示（稼働率を色で表現）
  - メンバー別表示/非表示切り替え

- **付箋機能**
  - ドラッグ可能な付箋
  - 複数色対応
  - 最小化・拡大機能
  - アクリル風透明効果
  - 付箋一覧管理

- **ToDoタブ**
  - タスクの詳細表示
  - フィルタリング（ステータス別）
  - ソート機能（優先度・期限・担当者）
  - 検索機能
  - 進捗表示とチェックリスト

- **設定画面**
  - 表示設定（軽量化モード、アニメーション等）
  - 検索設定（履歴件数、サジェスト）
  - 通知設定（デスクトップ、メール）
  - プライバシー設定
  - カラープリセット管理
  - 開発者向け設定

### 開発予定機能 ⏳
- ドラッグ&ドロップ操作
- タスクフォグ表示
- 変更履歴タブ
- リアルタイム同期
- データの永続化
- ユーザー認証

## 開発・起動方法

### 前提条件
- Node.js 20.13.1以上
- npm 10.5.2以上

### セットアップ
```bash
# プロジェクトディレクトリに移動
cd "TasQ Flow/tasq-flow-prototype"

# 依存関係をインストール
npm install

# 開発サーバーを起動
npm run dev
```

アプリケーションは http://localhost:5173/ で確認できます。

### 使用技術
- **フロントエンド**: React 18 + TypeScript
- **UIライブラリ**: Material-UI (MUI) v7
- **ビルドツール**: Vite
- **日付処理**: date-fns
- **アイコン**: Material-UI Icons

## プロジェクト構造

```
src/
├── components/
│   ├── Layout/
│   │   ├── Header.tsx          # ヘッダー（検索、通知、プロフィール）
│   │   └── Sidebar.tsx         # サイドバー（ナビゲーション）
│   └── GanttChart/
│       ├── GanttChart.tsx      # メインガントチャート
│       ├── TaskBar.tsx         # タスクバー表示
│       ├── TaskList.tsx        # タスク一覧
│       └── TimeScale.tsx       # 時間軸表示
├── types/
│   └── task.ts                 # 型定義
├── utils/
│   └── colorUtils.ts           # カラー関連ユーティリティ
├── data/
│   └── sampleData.ts           # サンプルデータ
└── App.tsx                     # メインアプリケーション
```

## 特徴的な実装

### 優先度管理
- 0-100の数値による細かい優先度設定
- 色分けルール：
  - 80-100: 緊急（赤系）🔴
  - 50-79: 高（オレンジ系）🟡  
  - 20-49: 中（緑系）🟢
  - 0-19: 低（グレー系）⚪

### カスタム縁取り機能
- タスクバーとタスクフォグに縁取り設定可能
- 太さ（1px、2px、3px）、色、スタイル（実線、点線、破線）をカスタマイズ
- 自動コントラスト調整機能

### 自動カラー補正
- 視認性確保のための明度・彩度調整
- 背景色に応じた自動コントラスト設定

## 仕様書との対応

このプロトタイプは `/TasQ Flow/TasQ Flow 要件仕様書.txt` の主要な仕様に基づいて実装されています：

- セクション01: タスク構造・親子階層 ✅
- セクション03: タスクバー・タスクフォグ仕様 ✅（縁取り機能含む）
- セクション05: 検索機能 🚧（UI実装済み、機能は開発予定）
- セクション46: 優先度管理の詳細仕様 ✅

## 今後の開発計画

1. 検索機能の完全実装（記号検索、フィルタリング）
2. ドラッグ&ドロップによるタスク操作
3. メンバー管理とヒートマップ表示
4. タスクフォグ機能
5. 付箋機能
6. リアルタイム同期機能
7. データの永続化

## ライセンス

このプロトタイプは学習・検証目的で作成されています。