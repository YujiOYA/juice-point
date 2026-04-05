"use client";

import { useState, useEffect, useCallback, useRef } from "react";

function Screen1() {
  return (
    <div className="lp-app-mock">
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

function Screen2() {
  return (
    <div className="lp-app-mock">
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
          <button className="submit-button lp-mock-btn-top" disabled>
            ✅ 申請する
          </button>
        </div>
      </div>
    </div>
  );
}

function Screen3() {
  return (
    <div className="lp-app-mock">
      <h1 className="page-title">⭐ ポイント管理アプリ ⭐</h1>
      <div className="card">
        <p className="manager-title">📋 申請一覧</p>
        <div className="submission-card">
          <p className="submission-card__task">🍽️ お皿洗い</p>
          <div className="submission-card__meta">
            <span>はるか</span>
            <span>2pt</span>
            <span>未承認</span>
          </div>
          <div className="submission-card__actions">
            <button className="approve-button" disabled>✅ 承認</button>
            <button className="disapprove-button" disabled>❌ 却下</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Screen4() {
  return (
    <div className="lp-app-mock">
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
            💰 現在のポイント: <strong>12pt</strong>
          </p>
          <div className="lp-mock-reward-list">
            <button className="approve-button" disabled>
              🧃 ジュース（5pt）と交換する
            </button>
            <button className="approve-button" disabled>
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
    label: "① 子供がポイントを確認",
    sub: "ログイン後、貯まったポイントをすぐ確認できる",
    content: <Screen1 />,
  },
  {
    label: "② タスクを選んで申請",
    sub: "お手伝いしたら自分でタップして申請",
    content: <Screen2 />,
  },
  {
    label: "③ 親が確認して承認",
    sub: "確認してボタンを押すだけ。ポイントが即加算",
    content: <Screen3 />,
  },
  {
    label: "④ ご褒美と交換",
    sub: "貯まったポイントで好きなご褒美と交換できる",
    content: <Screen4 />,
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

  return (
    <div className="lp-carousel">
      <div
        className="lp-carousel__window"
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
          {SCREENS.map((_, i) => (
            <button
              key={i}
              className={`lp-carousel__dot${i === current ? " lp-carousel__dot--active" : ""}`}
              onClick={() => handleDotClick(i)}
              aria-label={`スライド ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
