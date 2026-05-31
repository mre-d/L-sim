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
      <div className="game-title">L-SIM</div>
      <div className="game-subtitle">🌱 Life Simulator — Your story starts here</div>

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
                background: lifeStart === ls.id ? 'rgba(108,99,255,0.2)' : 'var(--surface2)',
                border: `2px solid ${lifeStart === ls.id ? 'var(--primary)' : 'var(--border)'}`,
                borderRadius: 12,
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
              <span style={{ fontSize: 12, fontWeight: 800, color: lifeStart === ls.id ? 'var(--primary)' : 'var(--text)' }}>
                {ls.name}
              </span>
              <span style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600 }}>{ls.age}</span>
              <span style={{ fontSize: 10, color: '#4CAF50', fontWeight: 700 }}>{ls.money}</span>
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
