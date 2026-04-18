#!/usr/bin/env bash
# =============================================================================
# family-point-app AWS インフラセットアップスクリプト
#
# 【前提条件】
#   - AWS CLI がインストール済みであること
#   - aws configure で認証情報が設定済みであること（または AWS_* 環境変数が設定済み）
#
# 【使い方】
#   chmod +x scripts/setup-aws.sh
#   ./scripts/setup-aws.sh
#
# 【作成されるリソース】
#   - DynamoDB テーブル x4
#   - IAM ポリシー（DynamoDB アクセス用）
#   - IAM ユーザー + アクセスキー（ローカル開発用）
#   - IAM ロール（Vercel OIDC 用 ※オプション）
# =============================================================================

set -euo pipefail

# ── カラー出力 ────────────────────────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

info()    { echo -e "${BLUE}[INFO]${NC} $*"; }
success() { echo -e "${GREEN}[OK]${NC}   $*"; }
warn()    { echo -e "${YELLOW}[WARN]${NC} $*"; }
error()   { echo -e "${RED}[ERROR]${NC} $*"; exit 1; }

# ── 設定値（必要に応じて変更してください）────────────────────────────────────
REGION="${AWS_REGION:-ap-northeast-1}"
TABLE_USER="TABLE_MASTER_USER"
TABLE_TASK="TABLE_MASTER_TASK"
TABLE_SUBMISSIONS="TABLE_SUBMISSIONS"
TABLE_REWARD="TABLE_MASTER_REWARD"
TABLE_PUSH_SUBS="TABLE_PUSH_SUBSCRIPTIONS"
IAM_POLICY_NAME="family-point-app-dynamodb-policy"
IAM_USER_NAME="family-point-app-local"

# ── 前提チェック ─────────────────────────────────────────────────────────────
echo ""
echo "======================================================"
echo "  family-point-app AWS セットアップ"
echo "======================================================"
echo ""

command -v aws >/dev/null 2>&1 || error "AWS CLI がインストールされていません。https://aws.amazon.com/cli/ からインストールしてください。"

ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text 2>/dev/null) \
  || error "AWS 認証情報が設定されていません。'aws configure' を実行してください。"

info "AWSアカウント: ${ACCOUNT_ID}  リージョン: ${REGION}"
echo ""

# ── DynamoDB テーブル作成 ─────────────────────────────────────────────────────
echo "──────────────────────────────────────────────────────"
echo "  1. DynamoDB テーブルの作成"
echo "──────────────────────────────────────────────────────"

create_table_if_not_exists() {
  local table_name="$1"
  local key_schema="$2"
  local attr_defs="$3"

  if aws dynamodb describe-table --table-name "$table_name" --region "$REGION" >/dev/null 2>&1; then
    warn "テーブル ${table_name} は既に存在します（スキップ）"
  else
    aws dynamodb create-table \
      --table-name "$table_name" \
      --key-schema $key_schema \
      --attribute-definitions $attr_defs \
      --billing-mode PAY_PER_REQUEST \
      --region "$REGION" \
      --output text >/dev/null
    success "テーブル ${table_name} を作成しました"
  fi
}

# TABLE_MASTER_USER: PK=id
create_table_if_not_exists \
  "$TABLE_USER" \
  "AttributeName=id,KeyType=HASH" \
  "AttributeName=id,AttributeType=S"

# TABLE_MASTER_TASK: PK=id
create_table_if_not_exists \
  "$TABLE_TASK" \
  "AttributeName=id,KeyType=HASH" \
  "AttributeName=id,AttributeType=S"

# TABLE_SUBMISSIONS: PK=id
create_table_if_not_exists \
  "$TABLE_SUBMISSIONS" \
  "AttributeName=id,KeyType=HASH" \
  "AttributeName=id,AttributeType=S"

# TABLE_MASTER_REWARD: PK=id, SK=name
create_table_if_not_exists \
  "$TABLE_REWARD" \
  "AttributeName=id,KeyType=HASH AttributeName=name,KeyType=RANGE" \
  "AttributeName=id,AttributeType=S AttributeName=name,AttributeType=S"

# TABLE_PUSH_SUBSCRIPTIONS: PK=endpoint
create_table_if_not_exists \
  "$TABLE_PUSH_SUBS" \
  "AttributeName=endpoint,KeyType=HASH" \
  "AttributeName=endpoint,AttributeType=S"

