export const metadata = {
  title: "おてつだいポイント | お手伝い、自分からやりたがる子に。",
  description:
    "子供が自分でお手伝いを申請してポイントを貯め、ご褒美と交換できる家族向けアプリ。親の承認制で安心、子供のリクエスト機能で自主性も育てます。",
};

export default function LpPage() {
  return (
    <div className="lp">
      {/* ナビゲーション */}
      <header className="lp-header">
        <div className="lp-header__inner">
          <span className="lp-header__logo">🏠 おてつだいポイント</span>
          <a href="/" className="lp-header__cta">
            無料で始める
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="lp-hero">
        <div className="lp-hero__inner">
          <p className="lp-hero__eyebrow">家族向けお手伝い管理アプリ</p>
          <h1 className="lp-hero__title">
            お手伝い、
            <br />
            自分からやりたがる
            <br />
            子に。
          </h1>
          <p className="lp-hero__sub">
            やりたいお手伝いを子供が自分で申請。
            <br />
            親が確認・承認してポイント付与。
            <br />
            貯まったらご褒美と交換。
          </p>
          <a href="/" className="lp-btn lp-btn--primary lp-btn--lg">
            無料で始める →
          </a>
          <p className="lp-hero__note">登録不要・ずっと無料</p>
        </div>
        <div className="lp-hero__visual" aria-hidden="true">
          <div className="lp-hero__scene">
            <div className="lp-scene-bubble lp-scene-bubble--child">
              🧒 「お皿洗いしたよ！申請する」
            </div>
            <div className="lp-scene-arrow">↓</div>
            <div className="lp-scene-bubble lp-scene-bubble--parent">
              👩 「確認！承認します ✅」
            </div>
            <div className="lp-scene-arrow">↓</div>
            <div className="lp-scene-reward">
              🧃 ポイントで念願のジュース！
            </div>
          </div>
        </div>
      </section>

      {/* 課題提起 */}
      <section className="lp-section lp-section--gray">
        <div className="lp-section__inner">
          <p className="lp-section__label">こんな悩み、ありませんか？</p>
          <h2 className="lp-section__title">
            お手伝いって、続かないですよね。
          </h2>
          <ul className="lp-problems">
            <li className="lp-problem">
              <span className="lp-problem__icon">😮‍💨</span>
              <div>
                <strong>「お手伝いして」と言っても動かない</strong>
                <p>やる気が続かず、毎回声がけが必要になる。</p>
              </div>
            </li>
            <li className="lp-problem">
              <span className="lp-problem__icon">📝</span>
              <div>
                <strong>紙や口約束で管理が続かない</strong>
                <p>シールを貼ったり、ノートに書いたりしても気づけば흐지부지。</p>
              </div>
            </li>
            <li className="lp-problem">
              <span className="lp-problem__icon">🤔</span>
              <div>
                <strong>何をどれだけやればいいかわからない</strong>
                <p>ゴールが見えないと、子供のモチベーションも上がらない。</p>
              </div>
            </li>
          </ul>
        </div>
      </section>

      {/* 解決策 */}
      <section className="lp-section">
        <div className="lp-section__inner">
          <p className="lp-section__label">おてつだいポイントなら</p>
          <h2 className="lp-section__title">
            子供が主役になる
            <br />
            仕組みがある。
          </h2>
          <div className="lp-features">
            <div className="lp-feature">
              <div className="lp-feature__icon">📋</div>
              <h3 className="lp-feature__title">タスク申請制</h3>
              <p className="lp-feature__desc">
                子供が「やった！」と思ったら自分で申請。やらされるのではなく、
                <strong>自分から動く</strong>習慣が身につく。
              </p>
            </div>
            <div className="lp-feature">
              <div className="lp-feature__icon">✅</div>
              <h3 className="lp-feature__title">親の承認制</h3>
              <p className="lp-feature__desc">
                申請はすべて親が確認してから承認。
                <strong>ポイントの信頼性を守りつつ</strong>
                、親子のコミュニケーションも生まれる。
              </p>
            </div>
            <div className="lp-feature">
              <div className="lp-feature__icon">💡</div>
              <h3 className="lp-feature__title">タスクリクエスト</h3>
              <p className="lp-feature__desc">
                「これもお手伝いに入れてほしい！」と子供が提案できる。
                <strong>自分で良いことを見つける</strong>
                クリエイティブな力を育てる。
              </p>
            </div>
            <div className="lp-feature">
              <div className="lp-feature__icon">🎁</div>
              <h3 className="lp-feature__title">ご褒美と交換</h3>
              <p className="lp-feature__desc">
                貯まったポイントは家族が設定したご褒美と交換。
                <strong>ゴールが見えるから</strong>モチベーションが続く。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 使い方ステップ */}
      <section className="lp-section lp-section--orange">
        <div className="lp-section__inner">
          <p className="lp-section__label lp-section__label--light">使い方</p>
          <h2 className="lp-section__title lp-section__title--light">
            3ステップで今日から始められる
          </h2>
          <ol className="lp-steps">
            <li className="lp-step">
              <div className="lp-step__num">1</div>
              <div>
                <strong>家族とタスク・ご褒美を設定する</strong>
                <p>どんなお手伝いが何ポイントか、何と交換できるかを家族で決める。</p>
              </div>
            </li>
            <li className="lp-step">
              <div className="lp-step__num">2</div>
              <div>
                <strong>子供がお手伝いして申請する</strong>
                <p>お手伝いをしたら、アプリから申請。リストにないお手伝いも自由記述で申請できる。</p>
              </div>
            </li>
            <li className="lp-step">
              <div className="lp-step__num">3</div>
              <div>
                <strong>親が承認してポイントを付与する</strong>
                <p>内容を確認して承認するとポイントが加算。貯まったらご褒美と交換！</p>
              </div>
            </li>
          </ol>
        </div>
      </section>

      {/* 料金 */}
      <section className="lp-section">
        <div className="lp-section__inner">
          <p className="lp-section__label">料金</p>
          <h2 className="lp-section__title">ずっと無料</h2>
          <div className="lp-pricing">
            <div className="lp-pricing__badge">FREE</div>
            <ul className="lp-pricing__list">
              <li>✅ ユーザー数 無制限</li>
              <li>✅ タスク・報酬 無制限</li>
              <li>✅ 申請・承認 無制限</li>
              <li>✅ タスクリクエスト機能</li>
              <li>✅ 管理者・一般ユーザー 権限管理</li>
            </ul>
            <a href="/" className="lp-btn lp-btn--primary lp-btn--lg">
              今すぐ始める →
            </a>
          </div>
        </div>
      </section>

      {/* 最後のCTA */}
      <section className="lp-cta">
        <div className="lp-section__inner">
          <h2 className="lp-cta__title">
            小さなモチベーションを、
            <br />
            良い習慣に変えよう。
          </h2>
          <p className="lp-cta__sub">
            登録不要。ブラウザからすぐ使えます。
          </p>
          <a href="/" className="lp-btn lp-btn--white lp-btn--lg">
            無料で始める →
          </a>
        </div>
      </section>

      {/* フッター */}
      <footer className="lp-footer">
        <p>© 2025 おてつだいポイント</p>
      </footer>
    </div>
  );
}
