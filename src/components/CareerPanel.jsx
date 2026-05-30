import { CAREER_PATHS, canJoinCareer, canPromote, getCareerById } from '../game/careers'
import StatBar from './StatBar'

export default function CareerPanel({ character, onCareerAction }) {
  const { careerPathId, careerLevel, yearsAtJob, jobPerformance, education, stats, age, criminalRecord } = character
  const currentPath = getCareerById(careerPathId)
  const currentLevelData = currentPath?.levels[careerLevel]
  const nextLevelData = currentPath?.levels[careerLevel + 1]

  if (character.inPrison) {
    return (
      <div className="card card-crime">
        <div className="card-title">Career</div>
        <div className="prison-banner">🔒 You are in prison — no career income</div>
      </div>
    )
  }

  if (!currentPath) {
    return <UnemployedPanel character={character} onCareerAction={onCareerAction} />
  }

  const promotionCheck = canPromote(currentPath, careerLevel, character)
  const isMaxLevel = careerLevel >= currentPath.levels.length - 1
  const salary = currentLevelData?.salary || 0

  return (
    <div className="card">
      <div className="card-title">Career — {currentPath.emoji} {currentPath.name}</div>

      <div className="career-tier">{currentLevelData?.title}</div>
      <div className="info-row">
        <span className="info-label">💰 Annual Salary</span>
        <span className="text-success fw-bold">€{salary.toLocaleString()}</span>
      </div>
      <div className="info-row">
        <span className="info-label">📅 Years in role</span>
        <span>{yearsAtJob}</span>
      </div>

      <div style={{ marginTop: 10, marginBottom: 10 }}>
        <StatBar emoji="📈" label="Performance" value={jobPerformance} />
      </div>

      {!isMaxLevel && (
        <div style={{ marginBottom: 10 }}>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>
            Next: {nextLevelData?.title} — €{nextLevelData?.salary.toLocaleString()}/yr
          </div>
          <button
            className="btn-primary"
            style={{ minHeight: 44, fontSize: 14 }}
            onClick={() => onCareerAction('promote')}
            disabled={!promotionCheck.ok}
          >
            {promotionCheck.ok ? '🚀 Request Promotion' : `🔒 ${promotionCheck.reason}`}
          </button>
        </div>
      )}

      {isMaxLevel && (
        <div style={{ fontSize: 13, color: 'var(--success)', fontWeight: 700, marginBottom: 10 }}>
          👑 You've reached the top of this career!
        </div>
      )}

      <button
        className="btn-secondary"
        style={{ width: '100%', minHeight: 40, fontSize: 13 }}
        onClick={() => onCareerAction('quit')}
      >
        🚪 Quit Job
      </button>
    </div>
  )
}

function UnemployedPanel({ character, onCareerAction }) {
  const available = CAREER_PATHS.filter(p => {
    const check = canJoinCareer(p, character)
    return true
  })

  return (
    <div className="card">
      <div className="card-title">Career — Find a Job</div>
      <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 12 }}>
        Choose a career path to start earning a salary each year.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {CAREER_PATHS.map(path => {
          const check = canJoinCareer(path, character)
          return (
            <button
              key={path.id}
              className="btn-activity"
              style={{ flexDirection: 'row', justifyContent: 'space-between', minHeight: 52, padding: '8px 14px' }}
              disabled={!check.ok}
              onClick={() => onCareerAction('apply', { pathId: path.id })}
            >
              <span style={{ fontSize: 15 }}>
                {path.emoji} <span style={{ fontWeight: 700 }}>{path.name}</span>
              </span>
              <span style={{ fontSize: 12, color: check.ok ? 'var(--success)' : 'var(--danger)' }}>
                {check.ok
                  ? `€${path.levels[0].salary.toLocaleString()}/yr`
                  : check.reason}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
