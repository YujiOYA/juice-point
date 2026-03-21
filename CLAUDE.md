# CLAUDE.md

## プロジェクト概要

家族向けのお手伝いポイント管理アプリ。タスクをこなしてポイントを貯め、好きな報酬と交換できる。

---

## 技術スタック

- **Next.js 16** (App Router, Turbopack)
- **TypeScript**
- **Amazon DynamoDB**（AWS SDK v3）
- **Vercel** デプロイ + **OIDC** で AWS 認証
- **sonner** トースト通知

---

## AWS / Vercel 認証

- Vercel 環境では **OIDC** 経由で AWS IAM Role を使用（`AWS_ROLE_ARN`）
- `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` は Vercel には不要（ローカル開発時のみ）
- IAM ロール: `vercel-dynamo-read-write`（DynamoDB の CRUD 権限が必要）

---

## 環境変数

| 変数名 | 説明 |
|--------|------|
| `AWS_REGION` | `ap-northeast-1` |
| `AWS_ROLE_ARN` | Vercel OIDC 用 IAM Role ARN |
| `TABLE_MASTER_USER` | ユーザーテーブル名 |
| `TABLE_MASTER_TASK` | タスクテーブル名 |
| `TABLE_SUBMISSIONS` | 申請テーブル名 |
| `TABLE_MASTER_REWARD` | 報酬テーブル名 |

---

## DynamoDB テーブル

### TABLE_MASTER_USER
- `id` (PK), `user`, `authority`（`admin` / `user`）, `pin`（ログイン用）

### TABLE_MASTER_TASK
- `id` (PK), `task`, `point`, `whose`

### TABLE_SUBMISSIONS
- `id` (PK), `whatYouDid`, `whoDid`, `point`, `status`（`未承認`/`承認`/`却下`）, `createdAt`

### TABLE_MASTER_REWARD
- `id` (PK), `name`, `point`（交換に必要なポイント数）, `whose`（担当ユーザー名）

---

## コーディング規約

### アーキテクチャ

- **Atomic Design** を採用: `atoms` → `molecules` → `organisms`
- **ロジックはカスタム hook に分離**。TSX ファイルは JSX のみに集中すること
  - hooks は `src/hooks/` に配置
- Server Component でデータ取得 → Client Component に props で渡す
- データ変更は **API Routes**（`/api/*`）に fetch で POST

### パスエイリアス（tsconfig.json）

```
@app/*      → src/app/*
@atom/*     → src/components/atoms/*
@molecule/* → src/components/molecules/*
@organism/* → src/components/organisms/*
@hook/*     → src/hooks/*
@lib/*      → src/lib/*
@type/*     → src/types/*
```

### レスポンシブ

- **スマホ（768px未満）**: カード形式
- **PC（768px以上）**: テーブル形式
- `globals.css` の `@media (min-width: 768px)` で切り替え

---

## ページ構成

| パス | 説明 |
|------|------|
| `/` | メイン（ログイン・タスク申請・報酬交換）。ユーザーが0人の場合は初期設定画面を表示 |
| `/admin` | 管理画面（申請管理・タスク管理・報酬管理・ユーザー管理）。admin ユーザーのみ |

---

## API ルート

| エンドポイント | メソッド | 説明 |
|--------------|---------|------|
| `/api/auth` | POST | PIN 認証 |
| `/api/submissions` | GET / POST | 申請の取得・操作（type: register / approve / disapprove / restore / delete / usePoints） |
| `/api/tasks` | GET / POST | タスクの取得・CRUD（type: create / update / delete） |
| `/api/rewards` | GET / POST | 報酬の取得・CRUD（type: create / update / delete） |
| `/api/users` | GET / POST | ユーザーの取得・CRUD（type: create / update / delete） |

---

## ブランチ管理

### 開発フロー

**実装指示を受けたら、以下のフローを自動的に実行する:**

1. `main` から `feat/<機能名>` ブランチを作成
2. 実装・コミット
3. `gh pr create` で PR を作成（タイトル・本文を日本語で記述）
4. `gh pr merge <番号> --merge --delete-branch` でマージ・ブランチ削除

```bash
git checkout main && git pull
git checkout -b feat/<機能名>
# 実装...
git add <files> && git commit -m "feat: ..."
git push -u origin feat/<機能名>
gh pr create --title "..." --body "..."
gh pr merge <番号> --merge --delete-branch
```

### 特殊ブランチ（mainにマージしない）

#### `feat/server-actions`

API Routes を **Next.js Server Actions** に移行した実験ブランチ。

- `/api/tasks`・`/api/submissions`・`/api/auth` を削除し、`src/actions/` に置き換え
- `revalidatePath` でデータ再取得するため、手動 fetch・`useSubmissions` フックが不要になる
- `@action/*` エイリアスを tsconfig に追加済み（`src/actions/*`）

**main にマージしない理由**: 将来 Expo（React Native）でスマホアプリ化する際、
モバイルから API Routes を直接叩く構成が必要なため、API Routes 版を main に残す。
Web 専用に絞る判断になったタイミングでこのブランチをマージする。

---

## 注意事項

- `page.tsx` には `export const dynamic = "force-dynamic"` が必要（OIDC 認証はビルド時に使えないため）
- DynamoDB の `task` フィールドは予約語のため UpdateExpression で `#t` エイリアスを使用
- DynamoDB の `user` フィールドも予約語のため UpdateExpression で `#u` エイリアスを使用
- ポイント計算は `status === "承認"` の submissions のみ対象
- 報酬交換時は古い申請から順に（`createdAt` 昇順）必要ポイント分を削除または減額する
- タスク・報酬はどちらも `whose` フィールドでユーザーを絞り込んで表示する
- `ToasterWithBackdrop` は SSR 不要なため `dynamic(() => import(...), { ssr: false })` で読み込む
