"use client";

import { useState, useEffect, useCallback, useRef } from "react";

function ChildBadge() {
  return <span className="lp-mock-role lp-mock-role--child">👦 子の画面</span>;
}

function ParentBadge() {
  return <span className="lp-mock-role lp-mock-role--parent">👩 親の画面</span>;
}

/** ① 子：ログイン後のポイント確認 */
function Screen1() {
  return (
    <div className="lp-app-mock">
      <ChildBadge />
      <h1 className="page-title">⭐ ポイント管理アプリ ⭐</h1>
      <div className="card">
        <div className="user-info">
          <p className="user-name">👤 はるか でログイン中</p>
          <div className="points-badge">
            💰 12 <span className="points-label">ポイント</span>
          </div>
          <button className="logout-button" disabled>ログアウト</button>
        </div>
      </div>
    </div>
  );
}

/** ② 子：タスクを選んで申請 */
function Screen2() {
  return (
    <div className="lp-app-mock">
      <ChildBadge />
      <h1 className="page-title">⭐ ポイント管理アプリ ⭐</h1>
      <div className="card">
        <div className="task-form">
          <div className="tabs__list-wrap">
            <div className="tabs__list">
              <button className="tabs__tab tabs__tab--active">✅ タスク完了</button>
              <button className="tabs__tab">📝 新規</button>
              <button className="tabs__tab">🎁 交換</button>
            </div>
          </div>
          <label className="task-label">🎯 タスクをえらんでね</label>
          <div className="lp-mock-select">🍽️ お皿洗い（2pt）</div>
          <label className="task-label lp-mock-label-top">💰 もらえるポイント</label>
          <input className="input highlight" value="2" readOnly />
          <button className="submit-button lp-mock-btn-top lp-mock-btn-active" disabled>
            ✅ 申請する
          </button>
        </div>
      </div>
    </div>
  );
}

/** ③ 親：申請を確認して承認 */
function Screen3() {
  return (
    <div className="lp-app-mock">
      <ParentBadge />
      <h1 className="page-title">⭐ ポイント管理アプリ ⭐</h1>
      <div className="card">
        <p className="manager-title">📋 申請一覧</p>
        <div className="submission-card lp-mock-submission-highlight">
          <p className="submission-card__task">🍽️ お皿洗い</p>
          <div className="submission-card__meta">
            <span>はるか</span>
            <span>2pt</span>
            <span>未承認</span>
          </div>
          <div className="submission-card__actions">
            <button className="approve-button lp-mock-btn-active" disabled>✅ 承認</button>
            <button className="disapprove-button" disabled>❌ 却下</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/** ④ 子：承認されてポイント加算！ */
function Screen4() {
  return (
    <div className="lp-app-mock">
      <ChildBadge />
      <h1 className="page-title">⭐ ポイント管理アプリ ⭐</h1>
      <div className="card">
        <div className="user-info">
          <p className="user-name">👤 はるか でログイン中</p>
          <div className="points-badge lp-mock-badge-gained">
            💰 14 <span className="points-label">ポイント</span>
          </div>
          <div className="lp-mock-gained">🎉 +2pt 獲得！</div>
          <button className="logout-button" disabled>ログアウト</button>
        </div>
      </div>
    </div>
  );
}

/** ⑤ 子：貯まったポイントでご褒美と交換 */
function Screen5() {
  return (
    <div className="lp-app-mock">
      <ChildBadge />
      <h1 className="page-title">⭐ ポイント管理アプリ ⭐</h1>
      <div className="card">
        <div className="task-form">
          <div className="tabs__list-wrap">
            <div className="tabs__list">
              <button className="tabs__tab">✅ タスク完了</button>
              <button className="tabs__tab">📝 新規</button>
              <button className="tabs__tab tabs__tab--active">🎁 交換</button>
            </div>
          </div>
          <p className="lp-mock-points-line">
            💰 現在のポイント: <strong>14pt</strong>
          </p>
          <div className="lp-mock-reward-list">
            <button className="approve-button lp-mock-btn-active" disabled>
              🧃 ジュース（5pt）と交換する
            </button>
            <button className="approve-button lp-mock-btn-active" disabled>
              🍕 ピザの日（10pt）と交換する
            </button>
            <button className="approve-button lp-mock-reward-disabled" disabled>
              🎮 ゲーム30分（15pt）と交換する
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const SCREENS = [
  {
    role: "child" as const,
    label: "① 子がログインしてポイントを確認",
    sub: "自分のポイントがいつでも見られる",
    content: <Screen1 />,
  },
  {
    role: "child" as const,
    label: "② お皿洗いをしたので申請！",
    sub: "やったお手伝いをアプリから自分で申請",
    content: <Screen2 />,
  },
  {
    role: "parent" as const,
    label: "③ 親のアプリに申請が届く → 承認",
    sub: "はるかの「お皿洗い」を確認してボタンを押すだけ",
    content: <Screen3 />,
  },
  {
    role: "child" as const,
    label: "④ 承認されて +2pt 加算！",
    sub: "ポイントが増えた。認められた実感が積み重なる",
    content: <Screen4 />,
  },
  {
    role: "child" as const,
    label: "⑤ 貯めたポイントでご褒美と交換",
    sub: "ゴールが見えるからモチベーションが続く",
    content: <Screen5 />,
  },
];

const INTERVAL = 3500;

export default function AppScreenCarousel() {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startXRef = useRef(0);

  const next = useCallback(
    () => setCurrent((c) => (c + 1) % SCREENS.length),
    []
  );
  const prev = useCallback(
    () => setCurrent((c) => (c - 1 + SCREENS.length) % SCREENS.length),
    []
  );

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(next, INTERVAL);
  }, [next]);

  useEffect(() => {
    resetTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [resetTimer]);

  const handleTouchStart = (e: React.TouchEvent) => {
    startXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = startXRef.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) next();
      else prev();
      resetTimer();
    }
  };

  const handleDotClick = (i: number) => {
    setCurrent(i);
    resetTimer();
  };

  const role = SCREENS[current].role;

  return (
    <div className="lp-carousel">
      <div
        className={`lp-carousel__window lp-carousel__window--${role}`}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="lp-carousel__chrome">
          <span className="lp-hero__scene-dot" />
          <span className="lp-hero__scene-dot" />
          <span className="lp-hero__scene-dot" />
          <span className="lp-hero__scene-title">おてつだいポイント</span>
        </div>
        <div className="lp-carousel__body">
          <div
            className="lp-carousel__track"
            style={{ transform: `translateX(-${current * 100}%)` }}
          >
            {SCREENS.map((screen, i) => (
              <div key={i} className="lp-carousel__slide">
                {screen.content}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="lp-carousel__footer">
        <div className="lp-carousel__meta">
          <strong>{SCREENS[current].label}</strong>
          <span>{SCREENS[current].sub}</span>
        </div>
        <div className="lp-carousel__dots">
          {SCREENS.map((s, i) => (
            <button
              key={i}
              className={`lp-carousel__dot lp-carousel__dot--${s.role}${i === current ? " lp-carousel__dot--active" : ""}`}
              onClick={() => handleDotClick(i)}
              aria-label={`スライド ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
