import StatBar from './StatBar'
import EventLog from './EventLog'
import ActivityMenu from './ActivityMenu'

const COUNTRY_FLAGS = {
  Netherlands: '🇳🇱', Belgium: '🇧🇪', Germany: '🇩🇪',
  'United States': '🇺🇸', 'United Kingdom': '🇬🇧', Japan: '🇯🇵', Brazil: '🇧🇷',
}

const JOB_BY_AGE = [
  { minAge: 22, job: 'Professional' },
  { minAge: 18, job: 'Junior Employee' },
  { minAge: 16, job: 'Part-time Worker' },
]

export default function Dashboard({ character, onAgeUp, onActivity }) {
  const { name, age, country, stats, money, job, eventLog, activitiesThisTurn, maxActivities } = character
  const flag = COUNTRY_FLAGS[country] || '🌍'
  const activitiesLeft = maxActivities - activitiesThisTurn
  const moneyColor = money >= 0 ? 'var(--success)' : 'var(--danger)'

  return (
    <div className="screen">
      <div className="top-bar">
        <div>
          <div className="top-bar-name">{flag} {name}</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{country} • {job}</div>
        </div>
        <div className="age-badge">Age {age}</div>
      </div>

      <div className="scroll-area">
        <div className="section">
          <div className="card">
            <div className="card-title">Stats</div>
            <StatBar emoji="❤️" label="Health" value={stats.health} />
            <StatBar emoji="😊" label="Happiness" value={stats.happiness} />
            <StatBar emoji="🧠" label="Smarts" value={stats.smarts} />
            <StatBar emoji="✨" label="Looks" value={stats.looks} />
          </div>

          <div className="card">
            <div className="info-row">
              <span className="info-label">💰 Net Worth</span>
              <span className="fw-bold" style={{ color: moneyColor, fontSize: 18 }}>
                €{money.toLocaleString()}
              </span>
            </div>
            <div className="info-row">
              <span className="info-label">💼 Career</span>
              <span>{job}</span>
            </div>
          </div>

          <button className="btn-primary btn-age-up mb-12" onClick={onAgeUp}>
            Age Up ➡️ (Year {age + 1})
          </button>

          <ActivityMenu
            onActivity={onActivity}
            activitiesLeft={activitiesLeft}
            character={character}
          />

          <EventLog events={eventLog} />
        </div>
      </div>
    </div>
  )
}
