import { useState } from 'react'

const COUNTRIES = [
  'Netherlands', 'Belgium', 'Germany', 'United States', 'United Kingdom', 'Japan', 'Brazil',
]

const GENDERS = [
  { value: 'Male', emoji: '👨' },
  { value: 'Female', emoji: '👩' },
  { value: 'Non-binary', emoji: '🧑' },
]

export default function CharacterCreation({ onStart }) {
  const [name, setName] = useState('')
  const [gender, setGender] = useState('')
  const [country, setCountry] = useState('Netherlands')

  function handleStart() {
    if (!name.trim() || !gender) return
    onStart({ name: name.trim(), gender, country })
  }

  const canStart = name.trim().length > 0 && gender !== ''

  return (
    <div className="creation-screen">
      <div className="game-title">L-SIM</div>
      <div className="game-subtitle">🌱 Life Simulator — Your story starts here</div>

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
          👶 Begin Life
        </button>
      </div>
    </div>
  )
}
