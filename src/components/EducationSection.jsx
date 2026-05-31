import { BACHELOR_DEGREES, MASTERS_DEGREES, COST_PER_STUDY } from '../game/education'

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

function DegreeRow({ emoji, name, progress, target, completed, canAfford, onStudy }) {
  const pct = target > 0 ? Math.min(100, (progress / target) * 100) : 0
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
        ) : (
          <button
            className="degree-btn-enroll"
            onClick={onStudy}
            disabled={!canAfford}
            style={{ opacity: canAfford ? 1 : 0.4 }}
          >
            €{COST_PER_STUDY}
          </button>
        )}
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

export default function EducationSection({ character, onStudyDegree, onStudySchool }) {
  const { completedDegrees = [], money, degreeProgress = {},
          middleSchoolProgress = 0, highSchoolProgress = 0, education } = character

  const midDone = middleSchoolProgress >= MS_TARGET
  const highDone = highSchoolProgress >= HS_TARGET
  const hasBachelor = education === "Bachelor's" || education === "Master's"

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
            const key = `bachelor-${deg.major}`
            const progress = degreeProgress[key] || 0
            const isCompleted = completedDegrees.includes(`Bachelor's - ${deg.major}`)
            return (
              <DegreeRow
                key={deg.major}
                emoji={deg.emoji}
                name={deg.major}
                progress={isCompleted ? deg.target : progress}
                target={deg.target}
                completed={isCompleted}
                canAfford={money >= COST_PER_STUDY}
                onStudy={() => onStudyDegree('bachelor', deg.major)}
              />
            )
          })}
        </>
      )}

      {hasBachelor && (
        <>
          <SectionHeader label="Masters Degrees" />
          {MASTERS_DEGREES.map(deg => {
            const key = `masters-${deg.major}`
            const progress = degreeProgress[key] || 0
            const isCompleted = completedDegrees.includes(`Masters - ${deg.major}`)
            return (
              <DegreeRow
                key={deg.major}
                emoji={deg.emoji}
                name={deg.major}
                progress={isCompleted ? deg.target : progress}
                target={deg.target}
                completed={isCompleted}
                canAfford={money >= COST_PER_STUDY}
                onStudy={() => onStudyDegree('masters', deg.major)}
              />
            )
          })}
        </>
      )}
    </div>
  )
}
