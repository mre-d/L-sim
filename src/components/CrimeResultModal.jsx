function prisonLabel(weeks) {
  if (weeks <= 0) return null
  if (weeks < 52) return `${weeks} week${weeks !== 1 ? 's' : ''} prison`
  const years = Math.round(weeks / 52)
  return `${years} year${years !== 1 ? 's' : ''} prison`
}

export default function CrimeResultModal({ result, onClose }) {
  const {
    success, isWarning, crimeEmoji, crimeName,
    money, xpGain, prisonWeeks, healthLoss, flavorText, rawMessage,
  } = result

  const isSuccess = success
  const isBusted = !success && !isWarning
  const headerColor = isSuccess ? '#4CAF50' : isWarning ? '#FF9800' : '#F44336'
  const headerText = isSuccess ? 'SUCCESS!' : isWarning ? 'WARNING!' : 'BUSTED!'
  const topEmoji = isSuccess ? crimeEmoji : isWarning ? '⚠️' : '🚨'

  return (
    <div className="crime-modal-overlay" onClick={onClose}>
      <div className="crime-modal" onClick={e => e.stopPropagation()}>

        {/* Top emoji */}
        <div style={{ fontSize: 56, lineHeight: 1, marginBottom: 8 }}>{topEmoji}</div>

        {/* Status */}
        <div style={{ fontSize: 22, fontWeight: 900, color: headerColor, marginBottom: 2 }}>
          {headerText}
        </div>
        <div style={{ fontSize: 15, color: 'var(--text-muted)', marginBottom: 14 }}>
          {crimeEmoji} {crimeName}
        </div>

        {/* Flavor / message */}
        <div style={{
          background: 'var(--surface2)', borderRadius: 10, padding: '10px 14px',
          fontSize: 13, color: 'var(--text)', marginBottom: 14, textAlign: 'left',
        }}>
          {isSuccess && flavorText ? flavorText : rawMessage}
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 18 }}>
          {money !== 0 && (
            <div className="crime-modal-stat">
              <span style={{ color: 'var(--text-muted)' }}>
                {money > 0 ? '💰 Earned' : '💸 Fine'}
              </span>
              <span style={{
                fontWeight: 800, fontSize: 18,
                color: money > 0 ? '#4CAF50' : '#F44336',
              }}>
                {money > 0 ? '+' : ''}€{Math.abs(money).toLocaleString()}
              </span>
            </div>
          )}
          {xpGain > 0 && (
            <div className="crime-modal-stat">
              <span style={{ color: 'var(--text-muted)' }}>✨ XP gained</span>
              <span style={{ fontWeight: 700, color: '#9C27B0' }}>+{xpGain} XP</span>
            </div>
          )}
          {healthLoss > 0 && (
            <div className="crime-modal-stat">
              <span style={{ color: 'var(--text-muted)' }}>❤️ Health lost</span>
              <span style={{ fontWeight: 700, color: '#F44336' }}>-{healthLoss}</span>
            </div>
          )}
          {isBusted && prisonWeeks > 0 && (
            <div className="crime-modal-stat">
              <span style={{ color: 'var(--text-muted)' }}>🔒 Sentence</span>
              <span style={{ fontWeight: 700, color: '#F44336' }}>{prisonLabel(prisonWeeks)}</span>
            </div>
          )}
          {isWarning && (
            <div style={{
              background: 'rgba(255,152,0,0.15)', border: '1px solid #FF9800',
              borderRadius: 8, padding: '8px 12px', fontSize: 12, color: '#FF9800',
              fontWeight: 600, textAlign: 'left',
            }}>
              ⚠️ First offence warning — you got lucky. Next time it's prison.
            </div>
          )}
        </div>

        <button
          className="btn-primary"
          style={{ width: '100%' }}
          onClick={onClose}
        >
          Continue
        </button>
      </div>
    </div>
  )
}