echo ""

# ── IAM ポリシー作成 ──────────────────────────────────────────────────────────
echo "──────────────────────────────────────────────────────"
echo "  2. IAM ポリシーの作成"
echo "──────────────────────────────────────────────────────"

POLICY_ARN="arn:aws:iam::${ACCOUNT_ID}:policy/${IAM_POLICY_NAME}"

POLICY_DOC=$(cat <<EOF
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
        "dynamodb:Query",
        "dynamodb:Scan"
      ],
      "Resource": [
        "arn:aws:dynamodb:${REGION}:${ACCOUNT_ID}:table/${TABLE_USER}",
        "arn:aws:dynamodb:${REGION}:${ACCOUNT_ID}:table/${TABLE_TASK}",
        "arn:aws:dynamodb:${REGION}:${ACCOUNT_ID}:table/${TABLE_SUBMISSIONS}",
        "arn:aws:dynamodb:${REGION}:${ACCOUNT_ID}:table/${TABLE_REWARD}"
      ]
    }
  ]
}
EOF
)

if aws iam get-policy --policy-arn "$POLICY_ARN" >/dev/null 2>&1; then
  warn "IAMポリシー ${IAM_POLICY_NAME} は既に存在します（スキップ）"
else
  aws iam create-policy \
    --policy-name "$IAM_POLICY_NAME" \
    --policy-document "$POLICY_DOC" \
    --output text >/dev/null
  success "IAMポリシー ${IAM_POLICY_NAME} を作成しました"
fi

echo ""

# ── IAM ユーザー作成（ローカル開発用）────────────────────────────────────────
echo "──────────────────────────────────────────────────────"
echo "  3. IAM ユーザーの作成（ローカル開発用）"
echo "──────────────────────────────────────────────────────"

if aws iam get-user --user-name "$IAM_USER_NAME" >/dev/null 2>&1; then
  warn "IAMユーザー ${IAM_USER_NAME} は既に存在します（スキップ）"
  ACCESS_KEY_ID=""
  SECRET_ACCESS_KEY=""
else
  aws iam create-user --user-name "$IAM_USER_NAME" --output text >/dev/null
  success "IAMユーザー ${IAM_USER_NAME} を作成しました"

  aws iam attach-user-policy \
    --user-name "$IAM_USER_NAME" \
    --policy-arn "$POLICY_ARN"
  success "ポリシーをアタッチしました"

  KEY_OUTPUT=$(aws iam create-access-key --user-name "$IAM_USER_NAME" --output json)
  ACCESS_KEY_ID=$(echo "$KEY_OUTPUT" | grep -o '"AccessKeyId": "[^"]*"' | cut -d'"' -f4)
  SECRET_ACCESS_KEY=$(echo "$KEY_OUTPUT" | grep -o '"SecretAccessKey": "[^"]*"' | cut -d'"' -f4)
  success "アクセスキーを作成しました"
fi

echo ""

# ── Vercel OIDC ロール作成（オプション）──────────────────────────────────────
echo "──────────────────────────────────────────────────────"
echo "  4. Vercel OIDC ロールの作成（Vercelデプロイ用）"
echo "──────────────────────────────────────────────────────"
echo ""
echo "  Vercelにデプロイする場合、OIDCロールが必要です。"
echo "  作成しますか？ [y/N]"
read -r SETUP_VERCEL

