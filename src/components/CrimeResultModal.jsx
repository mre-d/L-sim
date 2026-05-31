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

  const accentColor = isSuccess ? '#3FE0A0' : isWarning ? '#FFC857' : '#FF5E7E'
  const bubbleGrad = isSuccess
    ? 'linear-gradient(135deg, #2BF0CD 0%, #1FA8FF 100%)'
    : isWarning
      ? 'linear-gradient(135deg, #FFE08A 0%, #F5A623 100%)'
      : 'linear-gradient(135deg, #FF6E8C 0%, #C9275B 100%)'
  const glowColor = isSuccess ? 'rgba(33,230,193,0.25)' : isWarning ? 'rgba(255,200,87,0.20)' : 'rgba(255,94,126,0.25)'
  const headerText = isSuccess ? 'SUCCESS!' : isWarning ? 'WARNING!' : 'BUSTED!'
  const topEmoji = isSuccess ? crimeEmoji : isWarning ? '⚠️' : '🚨'
  const btnLabel = isSuccess ? 'Collect Loot' : isWarning ? 'Understood' : 'Accept Sentence'

  return (
    <div
      className="crime-modal-overlay"
      style={{ background: 'rgba(3,6,11,0.82)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      <div
        className="crime-modal"
        style={{
          background: 'linear-gradient(162deg, #12273C 0%, #0B1726 100%)',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: `inset 0 1px 0 rgba(255,255,255,0.10), 0 20px 60px rgba(0,0,0,0.7), 0 0 50px ${glowColor}`,
        }}
        onClick={e => e.stopPropagation()}
      >

        {/* Top icon bubble */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
          <div style={{
            width: 72, height: 72,
            borderRadius: '50%',
            background: bubbleGrad,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 36,
            boxShadow: `0 4px 20px ${glowColor}`,
            position: 'relative',
            overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', inset: '0 0 50% 0',
              background: 'linear-gradient(180deg, rgba(255,255,255,0.22) 0%, transparent 100%)',
              borderRadius: 'inherit',
            }} />
            {topEmoji}
          </div>
        </div>

        {/* Status */}
        <div style={{
          fontSize: 20, fontWeight: 900, color: accentColor,
          letterSpacing: 3, marginBottom: 4,
        }}>
          {headerText}
        </div>
        <div style={{ fontSize: 14, color: 'var(--sub)', marginBottom: 14 }}>
          {crimeEmoji} {crimeName}
        </div>

        {/* Flavor / message */}
        <div style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 12, padding: '10px 14px',
          fontSize: 13, color: 'var(--ink)', marginBottom: 16, textAlign: 'left',
        }}>
          {isSuccess && flavorText ? flavorText : rawMessage}
        </div>

        {/* Stats — 2-column grid for money + xp */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 16 }}>
          {money !== 0 && (
            <div style={{
              background: 'rgba(255,255,255,0.04)',
              border: `1px solid ${money > 0 ? 'rgba(63,224,160,0.25)' : 'rgba(255,94,126,0.25)'}`,
              borderRadius: 12, padding: '10px 12px', textAlign: 'center',
            }}>
              <div style={{ fontSize: 11, color: 'var(--sub)', marginBottom: 4 }}>
                {money > 0 ? '💰 Earned' : '💸 Fine'}
              </div>
              <div style={{ fontWeight: 800, fontSize: 17, color: money > 0 ? '#3FE0A0' : '#FF5E7E' }}>
                {money > 0 ? '+' : ''}€{Math.abs(money).toLocaleString()}
              </div>
            </div>
          )}
          {xpGain > 0 && (
            <div style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(197,139,242,0.25)',
              borderRadius: 12, padding: '10px 12px', textAlign: 'center',
            }}>
              <div style={{ fontSize: 11, color: 'var(--sub)', marginBottom: 4 }}>✨ XP gained</div>
              <div style={{ fontWeight: 800, fontSize: 17, color: '#C58BF2' }}>+{xpGain} XP</div>
            </div>
          )}
        </div>

        {/* Extra stats as rows */}
        <div style={{ marginBottom: 16 }}>
          {healthLoss > 0 && (
            <div className="crime-modal-stat">
              <span style={{ color: 'var(--sub)' }}>❤️ Health lost</span>
              <span style={{ fontWeight: 700, color: '#FF5E7E' }}>-{healthLoss}</span>
            </div>
          )}
          {isBusted && prisonWeeks > 0 && (
            <div className="crime-modal-stat">
              <span style={{ color: 'var(--sub)' }}>🔒 Sentence</span>
              <span style={{ fontWeight: 700, color: '#FF5E7E' }}>{prisonLabel(prisonWeeks)}</span>
            </div>
          )}
          {isWarning && (
            <div style={{
              background: 'rgba(255,200,87,0.10)', border: '1px solid rgba(255,200,87,0.30)',
              borderRadius: 10, padding: '8px 12px', fontSize: 12, color: '#FFC857',
              fontWeight: 600, textAlign: 'left',
            }}>
              ⚠️ First offence warning — you got lucky. Next time it's prison.
            </div>
          )}
        </div>

        <button
          className="btn-primary"
          style={{
            width: '100%',
            background: isSuccess
              ? 'linear-gradient(135deg, #2BF0CD 0%, #1FA8FF 100%)'
              : isWarning
                ? 'linear-gradient(135deg, #FFE08A 0%, #F5A623 100%)'
                : 'linear-gradient(135deg, #FF6E8C 0%, #C9275B 100%)',
            color: isSuccess ? '#042018' : isWarning ? '#1a0800' : '#fff',
            boxShadow: `0 4px 20px ${glowColor}`,
          }}
          onClick={onClose}
        >
          {btnLabel}
        </button>
      </div>
    </div>
  )
}
