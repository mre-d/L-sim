import StatBar from './StatBar'
import { getCareerById } from '../game/careers'
import { CRIME_LEVEL_NAMES } from '../game/crime'

const COUNTRY_FLAGS = {
  Netherlands: '🇳🇱', Belgium: '🇧🇪', Germany: '🇩🇪',
  'United States': '🇺🇸', 'United Kingdom': '🇬🇧', Japan: '🇯🇵', Brazil: '🇧🇷',
}

export default function GameOver({ character, onRestart }) {
  const { name, age, country, stats, money, deathCause, careerPathId, careerLevel,
          criminalRecord, totalCrimeEarnings, crimeXP, annualSalary } = character
  const flag = COUNTRY_FLAGS[country] || '🌍'
  const isLongLife = age >= 75
  const emoji = isLongLife ? '🎉' : '💀'

  const careerPath = getCareerById(careerPathId)
  const finalTitle = careerPath ? careerPath.levels[careerLevel]?.title : 'Unemployed'
  const crimRank = CRIME_LEVEL_NAMES[Math.min(character.crimeLevel || 1, 20)]
  const wasCriminal = crimeXP > 0

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
            <span className="info-label">💰 Net worth</span>
            <span className={money >= 0 ? 'text-success fw-bold' : 'text-danger fw-bold'}>
              €{money.toLocaleString()}
            </span>
          </div>
          <div className="info-row">
            <span className="info-label">💼 Final job</span>
            <span>{finalTitle}</span>
          </div>
          <div className="info-row">
            <span className="info-label">📅 Years lived</span>
            <span className="fw-bold">{age}</span>
          </div>
        </div>

        {wasCriminal && (
          <div className="card card-crime">
            <div className="card-title">Criminal Record</div>
            <div className="info-row">
              <span className="info-label">🏴‍☠️ Highest rank</span>
              <span className="gang-badge">{crimRank.title}</span>
            </div>
            <div className="info-row">
              <span className="info-label">📋 Convictions</span>
              <span style={{ color: 'var(--danger)' }}>{criminalRecord}x</span>
            </div>
            <div className="info-row">
              <span className="info-label">💸 Crime earnings</span>
              <span className="text-warning fw-bold">€{totalCrimeEarnings.toLocaleString()}</span>
            </div>
          </div>
        )}

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
