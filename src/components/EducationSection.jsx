import { BACHELOR_DEGREES, MASTERS_DEGREES } from '../game/education'

const MS_TARGET = 75
const HS_TARGET = 100

function SchoolRow({ emoji, name, progress, target, completed, onStudy, locked }) {
  const pct = Math.min(100, (progress / target) * 100)
  return (
    <div className="degree-row">
      <span className="degree-emoji">{emoji}</span>
      <div className="degree-info">
        <div className="degree-name">{name}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
          <div className="stat-bar-track" style={{ flex: 1 }}>
            <div className="stat-bar-fill" style={{ width: `${pct}%`, backgroundColor: completed ? '#4CAF50' : '#2196F3' }} />
          </div>
          <span style={{ fontSize: 11, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
            {progress}/{target}
          </span>
        </div>
      </div>
      <div className="degree-action">
        {completed ? (
          <span className="degree-badge-done">Complete</span>
        ) : locked ? (
          <span className="degree-badge-done" style={{ opacity: 0.4 }}>🔒</span>
        ) : (
          <button className="degree-btn-enroll" onClick={onStudy}>
            €0
          </button>
        )}
      </div>
    </div>
  )
}

function DegreeRow({ emoji, name, progress, total, completed, enrolled, cost, canAfford, onEnroll }) {
  const pct = total > 0 ? Math.min(100, (progress / total) * 100) : 0
  return (
    <div className="degree-row">
      <span className="degree-emoji">{emoji}</span>
      <div className="degree-info">
        <div className="degree-name">{name}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
          <div className="stat-bar-track" style={{ flex: 1 }}>
            <div className="stat-bar-fill" style={{ width: `${pct}%`, backgroundColor: completed ? '#4CAF50' : '#2196F3' }} />
          </div>
          <span style={{ fontSize: 11, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
            {progress}/{total} yr
          </span>
        </div>
      </div>
      <div className="degree-action">
        {completed ? (
          <span className="degree-badge-done">Complete</span>
        ) : enrolled ? (
          <span className="degree-badge-active">{progress}/{total}y</span>
        ) : cost != null ? (
          <button
            className="degree-btn-enroll"
            onClick={onEnroll}
            disabled={!canAfford}
            style={{ opacity: canAfford ? 1 : 0.4 }}
          >
            €{cost >= 1000 ? (cost / 1000).toFixed(0) + 'k' : cost}
          </button>
        ) : null}
      </div>
    </div>
  )
}

function SectionHeader({ label }) {
  return (
    <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 700, margin: '14px 0 8px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
      {label}
    </div>
  )
}

export default function EducationSection({ character, onEnrollSchool, onStudySchool }) {
  const { education, completedDegrees = [], enrolledDegree, money,
          middleSchoolProgress = 0, highSchoolProgress = 0 } = character

  const midDone = middleSchoolProgress >= MS_TARGET
  const highDone = highSchoolProgress >= HS_TARGET
  const hasBachelor = education === "Bachelor's" || education === "Master's"
  const canEnrollBachelor = highDone && !enrolledDegree
  const canEnrollMasters = hasBachelor && !enrolledDegree

  return (
    <div className="card" style={{ marginBottom: 12 }}>
      <div className="card-title" style={{ marginBottom: 12 }}>🎓 Education</div>

      <SectionHeader label="Primary Education" />

      <SchoolRow
        emoji="✏️"
        name="Middle School"
        progress={middleSchoolProgress}
        target={MS_TARGET}
        completed={midDone}
        onStudy={() => onStudySchool('middleSchool')}
      />
      <SchoolRow
        emoji="📖"
        name="High School"
        progress={highSchoolProgress}
        target={HS_TARGET}
        completed={highDone}
        locked={!midDone}
        onStudy={() => onStudySchool('highSchool')}
      />

      {highDone && (
        <>
          <SectionHeader label="Bachelor's Degrees" />
          {BACHELOR_DEGREES.map(deg => {
            const key = `Bachelor's - ${deg.major}`
            const isCompleted = completedDegrees.includes(key)
            const isEnrolled = enrolledDegree?.level === 'bachelor' && enrolledDegree?.major === deg.major
            const progress = isEnrolled
              ? deg.years - enrolledDegree.yearsLeft
              : isCompleted ? deg.years : 0
            return (
              <DegreeRow
                key={deg.major}
                emoji={deg.emoji}
                name={deg.major}
                progress={progress}
                total={deg.years}
                completed={isCompleted}
                enrolled={isEnrolled}
                cost={!isCompleted && !isEnrolled && canEnrollBachelor ? deg.cost : null}
                canAfford={money >= deg.cost}
                onEnroll={() => onEnrollSchool('bachelor', deg.major, deg.cost, deg.years)}
              />
            )
          })}
        </>
      )}

      {hasBachelor && (
        <>
          <SectionHeader label="Masters Degrees" />
          {MASTERS_DEGREES.map(deg => {
            const key = `Masters - ${deg.major}`
            const isCompleted = completedDegrees.includes(key)
            const isEnrolled = enrolledDegree?.level === 'masters' && enrolledDegree?.major === deg.major
            const progress = isEnrolled
              ? deg.years - enrolledDegree.yearsLeft
              : isCompleted ? deg.years : 0
            return (
              <DegreeRow
                key={deg.major}
                emoji={deg.emoji}
                name={deg.major}
                progress={progress}
                total={deg.years}
                completed={isCompleted}
                enrolled={isEnrolled}
                cost={!isCompleted && !isEnrolled && canEnrollMasters ? deg.cost : null}
                canAfford={money >= deg.cost}
                onEnroll={() => onEnrollSchool('masters', deg.major, deg.cost, deg.years)}
              />
            )
          })}
        </>
      )}

      {enrolledDegree && (
        <div style={{ marginTop: 10, padding: '8px 12px', background: 'rgba(33,150,243,0.1)', borderRadius: 8, fontSize: 12, color: '#2196F3', fontWeight: 600 }}>
          📚 Studying: {enrolledDegree.level === 'masters' ? "Masters" : "Bachelor's"} — {enrolledDegree.major} ({enrolledDegree.yearsLeft} yr{enrolledDegree.yearsLeft !== 1 ? 's' : ''} left)
        </div>
      )}
    </div>
  )
}
