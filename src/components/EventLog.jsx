export default function EventLog({ events }) {
  const recent = [...events].reverse().slice(0, 15)

  if (recent.length === 0) {
    return (
      <div className="card">
        <div className="card-title">Life Events</div>
        <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>Your story begins... Age up to see what life brings!</p>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="card-title">Life Events</div>
      {recent.map((event, i) => (
        <div key={i} className={`event-item ${event.type}`}>
          <span className="event-age">Age {event.age}</span>
          {event.text}
        </div>
      ))}
    </div>
  )
}
