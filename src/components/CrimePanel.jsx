import {
  CRIMES, CRIME_LEVEL_NAMES, getAvailableCrimes, getLockedCrimes,
  getSuccessRate, getHeatLabel, xpToNextLevel,
} from '../game/crime'

export default function CrimePanel({ character, onCrimeActivity }) {
  const { heatLevel, crimeLevel = 1, crimeXP = 0, criminalRecord, inPrison, prisonYearsLeft } = character
  const heatInfo = getHeatLabel(heatLevel)
  const rankName = CRIME_LEVEL_NAMES[Math.min(crimeLevel, 20)] || 'Petty Thief'
  const available = getAvailableCrimes(crimeLevel, character.age)
  const locked = getLockedCrimes(crimeLevel, character.age)
  const xpNeeded = xpToNextLevel(crimeLevel)
  const xpPercent = Math.min(100, Math.round((crimeXP / xpNeeded) * 100))
  const isMaxLevel = crimeLevel >= 20

  return (
    <div className="card card-crime">
      {/* Level header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div>
          <div className="card-title" style={{ marginBottom: 2 }}>Underworld</div>
          <div style={{ fontSize: 18, fontWeight: 800 }}>{rankName}</div>
        </div>
        <div className="crime-level-badge">LVL {crimeLevel}</div>
      </div>

      {/* XP bar */}
      {!isMaxLevel && (
        <div style={{ marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>
            <span>XP to level {crimeLevel + 1}</span>
            <span>{crimeXP} / {xpNeeded}</span>
          </div>
          <div className="stat-bar-track">
            <div className="stat-bar-fill" style={{ width: `${xpPercent}%`, backgroundColor: '#9C27B0' }} />
          </div>
        </div>
      )}
      {isMaxLevel && (
        <div style={{ fontSize: 13, color: '#9C27B0', fontWeight: 700, marginBottom: 12 }}>
          👑 Maximum level reached!
        </div>
      )}

      {/* Heat */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
          <span style={{ color: 'var(--text-muted)', fontWeight: 700 }}>{heatInfo.emoji} Police Heat — {heatInfo.label}</span>
          <span style={{ fontWeight: 700 }}>{Math.round(heatLevel)}</span>
        </div>
        <div className="stat-bar-track">
          <div className="stat-bar-fill" style={{ width: `${heatLevel}%`, background: `linear-gradient(90deg, #FF9800, ${heatInfo.color})` }} />
        </div>
        {heatLevel >= 50 && (
          <p style={{ fontSize: 11, color: 'var(--danger)', marginTop: 3 }}>⚠️ High heat — arrest risk each year!</p>
        )}
      </div>

      {/* Stats row */}
      <div className="info-row" style={{ marginBottom: 12 }}>
        <span className="info-label">📋 Convictions</span>
        <span style={{ color: criminalRecord > 0 ? 'var(--danger)' : 'var(--text-muted)', fontWeight: 700 }}>
          {criminalRecord}×
        </span>
      </div>

      {/* Prison */}
      {inPrison && (
        <div className="prison-banner" style={{ marginBottom: 12 }}>
          🔒 In prison — {prisonYearsLeft} year{prisonYearsLeft !== 1 ? 's' : ''} left. Skip weeks to serve time.
        </div>
      )}

      {!inPrison && (
        <>
          {/* Available crimes */}
          <div className="card-title" style={{ marginBottom: 8 }}>Available Crimes</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
            {available.map(crime => {
              const successRate = getSuccessRate(crime, crimeLevel)
              const successColor = successRate >= 70 ? '#4CAF50' : successRate >= 45 ? '#FF9800' : '#F44336'
              return (
                <button
                  key={crime.id}
                  className="crime-btn"
                  onClick={() => onCrimeActivity(crime.id)}
                >
                  <span className="crime-emoji">{crime.emoji}</span>
                  <span className="crime-info">
                    <span className="crime-name">{crime.name}</span>
                    <span className="crime-desc">{crime.description}</span>
                  </span>
                  <span className="crime-stats">
                    <span style={{ color: successColor, fontWeight: 800, fontSize: 14 }}>{successRate}%</span>
                    <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>success</span>
                  </span>
                </button>
              )
            })}
          </div>

          {/* Locked crimes preview */}
          {locked.length > 0 && (
            <>
              <div className="card-title" style={{ marginBottom: 8 }}>🔒 Coming Soon</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {locked.map(crime => (
                  <div key={crime.id} className="crime-btn" style={{ opacity: 0.4, cursor: 'default' }}>
                    <span className="crime-emoji">{crime.emoji}</span>
                    <span className="crime-info">
                      <span className="crime-name">{crime.name}</span>
                      <span className="crime-desc">Unlocks at level {crime.unlockLevel}</span>
                    </span>
                    <span className="crime-stats">
                      <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>LVL {crime.unlockLevel}</span>
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  )
}
