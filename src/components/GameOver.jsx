import StatBar from './StatBar'

const COUNTRY_FLAGS = {
  Netherlands: '🇳🇱', Belgium: '🇧🇪', Germany: '🇩🇪',
  'United States': '🇺🇸', 'United Kingdom': '🇬🇧', Japan: '🇯🇵', Brazil: '🇧🇷',
}

export default function GameOver({ character, onRestart }) {
  const { name, age, country, stats, money, job, deathCause } = character
  const flag = COUNTRY_FLAGS[country] || '🌍'
  const isLongLife = age >= 75
  const emoji = isLongLife ? '🎉' : '💀'

  return (
    <div className="gameover-screen screen">
      <div className="gameover-emoji">{emoji}</div>
      <h1 className="gameover-title">{name} has passed away</h1>
      <p className="gameover-subtitle">
        {flag} {age} years old • {country}<br />
        <span className="text-muted">Cause: {deathCause}</span>
      </p>

      <div style={{ width: '100%', maxWidth: 400, marginBottom: 24 }}>
        <div className="card">
          <div className="card-title">Final Stats</div>
          <StatBar emoji="❤️" label="Health" value={stats.health} />
          <StatBar emoji="😊" label="Happiness" value={stats.happiness} />
          <StatBar emoji="🧠" label="Smarts" value={stats.smarts} />
          <StatBar emoji="✨" label="Looks" value={stats.looks} />
        </div>

        <div className="card">
          <div className="info-row">
            <span className="info-label">💰 Final net worth</span>
            <span className={money >= 0 ? 'text-success fw-bold' : 'text-danger fw-bold'}>
              €{money.toLocaleString()}
            </span>
          </div>
          <div className="info-row">
            <span className="info-label">💼 Last job</span>
            <span>{job}</span>
          </div>
          <div className="info-row">
            <span className="info-label">📅 Years lived</span>
            <span className="fw-bold">{age}</span>
          </div>
        </div>

        <div className="card text-center">
          <p style={{ fontSize: 15, marginBottom: 4 }}>
            {isLongLife
              ? '🌟 A long and fulfilled life well lived!'
              : age >= 50
                ? '🌿 A decent life with some regrets...'
                : '⚡ A short but eventful life.'}
          </p>
        </div>
      </div>

      <button className="btn-primary" style={{ maxWidth: 400, width: '100%' }} onClick={onRestart}>
        🔄 Play Again
      </button>
    </div>
  )
}