if [[ "${SETUP_VERCEL:-n}" =~ ^[Yy]$ ]]; then
  echo ""
  echo "  VercelのチームIDまたはユーザーID（例: team_xxxxxxxxxx または user_xxxxxxxxxx）を入力してください:"
  echo "  ※ Vercelダッシュボード > Settings > General > Vercel ID で確認できます"
  read -r VERCEL_OWNER_ID

  VERCEL_ROLE_NAME="family-point-app-vercel-oidc"
  VERCEL_ROLE_ARN="arn:aws:iam::${ACCOUNT_ID}:role/${VERCEL_ROLE_NAME}"

  TRUST_POLICY=$(cat <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "arn:aws:iam::${ACCOUNT_ID}:oidc-provider/oidc.vercel.com"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "oidc.vercel.com:aud": "${VERCEL_OWNER_ID}"
        }
      }
    }
  ]
}
EOF
)

  # OIDC プロバイダーの作成（存在しない場合）
  OIDC_ARN="arn:aws:iam::${ACCOUNT_ID}:oidc-provider/oidc.vercel.com"
  if aws iam get-open-id-connect-provider --open-id-connect-provider-arn "$OIDC_ARN" >/dev/null 2>&1; then
    warn "OIDCプロバイダーは既に存在します（スキップ）"
  else
    aws iam create-open-id-connect-provider \
      --url "https://oidc.vercel.com" \
      --client-id-list "${VERCEL_OWNER_ID}" \
      --thumbprint-list "a031c46782e6e6c662c2c87c76da9aa62ccabd8e" \
      --output text >/dev/null
    success "OIDCプロバイダーを作成しました"
  fi

  # Vercel用ロールの作成
  if aws iam get-role --role-name "$VERCEL_ROLE_NAME" >/dev/null 2>&1; then
    warn "IAMロール ${VERCEL_ROLE_NAME} は既に存在します（スキップ）"
  else
    aws iam create-role \
      --role-name "$VERCEL_ROLE_NAME" \
      --assume-role-policy-document "$TRUST_POLICY" \
      --output text >/dev/null
    aws iam attach-role-policy \
      --role-name "$VERCEL_ROLE_NAME" \
      --policy-arn "$POLICY_ARN"
    success "IAMロール ${VERCEL_ROLE_NAME} を作成しました"
    VERCEL_ROLE_ARN="arn:aws:iam::${ACCOUNT_ID}:role/${VERCEL_ROLE_NAME}"
  fi
else
  VERCEL_ROLE_ARN=""
fi

# ── 完了メッセージ ────────────────────────────────────────────────────────────
echo ""
echo "======================================================"
echo -e "${GREEN}  セットアップ完了！${NC}"
echo "======================================================"
echo ""
echo "  以下の内容で .env.local を作成してください："
echo ""
echo "  ┌─────────────────────────────────────────────────┐"
echo "  │ AWS_REGION=${REGION}"
if [[ -n "${ACCESS_KEY_ID:-}" ]]; then
echo "  │ AWS_ACCESS_KEY_ID=${ACCESS_KEY_ID}"
echo "  │ AWS_SECRET_ACCESS_KEY=${SECRET_ACCESS_KEY}"
else
echo "  │ AWS_ACCESS_KEY_ID=（既存のキーを使用してください）"
echo "  │ AWS_SECRET_ACCESS_KEY=（既存のキーを使用してください）"
fi
echo "  │ TABLE_MASTER_USER=${TABLE_USER}"
echo "  │ TABLE_MASTER_TASK=${TABLE_TASK}"
echo "  │ TABLE_SUBMISSIONS=${TABLE_SUBMISSIONS}"
echo "  │ TABLE_MASTER_REWARD=${TABLE_REWARD}"
echo "  │ TABLE_PUSH_SUBSCRIPTIONS=${TABLE_PUSH_SUBS}"
echo "  └─────────────────────────────────────────────────┘"

if [[ -n "${VERCEL_ROLE_ARN:-}" ]]; then
echo ""
echo "  Vercel環境変数（Vercelダッシュボードで設定）："
echo ""
echo "  ┌─────────────────────────────────────────────────┐"
echo "  │ AWS_REGION=${REGION}"
echo "  │ AWS_ROLE_ARN=${VERCEL_ROLE_ARN}"
echo "  │ TABLE_MASTER_USER=${TABLE_USER}"
echo "  │ TABLE_MASTER_TASK=${TABLE_TASK}"
echo "  │ TABLE_SUBMISSIONS=${TABLE_SUBMISSIONS}"
echo "  │ TABLE_MASTER_REWARD=${TABLE_REWARD}"
echo "  │ TABLE_PUSH_SUBSCRIPTIONS=${TABLE_PUSH_SUBS}"
echo "  └─────────────────────────────────────────────────┘"
fi

echo ""
echo "  次のステップ："
echo "  1. 上記の内容を .env.local に保存する"
echo "  2. npm run dev で開発サーバーを起動する"
echo "  3. http://localhost:3000 でアプリを確認する"
if [[ -n "${VERCEL_ROLE_ARN:-}" ]]; then
echo ""
echo "  Vercel へのデプロイ："
echo "  4. ./scripts/setup-vercel.sh を実行して Vercel 環境変数を自動設定する"
echo "     （AWS_ROLE_ARN: ${VERCEL_ROLE_ARN}）"
fi
echo ""
