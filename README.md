# ジュース購入用ポイント管理アプリ

家族でお手伝いタスクをこなしてポイントを貯め、10ポイントでジュースと交換できる家族向けポイント管理アプリです。

## 機能

- **ユーザー認証**: ユーザー選択 + PINコードによるログイン
- **タスク申請**: 自分のタスクを選択してポイントを申請
- **申請管理**: 管理者が申請を承認・却下
- **ジュース交換**: 貯まった10ポイントをジュースと交換
- **タスク管理**: 管理者がタスクの追加・編集・削除

## 技術スタック

- **フレームワーク**: [Next.js](https://nextjs.org/) 16 (App Router)
- **言語**: TypeScript
- **データベース**: Amazon DynamoDB
- **デプロイ**: Vercel
- **認証**: Vercel OIDC + AWS IAM Role

## DynamoDB テーブル構成

### TABLE_MASTER_USER（ユーザー）

| フィールド  | 型     | 説明                     |
|------------|--------|--------------------------|
| id         | String | パーティションキー         |
| user       | String | ユーザー名               |
| authority  | String | 権限（`admin` / 一般）   |
| pin        | String | ログイン用PINコード       |

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
| isUsed     | String | `未使用` / `使用済`              |
| createdAt  | String | 申請日時（ISO 8601形式）         |

## 環境変数

Vercel のダッシュボードまたは `.env.local` に以下を設定してください。

```env
AWS_REGION=ap-northeast-1
AWS_ROLE_ARN=arn:aws:iam::<アカウントID>:role/<ロール名>
TABLE_MASTER_USER=<ユーザーテーブル名>
TABLE_MASTER_TASK=<タスクテーブル名>
TABLE_SUBMISSIONS=<申請テーブル名>
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

## ページ構成

| パス      | 説明                                        |
|----------|---------------------------------------------|
| `/`      | メインページ（ログイン・タスク申請・申請管理）  |
| `/admin` | タスク管理ページ（管理者のみ）               |
