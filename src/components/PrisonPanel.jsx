function formatWeeks(weeks) {
  if (weeks <= 0) return '0 weeks'
  if (weeks < 52) return `${weeks} week${weeks !== 1 ? 's' : ''}`
  const years = Math.floor(weeks / 52)
  const rem = weeks % 52
  if (rem === 0) return `${years} year${years !== 1 ? 's' : ''}`
  return `${years}y ${rem}w`
}

const CHORES = [
  { id: 'chores',   emoji: '🧹', name: 'Do Chores',          desc: 'Keep your cell clean',        reward: '+3 happiness' },
  { id: 'kitchen',  emoji: '🍳', name: 'Kitchen Work',        desc: 'Cook for the block',           reward: '+€50' },
  { id: 'exercise', emoji: '🏋️', name: 'Exercise',            desc: 'Stay in shape',                reward: '+4 health' },
  { id: 'study',    emoji: '📚', name: 'Study',               desc: 'Use the prison library',       reward: '+2 smarts' },
  { id: 'network',  emoji: '🤝', name: 'Network',             desc: 'Meet other criminals',         reward: '+10 crime XP' },
]

export default function PrisonPanel({ character, onPrisonChore, onSkipWeek }) {
  const { prisonWeeksLeft } = character

  return (
    <div className="card card-crime" style={{ marginBottom: 0 }}>
      <div style={{ textAlign: 'center', marginBottom: 16 }}>
        <div style={{ fontSize: 48, lineHeight: 1 }}>🔒</div>
        <div style={{ fontSize: 20, fontWeight: 800, marginTop: 8 }}>Behind Bars</div>
        <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
          Sentence: <span style={{ color: 'var(--danger)', fontWeight: 700 }}>{formatWeeks(prisonWeeksLeft)}</span> remaining
        </div>
      </div>

      <div className="card-title" style={{ marginBottom: 8 }}>Prison Activities</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
        {CHORES.map(chore => (
          <button
            key={chore.id}
            className="crime-btn"
            onClick={() => onPrisonChore(chore.id)}
          >
            <span className="crime-emoji">{chore.emoji}</span>
            <span className="crime-info">
              <span className="crime-name">{chore.name}</span>
              <span className="crime-desc">{chore.desc}</span>
            </span>
            <span className="crime-stats">
              <span style={{ fontSize: 12, color: '#4CAF50', fontWeight: 700 }}>{chore.reward}</span>
              <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>1 week</span>
            </span>
          </button>
        ))}
      </div>

      <button
        className="btn-skip"
        style={{ width: '100%' }}
        onClick={onSkipWeek}
      >
        Skip week ⏭
      </button>
    </div>
  )
}
