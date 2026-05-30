import { useState } from 'react'
import StatBar from './StatBar'
import EventLog from './EventLog'
import ActivityMenu from './ActivityMenu'
import CareerPanel from './CareerPanel'
import CrimePanel from './CrimePanel'

const COUNTRY_FLAGS = {
  Netherlands: '🇳🇱', Belgium: '🇧🇪', Germany: '🇩🇪',
  'United States': '🇺🇸', 'United Kingdom': '🇬🇧', Japan: '🇯🇵', Brazil: '🇧🇷',
}

const TABS = [
  { id: 'life',   label: 'Life',   emoji: '🏠' },
  { id: 'career', label: 'Career', emoji: '💼' },
  { id: 'crime',  label: 'Crime',  emoji: '🔪' },
]

export default function Dashboard({ character, onAgeUp, onActivity, onCareerAction, onCrimeActivity }) {
  const [activeTab, setActiveTab] = useState('life')
  const { name, age, country, stats, money, eventLog, activitiesThisTurn, maxActivities,
          careerPathId, annualSalary, heatLevel, inPrison, prisonYearsLeft } = character
  const flag = COUNTRY_FLAGS[country] || '🌍'
  const activitiesLeft = maxActivities - activitiesThisTurn
  const moneyColor = money >= 0 ? 'var(--success)' : 'var(--danger)'

  return (
    <div className="screen">
      {/* Top bar */}
      <div className="top-bar">
        <div>
          <div className="top-bar-name">{flag} {name}</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
            {inPrison ? `🔒 In Prison — ${prisonYearsLeft}yr left` : country}
          </div>
        </div>
        <div className="age-badge">Age {age}</div>
      </div>

      {/* Tab bar */}
      <div className="tab-bar">
        {TABS.map(tab => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span>{tab.emoji}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="scroll-area">
        <div className="section">

          {/* Age Up always visible */}
          <button className="btn-primary btn-age-up mb-12" onClick={onAgeUp}>
            {inPrison ? `⏳ Serve Year (${prisonYearsLeft} left)` : `Age Up ➡️ (Year ${age + 1})`}
          </button>

          {/* LIFE TAB */}
          {activeTab === 'life' && (
            <>
              <div className="card">
                <div className="card-title">Stats</div>
                <StatBar emoji="❤️" label="Health" value={stats.health} />
                <StatBar emoji="😊" label="Happiness" value={stats.happiness} />
                <StatBar emoji="🧠" label="Smarts" value={stats.smarts} />
                <StatBar emoji="✨" label="Looks" value={stats.looks} />
              </div>

              <div className="card">
                <div className="info-row">
                  <span className="info-label">💰 Net Worth</span>
                  <span className="fw-bold" style={{ color: moneyColor, fontSize: 18 }}>
                    €{money.toLocaleString()}
                  </span>
                </div>
                {careerPathId && (
                  <div className="info-row">
                    <span className="info-label">📅 Yearly salary</span>
                    <span className="text-success fw-bold">€{annualSalary.toLocaleString()}</span>
                  </div>
                )}
                <div className="info-row">
                  <span className="info-label">🎓 Education</span>
                  <span>{character.education}</span>
                </div>
              </div>

              <ActivityMenu
                onActivity={onActivity}
                activitiesLeft={activitiesLeft}
                character={character}
              />

              <EventLog events={eventLog} />
            </>
          )}

          {/* CAREER TAB */}
          {activeTab === 'career' && (
            <CareerPanel character={character} onCareerAction={onCareerAction} />
          )}

          {/* CRIME TAB */}
          {activeTab === 'crime' && (
            <CrimePanel character={character} onCrimeActivity={onCrimeActivity} />
          )}

        </div>
      </div>
    </div>
  )
}
