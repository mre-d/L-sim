import { useState } from 'react'

const COUNTRIES = [
  'Netherlands', 'Belgium', 'Germany', 'United States', 'United Kingdom', 'Japan', 'Brazil',
]

const GENDERS = [
  { value: 'Male', emoji: '👨' },
  { value: 'Female', emoji: '👩' },
  { value: 'Non-binary', emoji: '🧑' },
]

const LIFE_STARTS = [
  {
    id: 'child',
    emoji: '🧒',
    name: 'Child',
    age: 'Age 12',
    money: '€500',
    desc: 'Full life experience',
  },
  {
    id: 'youngAdult',
    emoji: '🧑',
    name: 'Young Adult',
    age: 'Age 18',
    money: '€1,000',
    desc: 'Skip childhood',
  },
  {
    id: 'tbd',
    emoji: '❓',
    name: 'Coming Soon',
    age: '???',
    money: '???',
    desc: 'Stay tuned...',
    disabled: true,
  },
]

export default function CharacterCreation({ onStart }) {
  const [name, setName] = useState('')
  const [gender, setGender] = useState('')
  const [country, setCountry] = useState('Netherlands')
  const [lifeStart, setLifeStart] = useState('child')

  function handleStart() {
    if (!name.trim() || !gender) return
    onStart({ name: name.trim(), gender, country, lifeStart })
  }

  const canStart = name.trim().length > 0 && gender !== ''

  return (
    <div className="creation-screen">
      {/* Kingpin title area */}
      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.22em', color: 'var(--teal)', textTransform: 'uppercase', marginBottom: 10 }}>
          LIFE SIMULATOR
        </div>
        <div style={{
          display: 'inline-block',
          background: 'linear-gradient(162deg, #12273C 0%, #0B1726 100%)',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.10), 0 0 32px rgba(33,230,193,0.25)',
          borderRadius: 20,
          padding: '10px 32px',
          marginBottom: 10,
        }}>
          <span style={{
            fontSize: 44,
            fontWeight: 900,
            background: 'linear-gradient(135deg, #2BF0CD 0%, #1FA8FF 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            letterSpacing: '-1px',
            fontFamily: "'Sora', system-ui, sans-serif",
          }}>L·Sim</span>
        </div>
        <div className="game-subtitle" style={{ marginBottom: 0 }}>Your story starts here</div>
      </div>

      <div className="form-group">
        <label className="form-label">Life Start</label>
        <div style={{ display: 'flex', gap: 8 }}>
          {LIFE_STARTS.map(ls => (
            <button
              key={ls.id}
              onClick={() => !ls.disabled && setLifeStart(ls.id)}
              disabled={ls.disabled}
              style={{
                flex: 1,
                background: lifeStart === ls.id
                  ? 'rgba(33,230,193,0.12)'
                  : 'linear-gradient(162deg, #12273C 0%, #0B1726 100%)',
                border: `2px solid ${lifeStart === ls.id ? 'var(--teal)' : 'rgba(255,255,255,0.08)'}`,
                boxShadow: lifeStart === ls.id
                  ? 'inset 0 1px 0 rgba(255,255,255,0.10), 0 0 14px rgba(33,230,193,0.2)'
                  : 'inset 0 1px 0 rgba(255,255,255,0.08)',
                borderRadius: 14,
                padding: '10px 6px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 3,
                minHeight: 90,
                cursor: ls.disabled ? 'not-allowed' : 'pointer',
                opacity: ls.disabled ? 0.4 : 1,
              }}
            >
              <span style={{ fontSize: 26 }}>{ls.emoji}</span>
              <span style={{ fontSize: 12, fontWeight: 800, color: lifeStart === ls.id ? 'var(--teal)' : 'var(--ink)' }}>
                {ls.name}
              </span>
              <span style={{ fontSize: 10, color: 'var(--sub)', fontWeight: 600 }}>{ls.age}</span>
              <span style={{ fontSize: 10, color: 'var(--good)', fontWeight: 700 }}>{ls.money}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Your Name</label>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Enter your name..."
          maxLength={30}
          autoComplete="off"
        />
      </div>

      <div className="form-group">
        <label className="form-label">Gender</label>
        <div className="gender-group">
          {GENDERS.map(g => (
            <button
              key={g.value}
              className={`gender-btn ${gender === g.value ? 'selected' : ''}`}
              onClick={() => setGender(g.value)}
            >
              {g.emoji} {g.value}
            </button>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Country</label>
        <select value={country} onChange={e => setCountry(e.target.value)}>
          {COUNTRIES.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <div style={{ marginTop: 'auto', paddingTop: 24 }}>
        <button
          className="btn-primary btn-age-up"
          onClick={handleStart}
          disabled={!canStart}
        >
          {lifeStart === 'youngAdult' ? '🧑 Begin Adult Life' : '👶 Begin Life'}
        </button>
      </div>
    </div>
  )
}
