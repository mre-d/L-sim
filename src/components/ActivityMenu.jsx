import { getAvailableActivities } from '../game/activities'

export default function ActivityMenu({ onActivity, activitiesLeft, character }) {
  const activities = getAvailableActivities(character)
  const disabled = activitiesLeft <= 0

  return (
    <div className="card">
      <div className="card-title">Activities</div>
      <div className="acts-counter">
        Activities remaining: <span>{activitiesLeft}</span> / {character.maxActivities}
      </div>
      <div className="activity-grid">
        {activities.map(act => (
          <button
            key={act.id}
            className="btn-activity"
            onClick={() => onActivity(act.id)}
            disabled={disabled}
            title={act.description}
          >
            <span className="act-emoji">{act.emoji}</span>
            <span className="act-label">{act.label}</span>
          </button>
        ))}
      </div>
      {disabled && (
        <p style={{ color: 'var(--text-muted)', fontSize: 12, textAlign: 'center', marginTop: 10 }}>
          No more activities this year — Age Up to continue!
        </p>
      )}
    </div>
  )
}
