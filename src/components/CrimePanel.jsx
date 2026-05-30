import { getAvailableCrimes, getHeatInfo, getCriminalRank, CRIME_ACTIVITIES } from '../game/crime'

export default function CrimePanel({ character, onCrimeActivity }) {
  const { heatLevel, crimeXP, criminalRecord, inPrison, prisonYearsLeft, activitiesThisTurn, maxActivities } = character
  const heatInfo = getHeatInfo(heatLevel)
  const rank = getCriminalRank(crimeXP)
  const available = getAvailableCrimes(character)
  const activitiesLeft = maxActivities - activitiesThisTurn
  const disabled = activitiesLeft <= 0

  return (
    <div className="card card-crime">
      <div className="card-title">🔪 Underworld</div>

      {inPrison && (
        <div className="prison-banner">
          🔒 You are in prison — {prisonYearsLeft} year{prisonYearsLeft !== 1 ? 's' : ''} remaining
        </div>
      )}

      <div className="info-row">
        <span className="info-label">🏴‍☠️ Criminal Rank</span>
        <span className="gang-badge">{rank.title}</span>
      </div>
      <div className="info-row">
        <span className="info-label">📋 Convictions</span>
        <span style={{ color: criminalRecord > 0 ? 'var(--danger)' : 'var(--text-muted)' }}>
          {criminalRecord}x
        </span>
      </div>

      <div style={{ margin: '12px 0' }}>
        <div className="stat-bar-header" style={{ marginBottom: 5 }}>
          <span className="stat-bar-label">{heatInfo.emoji} Police Heat — {heatInfo.label}</span>
          <span className="stat-bar-value">{Math.round(heatLevel)}</span>
        </div>
        <div className="stat-bar-track">
          <div
            className="stat-bar-fill"
            style={{
              width: `${heatLevel}%`,
              background: `linear-gradient(90deg, #FF9800, ${heatInfo.color})`,
            }}
          />
        </div>
        {heatLevel >= 50 && (
          <p style={{ fontSize: 11, color: 'var(--danger)', marginTop: 4 }}>
            ⚠️ High heat — chance of arrest each year!
          </p>
        )}
      </div>

      {!inPrison && (
        <>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>
            Crime XP: {crimeXP} • Unlock more crimes by gaining experience
          </div>
          <div className="activity-grid">
            {CRIME_ACTIVITIES.map(crime => {
              const isAvail = available.find(c => c.id === crime.id)
              const locked = !isAvail
              return (
                <button
                  key={crime.id}
                  className="btn-activity"
                  style={locked ? { opacity: 0.3 } : {}}
                  disabled={disabled || locked}
                  onClick={() => onCrimeActivity(crime.id)}
                  title={locked
                    ? `Requires: age ${crime.minAge}+, ${crime.minCrimeXP} crime XP`
                    : crime.description}
                >
                  <span className="act-emoji">{crime.emoji}</span>
                  <span className="act-label">{crime.name}</span>
                </button>
              )
            })}
          </div>
          {disabled && (
            <p style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'center', marginTop: 8 }}>
              No actions left — Age Up to continue
            </p>
          )}
        </>
      )}

      {inPrison && (
        <p style={{ fontSize: 13, color: 'var(--text-muted)', textAlign: 'center', marginTop: 8 }}>
          Stay low and serve your time. You'll be out soon.
        </p>
      )}
    </div>
  )
}
