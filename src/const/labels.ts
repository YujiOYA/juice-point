export const LABELS = {
  /** アプリ共通 */
  app: {
    title: "⭐ ポイント管理アプリ ⭐",
  },

  /** 共通UI部品 */
  common: {
    add:          "追加",
    edit:         "編集",
    save:         "保存",
    cancel:       "キャンセル",
    delete:       "削除",
    approve:      "承認",
    reject:       "却下",
    restore:      "🔄 戻す",
    deleteIcon:   "🗑️ 削除",
    sortAsc:      "↑",
    sortDesc:     "↓",
    sortLabel:    "並び替え",
    sortFirst:    "第1",
    sortSecond:   "第2",
    sortNone:     "なし",
    filterPerson: "担当者",
    filterAll:    "全員",
    selectPerson: "担当者を選択",
  },

  /** 権限表示ラベル */
  authority: {
    admin: "管理者",
    user:  "一般",
  },

  /** 初期設定画面 */
  setup: {
    heading:             "🛠️ 初期設定",
    description:         "最初の管理者アカウントを作成してください",
    labelName:           "👤 管理者名",
    labelPin:            "🔑 PIN",
    labelPinConfirm:     "🔑 PIN（確認）",
    placeholderName:     "名前を入力",
    placeholderPin:      "PINを入力",
    placeholderPinConfirm: "PINをもう一度入力",
    buttonSubmit:        "管理者アカウントを作成",
  },

  /** ログインフォーム */
  login: {
    labelWho:          "👤 だれがつかうの？",
    placeholderSelect: "えらんでね",
    labelPin:          "🔑 PIN",
    placeholderPin:    "PINを入力",
    buttonLogin:       "ログイン",
    buttonLogout:      "ログアウト",
    errorWrongPin:     "PINが違います",
    loggedInAs: (name: string) => `👤 ${name} でログイン中`,
  },

  /** タスクフォーム（子ども画面） */
  taskForm: {
    tabSubmit:  "✅ タスク完了",
    tabRequest: "📝 新規タスク追加",
    tabRewards: "🎁 ポイント交換",

    labelTask:        "🎯 タスクをえらんでね",
    placeholderTask:  "タスクを選んでね！",
    labelPoints:      "💰 もらえるポイント",
    buttonSubmit:     "✅ 申請する",
    pendingCount: (n: number) => `⏳ 承認待ち（${n}件）`,

    labelTaskName:           "タスク名",
    placeholderTaskName:     "例: 🧺洗濯物をたたむ",
    labelRequestPoint:       "希望ポイント",
    placeholderRequestPoint: "例: 1.5",
    checkboxRegisterTask:    "タスクとして登録",

    currentPoints:  (n: number) => `💰 現在のポイント: ${n}pt`,
    buttonExchange: (name: string, point: string | number) => `${name}（${point}pt）と交換する`,
    noRewards:      "交換できる報酬がありません",
  },

  /** 申請管理パネル（管理者画面） */
  manager: {
    titlePending:          "📋 申請一覧",
    titleRejected:         "❌ 却下済み",
    titlePoints:           "💰 未使用ポイント",
    titleTaskRequests:     "📝 タスク追加リクエスト",
    titleRejectedRequests: "❌ 却下済みタスク追加リクエスト",
    noPending:             "申請はありません 🎉",
    noRequests:            "リクエストはありません 🎉",
    unregisteredTask:      "未登録タスク",
    thTask:        "タスク",
    thPerson:      "実施者",
    thPoint:       "ポイント",
    thStatus:      "ステータス",
    thDate:        "申請日時",
    thTaskName:    "タスク名",
    thRequester:   "リクエスト者",
    thRequestedPt: "希望ポイント",
  },

  /** ユーザー管理 */
  userManager: {
    headingAdd:         "ユーザーを追加",
    headingList:        "ユーザー一覧",
    placeholderUser:    "ユーザー名",
    placeholderPin:     "PIN",
    placeholderPinEdit: "PIN（空欄で変更なし）",
    sortByName:         "ユーザー名",
    sortByAuthority:    "権限",
    colName:            "ユーザー名",
    colAuthority:       "権限",
  },

  /** タスク管理 */
  taskManager: {
    headingAdd:       "タスクを追加",
    headingList:      "タスク一覧",
    placeholderTask:  "タスク名",
    placeholderPoint: "ポイント",
    sortByTask:       "タスク名",
    sortByPoint:      "ポイント",
    colTask:          "タスク名",
    colPoint:         "ポイント",
    colPerson:        "担当者",
  },

  /** 報酬管理 */
  rewardManager: {
    headingAdd:       "報酬を追加",
    headingList:      "報酬一覧",
    placeholderName:  "報酬名（例: ジュース）",
    placeholderPoint: "必要ポイント",
    sortByName:       "報酬名",
    sortByPoint:      "ポイント",
    colName:          "報酬名",
    colPoint:         "必要ポイント",
    colPerson:        "担当者",
  },

  /** プッシュ通知トグル */
  push: {
    denied:  "🔕 通知がブロックされています。ブラウザの設定から許可してください。",
    on:      "🔔 申請通知: オン（タップでオフ）",
    off:     "🔕 申請通知: オフ（タップでオン）",
    loading: "...",
  },

  /** トースト・確認メッセージ */
  toast: {
    // 初期設定
    setupSuccess:     "管理者アカウントを作成しました！管理画面へ移動します",
    setupPinMismatch: "PINが一致しません",
    setupError: (e: unknown) => `作成に失敗しました: ${e}`,

    // タスク申請
    submitSuccess:          "申請しました！🎉",
    submitError:            "エラーが発生しました",
    requestSuccess:         "申請しました！",
    requestWithTaskSuccess: "申請とタスク登録リクエストを送りました！",
    requestError:           "申請に失敗しました",
    exchangeSuccess: (name: string) => `🎁 ${name}と交換しました！`,
    exchangeError:          "交換に失敗しました",
    taskRequired:           "タスクを選択してください",
    taskNameRequired:       "タスク名とポイントを入力してください",

    // 申請承認・却下
    approveSuccess:     "承認しました！",
    approveError:       "承認に失敗しました",
    taskApproveSuccess: "承認してタスクに追加しました！",
    disapproveSuccess:  "却下しました",
    disapproveError:    "却下に失敗しました",
    restoreSuccess:     "申請一覧に戻しました",
    restoreError:       "操作に失敗しました",
    deleteSuccess:      "削除しました",
    deleteError:        "削除に失敗しました",

    // ユーザー管理
    userAddSuccess:    "ユーザーを追加しました",
    userAddError: (e: unknown) => `追加に失敗しました: ${e}`,
    userEditSuccess:   "ユーザーを更新しました",
    userEditError: (e: unknown) => `更新に失敗しました: ${e}`,
    userDeleteSuccess: "ユーザーを削除しました",
    userDeleteConfirm: "このユーザーを削除しますか？",

    // タスク管理
    taskAddSuccess:    "タスクを追加しました",
    taskAddError: (e: unknown) => `追加に失敗しました: ${e}`,
    taskEditSuccess:   "タスクを更新しました",
    taskEditError: (e: unknown) => `更新に失敗しました: ${e}`,
    taskDeleteSuccess: "タスクを削除しました",
    taskDeleteConfirm: "このタスクを削除しますか？",

    // 報酬管理
    rewardAddSuccess:    "報酬を追加しました",
    rewardAddError: (e: unknown) => `追加に失敗しました: ${e}`,
    rewardEditSuccess:   "報酬を更新しました",
    rewardEditError: (e: unknown) => `更新に失敗しました: ${e}`,
    rewardDeleteSuccess: "報酬を削除しました",
    rewardDeleteConfirm: "この報酬を削除しますか？",
  },
};
