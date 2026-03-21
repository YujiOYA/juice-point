# ポイント管理アプリ

家族でお手伝いタスクをこなしてポイントを貯め、好きな報酬と交換できる家族向けポイント管理アプリです。

## 機能

### 一般ユーザー
- **ログイン**: ユーザー選択 + PINコード認証（同一セッション内は自動ログイン）
- **タスク申請**: 担当タスクを選択してポイントを申請
- **報酬交換**: 貯まったポイントを担当報酬と交換

### 管理者（admin）
- **申請管理**: 申請の承認・却下・却下済み申請の復元・削除
- **タスク管理**: タスクの追加・編集・削除（担当ユーザー設定）
- **報酬管理**: 報酬アイテムの追加・編集・削除（担当ユーザー設定）
- **ユーザー管理**: ユーザーの追加・編集・削除（PIN・権限設定）

### 初回起動時
- ユーザーが0人の場合、初期設定画面を表示して最初の管理者アカウントを作成できる

## 技術スタック

- **フレームワーク**: [Next.js](https://nextjs.org/) 16 (App Router)
- **言語**: TypeScript
- **データベース**: Amazon DynamoDB
- **デプロイ**: Vercel
- **認証**: Vercel OIDC + AWS IAM Role
- **通知**: sonner（トースト）

## DynamoDB テーブル構成

### TABLE_MASTER_USER（ユーザー）

| フィールド  | 型     | 説明                          |
|------------|--------|-------------------------------|
| id         | String | パーティションキー              |
| user       | String | ユーザー名                    |
| authority  | String | 権限（`admin` / `user`）      |
| pin        | String | ログイン用PINコード            |

### TABLE_MASTER_TASK（タスク）

| フィールド | 型     | 説明             |
|-----------|--------|------------------|
| id        | String | パーティションキー |
| task      | String | タスク名         |
| point     | String | 獲得ポイント     |
| whose     | String | 担当ユーザー名   |

### TABLE_SUBMISSIONS（申請）

| フィールド  | 型     | 説明                             |
|------------|--------|----------------------------------|
| id         | String | パーティションキー                 |
| whatYouDid | String | 実施したタスク名                  |
| whoDid     | String | 実施者のユーザー名                |
| point      | String | ポイント数                       |
| status     | String | `未承認` / `承認` / `却下`       |
| createdAt  | String | 申請日時（ISO 8601形式）         |

### TABLE_MASTER_REWARD（報酬）

| フィールド | 型     | 説明               |
|-----------|--------|--------------------|
| id        | String | パーティションキー   |
| name      | String | 報酬名             |
| point     | String | 交換に必要なポイント |
| whose     | String | 担当ユーザー名     |

## 環境変数

Vercel のダッシュボードまたは `.env.local` に以下を設定してください。

```env
AWS_REGION=ap-northeast-1
AWS_ROLE_ARN=arn:aws:iam::<アカウントID>:role/<ロール名>
TABLE_MASTER_USER=<ユーザーテーブル名>
TABLE_MASTER_TASK=<タスクテーブル名>
TABLE_SUBMISSIONS=<申請テーブル名>
TABLE_MASTER_REWARD=<報酬テーブル名>
```

> **ローカル開発時**は `AWS_ACCESS_KEY_ID` と `AWS_SECRET_ACCESS_KEY` も設定してください（Vercel環境ではOIDCを使用するため不要）。

## AWS IAM ポリシー

Vercel OIDC 連携用の IAM ロールに以下のポリシーをアタッチしてください。

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "dynamodb:GetItem",
        "dynamodb:PutItem",
        "dynamodb:UpdateItem",
        "dynamodb:DeleteItem",
        "dynamodb:Scan",
        "dynamodb:Query"
      ],
      "Resource": "*"
    }
  ]
}
```

## セットアップ

```bash
# 依存関係をインストール
npm install

# 開発サーバーを起動
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開きます。

### 初回セットアップ

DynamoDB テーブルを作成して環境変数を設定したあと、アプリを起動するとユーザーが0人の場合に初期設定画面が表示されます。管理者名と PIN を入力して最初の管理者アカウントを作成してください。

## ページ構成

| パス      | 説明                                                               |
|----------|--------------------------------------------------------------------|
| `/`      | メインページ（ログイン・タスク申請・報酬交換）。ユーザー0人の場合は初期設定画面 |
| `/admin` | 管理画面（申請管理・タスク管理・報酬管理・ユーザー管理）。管理者のみ     |
