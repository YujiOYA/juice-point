export const metadata = {
  title: "おてつだいポイント | スクリーンも、リアルも、どちらも楽しめる子に。",
  description:
    "SNSもゲームもあっていい。でもリアルにも居場所を。お手伝いの申請・承認を通じて、家族の中にも「認められる体験」を作る家族向けアプリ。",
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
            スクリーンも、
            <br />
            リアルも、
            <br />
            どちらも楽しめる子に。
          </h1>
          <p className="lp-hero__sub">
            SNSもゲームも、あっていい。
            <br />
            でも家族の中にも「認められる場所」を。
            <br />
            お手伝い申請・承認で、リアルを充実させる。
          </p>
          <a href="/" className="lp-btn lp-btn--primary lp-btn--lg">
            無料で始める →
          </a>
          <div className="lp-hero__trust">
            <span>✓ 登録不要</span>
            <span className="lp-hero__trust-sep" aria-hidden="true" />
            <span>✓ 完全無料</span>
            <span className="lp-hero__trust-sep" aria-hidden="true" />
            <span>✓ ブラウザで即使える</span>
          </div>
        </div>
        <div className="lp-hero__visual" aria-hidden="true">
          <div className="lp-hero__scene-card">
            <div className="lp-hero__scene-header">
              <span className="lp-hero__scene-dot" />
              <span className="lp-hero__scene-dot" />
              <span className="lp-hero__scene-dot" />
              <span className="lp-hero__scene-title">おてつだいポイント</span>
            </div>
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
        </div>
      </section>

      {/* 課題提起 */}
      <section className="lp-section lp-section--gray">
        <div className="lp-section__inner">
          <p className="lp-section__label">子育ての、リアルな悩み</p>
          <h2 className="lp-section__title">
            スクリーンは楽しい。
            <br />
            でもリアルが薄くなっていく。
          </h2>
          <ul className="lp-problems">
            <li className="lp-problem">
              <span className="lp-problem__icon">🎮</span>
              <div>
                <strong>SNS・ゲームは悪くない。でもバランスが難しい</strong>
                <p>友達とのコミュニケーションや創造の場として優れている一方、気づけば一日中スクリーンの前に。</p>
              </div>
            </li>
            <li className="lp-problem">
              <span className="lp-problem__icon">😶</span>
              <div>
                <strong>「やめなさい」だけでは解決しない</strong>
                <p>禁止するだけでは反発を生む。リアルに戻ってくる理由を子供自身が持てることが大切。</p>
              </div>
            </li>
            <li className="lp-problem">
              <span className="lp-problem__icon">🏠</span>
              <div>
                <strong>家族の中に「認められる体験」が少ない</strong>
                <p>スクリーンの外にも頑張りを見てもらえる場があれば、子供は自然にバランスをとれるようになる。</p>
              </div>
            </li>
          </ul>
        </div>
      </section>

      {/* 差別化 */}
      <section className="lp-section lp-section--dark">
        <div className="lp-section__inner">
          <p className="lp-section__label lp-section__label--light">既存の解決策との違い</p>
          <h2 className="lp-section__title lp-section__title--light">
            どちらかを諦めるアプリは、
            <br />
            たくさんある。
          </h2>
          <div className="lp-comparison">
            <div className="lp-comparison__col lp-comparison__col--other">
              <p className="lp-comparison__col-label">既存のアプローチ</p>
              <ul>
                <li>⛔ フィルタリングで見せない</li>
                <li>⛔ 時間制限でやめさせる</li>
                <li>⛔ スクリーンを悪者にする</li>
                <li>⛔ 子供は不満を抱えたまま</li>
              </ul>
            </div>
            <div className="lp-comparison__col lp-comparison__col--ours">
              <p className="lp-comparison__col-label">おてつだいポイント</p>
              <ul>
                <li>✅ スクリーンもリアルも否定しない</li>
                <li>✅ リアルに戻ってくる理由を作る</li>
                <li>✅ 頑張りを親が毎回「認める」</li>
                <li>✅ 子供が自分でバランスをとれるようになる</li>
              </ul>
            </div>
          </div>
          <p className="lp-comparison__note">
            スクリーンとリアルを両立する仕組みを作ったのは、ここだけです。
          </p>
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

      {/* なぜアプリなのか */}
      <section className="lp-section lp-section--gray">
        <div className="lp-section__inner">
          <p className="lp-section__label">よくある疑問</p>
          <h2 className="lp-section__title">
            紙や口約束じゃ、
            <br />
            ダメなんですか？
          </h2>
          <p className="lp-why__lead">
            ダメではありません。でも、<strong>続きません。</strong>
          </p>
          <div className="lp-why-grid">
            <div className="lp-why-card lp-why-card--analog">
              <p className="lp-why-card__label">紙・口約束</p>
              <ul>
                <li>😔 「やったよ」と親に言いに行かないと始まらない</li>
                <li>😔 ポイントが曖昧になり、親も子もいつの間にか忘れる</li>
                <li>😔 ゴールが見えず、モチベーションが続かない</li>
                <li>😔 「認められた」という感覚が残りにくい</li>
              </ul>
            </div>
            <div className="lp-why-card lp-why-card--app">
              <p className="lp-why-card__label">おてつだいポイント</p>
              <ul>
                <li>✅ 子供が自分のタイミングで申請できる</li>
                <li>✅ 承認が記録されて、いつでも見返せる</li>
                <li>✅ 報酬まであと何ポイントかが常に見える</li>
                <li>✅ 「ちゃんと認められた」が積み重なっていく</li>
              </ul>
            </div>
          </div>
          <p className="lp-why__note">
            SNSの「いいね」が効果的なのは、<strong>即座に・記録されて・見返せる</strong>からです。
            <br />
            同じ仕組みを、家族のリアルな行動に持ち込んだのがこのアプリです。
          </p>
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
            スクリーンの外にも、
            <br />
            子供の居場所をつくろう。
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
