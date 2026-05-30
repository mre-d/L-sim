import { getAvailableActivities } from '../game/activities'

function formatCost(cost) {
  if (!cost) return 'Free'
  if (cost >= 1000) return `€${(cost / 1000).toFixed(1)}K`
  return `€${cost}`
}

export default function ActivityMenu({ onActivity, character }) {
  const activities = getAvailableActivities(character)

  return (
    <div className="card">
      <div className="card-title">Activities — each takes 1 week</div>
      <div className="activity-grid">
        {activities.map(act => {
          const canAfford = !act.cost || character.money >= act.cost
          return (
            <button
              key={act.id}
              className="btn-activity"
              onClick={() => onActivity(act.id)}
              disabled={!canAfford}
              title={act.description}
              style={!canAfford ? { opacity: 0.35 } : {}}
            >
              <span className="act-emoji">{act.emoji}</span>
              <span className="act-label">{act.label}</span>
              <span className="act-cost" style={{ color: canAfford ? 'var(--success)' : 'var(--danger)' }}>
                {formatCost(act.cost)}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
