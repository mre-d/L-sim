export default function StatBar({ emoji, label, value }) {
  const clamped = Math.max(0, Math.min(100, value))
  const color = clamped > 70 ? '#4CAF50' : clamped > 40 ? '#FF9800' : '#F44336'

  return (
    <div className="stat-bar-container">
      <div className="stat-bar-header">
        <span className="stat-bar-label">{emoji} {label}</span>
        <span className="stat-bar-value">{Math.round(clamped)}</span>
      </div>
      <div className="stat-bar-track">
        <div
          className="stat-bar-fill"
          style={{ width: `${clamped}%`, backgroundColor: color }}
        />
      </div>
    </div>
  )
}
