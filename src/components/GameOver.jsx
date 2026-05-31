import { getCareerById } from '../game/careers'
import { CRIME_LEVEL_NAMES } from '../game/crime'

const COUNTRY_FLAGS = {
  Netherlands: '🇳🇱', Belgium: '🇧🇪', Germany: '🇩🇪',
  'United States': '🇺🇸', 'United Kingdom': '🇬🇧', Japan: '🇯🇵', Brazil: '🇧🇷',
}

function StatRingInline({ value, emoji, label, size = 64 }) {
  const stroke = 6, r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const color = value > 70 ? '#3FE0A0' : value > 40 ? '#FFC857' : '#FF5E7E'
  const off = c * (1 - value / 100)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.10)" strokeWidth={stroke} />
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeDasharray={c} strokeDashoffset={off} />
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>{emoji}</div>
      </div>
      <span style={{ fontSize: 13, fontWeight: 800, color }}>{Math.round(value)}</span>
      <span style={{ fontSize: 9, fontWeight: 700, color: 'var(--faint)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{label}</span>
    </div>
  )
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
        {flag} {age} years old · {country}<br />
        <span style={{ color: 'var(--faint)' }}>Cause: {deathCause}</span>
      </p>

      <div style={{ width: '100%', maxWidth: 400, marginBottom: 24 }}>

        {/* Final stats as rings */}
        <div className="card" style={{ marginBottom: 12 }}>
          <div className="card-title">Final Stats</div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <StatRingInline value={stats.health}    emoji="❤️" label="Health"    />
            <StatRingInline value={stats.happiness} emoji="😊" label="Happy"     />
            <StatRingInline value={stats.smarts}    emoji="🧠" label="Smarts"    />
            <StatRingInline value={stats.looks}     emoji="✨" label="Looks"     />
          </div>
        </div>

        {/* Life summary */}
        <div className="card">
          <div className="info-row">
            <span className="info-label">💰 Net worth</span>
            <span style={{ fontWeight: 800, color: money >= 0 ? 'var(--good)' : 'var(--bad)' }}>
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

        {/* Criminal record */}
        {wasCriminal && (
          <div className="card" style={{
            background: 'linear-gradient(162deg, rgba(255,94,126,0.10) 0%, #0B1726 100%)',
            border: '1px solid rgba(255,94,126,0.28)',
          }}>
            <div className="card-title" style={{ color: 'var(--bad)' }}>Criminal Record</div>
            <div className="info-row">
              <span className="info-label">🏴‍☠️ Highest rank</span>
              <span className="gang-badge">{crimRank.title}</span>
            </div>
            <div className="info-row">
              <span className="info-label">📋 Convictions</span>
              <span style={{ color: 'var(--bad)', fontWeight: 700 }}>{criminalRecord}x</span>
            </div>
            <div className="info-row">
              <span className="info-label">💸 Crime earnings</span>
              <span style={{ color: 'var(--warn)', fontWeight: 700 }}>€{totalCrimeEarnings.toLocaleString()}</span>
            </div>
          </div>
        )}

        {/* Epitaph */}
        <div className="card text-center">
          <p style={{ fontSize: 15, color: 'var(--sub)' }}>
            {isLongLife
              ? '🌟 A long and fulfilled life well lived!'
              : age >= 50
                ? '🌿 A decent life with some regrets...'
                : '⚡ A short but eventful life.'}
          </p>
        </div>
      </div>

      <button
        className="btn-primary btn-age-up"
        style={{ maxWidth: 400, width: '100%' }}
        onClick={onRestart}
      >
        New Life ✨
      </button>
    </div>
  )
}
