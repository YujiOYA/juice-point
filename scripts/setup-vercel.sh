#!/usr/bin/env bash
# =============================================================================
# family-point-app Vercel セットアップスクリプト
#
# 【前提条件】
#   - Vercel CLI がインストール済みであること（npm i -g vercel）
#   - scripts/setup-aws.sh を実行済みであること（AWS_ROLE_ARN が必要）
#
# 【使い方】
#   chmod +x scripts/setup-vercel.sh
#   ./scripts/setup-vercel.sh
#
# 【実行内容】
#   - Vercel プロジェクトへのリンク（未リンクの場合）
#   - 環境変数の一括設定（production / preview / development）
# =============================================================================

set -euo pipefail

# ── カラー出力 ────────────────────────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

info()    { echo -e "${BLUE}[INFO]${NC} $*"; }
success() { echo -e "${GREEN}[OK]${NC}   $*"; }
warn()    { echo -e "${YELLOW}[WARN]${NC} $*"; }
error()   { echo -e "${RED}[ERROR]${NC} $*"; exit 1; }

# ── 設定値 ────────────────────────────────────────────────────────────────────
REGION="${AWS_REGION:-ap-northeast-1}"
TABLE_USER="TABLE_MASTER_USER"
TABLE_TASK="TABLE_MASTER_TASK"
TABLE_SUBMISSIONS="TABLE_SUBMISSIONS"
TABLE_REWARD="TABLE_MASTER_REWARD"

echo ""
echo "======================================================"
echo "  family-point-app Vercel セットアップ"
echo "======================================================"
echo ""

# ── 前提チェック ─────────────────────────────────────────────────────────────
command -v vercel >/dev/null 2>&1 || error "Vercel CLI がインストールされていません。\n  → npm install -g vercel を実行してください。"

# ── Vercel ログイン確認 ────────────────────────────────────────────────────────
echo "──────────────────────────────────────────────────────"
echo "  1. Vercel 認証"
echo "──────────────────────────────────────────────────────"

if ! vercel whoami >/dev/null 2>&1; then
  info "Vercel にログインします..."
  vercel login
fi
VERCEL_USER=$(vercel whoami 2>/dev/null)
success "ログイン済み: ${VERCEL_USER}"
echo ""

# ── プロジェクトリンク ─────────────────────────────────────────────────────────
echo "──────────────────────────────────────────────────────"
echo "  2. Vercel プロジェクトのリンク"
echo "──────────────────────────────────────────────────────"

if [[ -f ".vercel/project.json" ]]; then
  PROJECT_ID=$(grep -o '"projectId":"[^"]*"' .vercel/project.json | cut -d'"' -f4)
  warn "既にリンク済みです（projectId: ${PROJECT_ID}）"
else
  info "Vercel プロジェクトにリンクします..."
  echo "  ※ 新規プロジェクトを作成するか、既存プロジェクトを選択してください"
  echo ""
  vercel link
  success "プロジェクトをリンクしました"
fi
echo ""

# ── AWS_ROLE_ARN の入力 ────────────────────────────────────────────────────────
echo "──────────────────────────────────────────────────────"
echo "  3. AWS IAM ロール ARN の設定"
echo "──────────────────────────────────────────────────────"
echo ""
echo "  setup-aws.sh で作成した AWS_ROLE_ARN を入力してください"
echo "  （例: arn:aws:iam::123456789012:role/family-point-app-vercel-oidc）"
echo ""
read -r -p "  AWS_ROLE_ARN: " AWS_ROLE_ARN

if [[ -z "$AWS_ROLE_ARN" ]]; then
  error "AWS_ROLE_ARN が入力されていません。setup-aws.sh を先に実行してください。"
fi
echo ""

# ── 環境変数の設定 ─────────────────────────────────────────────────────────────
echo "──────────────────────────────────────────────────────"
echo "  4. 環境変数の設定"
echo "──────────────────────────────────────────────────────"
echo ""

# vercel env add <key> <environment> に値を stdin で渡す
set_env() {
  local key="$1"
  local value="$2"
  local envs=("production" "preview" "development")

  for env in "${envs[@]}"; do
    # 既存の値を確認（vercel env ls でチェック）
    if vercel env ls "$env" 2>/dev/null | grep -q "^${key}"; then
      # 既存の場合は上書き（rm してから add）
      vercel env rm "$key" "$env" --yes >/dev/null 2>&1 || true
    fi
    echo "$value" | vercel env add "$key" "$env" >/dev/null 2>&1
  done
  success "${key} を設定しました"
}

declare -A ENV_VARS=(
  ["AWS_REGION"]="$REGION"
  ["AWS_ROLE_ARN"]="$AWS_ROLE_ARN"
  ["TABLE_MASTER_USER"]="$TABLE_USER"
  ["TABLE_MASTER_TASK"]="$TABLE_TASK"
  ["TABLE_SUBMISSIONS"]="$TABLE_SUBMISSIONS"
  ["TABLE_MASTER_REWARD"]="$TABLE_REWARD"
)

for key in AWS_REGION AWS_ROLE_ARN TABLE_MASTER_USER TABLE_MASTER_TASK TABLE_SUBMISSIONS TABLE_MASTER_REWARD; do
  set_env "$key" "${ENV_VARS[$key]}"
done

echo ""

# ── 完了メッセージ ────────────────────────────────────────────────────────────
echo "======================================================"
echo -e "${GREEN}  Vercel セットアップ完了！${NC}"
echo "======================================================"
echo ""
echo "  設定した環境変数："
echo ""
vercel env ls production 2>/dev/null | grep -E "AWS_REGION|AWS_ROLE_ARN|TABLE_" || true
echo ""
echo "  次のステップ："
echo "  1. vercel deploy でデプロイする"
echo "  2. Vercel ダッシュボードで環境変数を確認する"
echo "     https://vercel.com/dashboard"
echo ""
