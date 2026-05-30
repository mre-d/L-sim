import { useState } from 'react'
import { MONTHS } from '../App'
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

function formatMoney(n) {
  const abs = Math.abs(n)
  const sign = n < 0 ? '-' : ''
  if (abs >= 1_000_000_000) return sign + '€' + (abs / 1_000_000_000).toFixed(1) + 'B'
  if (abs >= 1_000_000) return sign + '€' + (abs / 1_000_000).toFixed(1) + 'M'
  if (abs >= 1_000) return sign + '€' + (abs / 1_000).toFixed(1) + 'K'
  return sign + '€' + abs.toLocaleString()
}

export default function Dashboard({ character, onTogglePause, onSetSpeed, onActivity, onCareerAction, onCrimeActivity }) {
  const [activeTab, setActiveTab] = useState('life')
  const {
    name, age, month, country, stats, money, eventLog,
    isPaused, speed, busyWeeks, currentActivity,
    careerPathId, annualSalary, inPrison, prisonYearsLeft,
  } = character

  const flag = COUNTRY_FLAGS[country] || '🌍'
  const isBusy = busyWeeks > 0

  return (
    <div className="screen">
      {/* Header */}
      <div className="hud-header">
        <div className="hud-name">{flag} {name}</div>
        <div className="hud-time">
          <span className="hud-age">{age} years</span>
          <span className="hud-month">{MONTHS[month]}</span>
        </div>
      </div>

      {/* Stats */}
      <div className="hud-stats">
        <div className="stat-row">
          <span className="stat-icon">❤️</span>
          <div className="stat-bar-track flex1">
            <div className="stat-bar-fill" style={{ width: `${stats.health}%`, backgroundColor: statColor(stats.health) }} />
          </div>
        </div>
        <div className="stat-row">
          <span className="stat-icon">😊</span>
          <div className="stat-bar-track flex1">
            <div className="stat-bar-fill" style={{ width: `${stats.happiness}%`, backgroundColor: statColor(stats.happiness) }} />
          </div>
        </div>
        <div className="stat-row">
          <span className="stat-icon">🧠</span>
          <div className="stat-bar-track flex1">
            <div className="stat-bar-fill" style={{ width: `${stats.smarts}%`, backgroundColor: statColor(stats.smarts) }} />
          </div>
        </div>
        <div className="stat-row">
          <span className="stat-icon">✨</span>
          <div className="stat-bar-track flex1">
            <div className="stat-bar-fill" style={{ width: `${stats.looks}%`, backgroundColor: statColor(stats.looks) }} />
          </div>
        </div>
      </div>

      {/* Money + Speed Controls */}
      <div className="hud-money-row">
        <div className="hud-money-block">
          <span className="hud-money-icon">💰</span>
          <span className="hud-money-value" style={{ color: money < 0 ? 'var(--danger)' : 'var(--success)' }}>
            {formatMoney(money)}
          </span>
        </div>
        <div className="speed-controls">
          <button className={`speed-btn ${isPaused ? 'active' : ''}`} onClick={onTogglePause}>
            {isPaused ? '▶️' : '⏸'}
          </button>
          <button className={`speed-btn ${!isPaused && speed === 1 ? 'active' : ''}`} onClick={() => onSetSpeed(1)}>1×</button>
          <button className={`speed-btn ${!isPaused && speed === 2 ? 'active' : ''}`} onClick={() => onSetSpeed(2)}>2×</button>
          <button className={`speed-btn ${!isPaused && speed === 4 ? 'active' : ''}`} onClick={() => onSetSpeed(4)}>4×</button>
        </div>
      </div>

      {/* Busy indicator */}
      {isBusy && (
        <div className="busy-bar">
          ⏳ {currentActivity} — {busyWeeks} week{busyWeeks !== 1 ? 's' : ''} remaining
        </div>
      )}

      {/* Prison banner */}
      {inPrison && (
        <div className="prison-banner" style={{ margin: '0 12px 8px' }}>
          🔒 In prison — {prisonYearsLeft} year{prisonYearsLeft !== 1 ? 's' : ''} left
        </div>
      )}

      {/* Tabs */}
      <div className="tab-bar">
        {TABS.map(tab => (
          <button key={tab.id} className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`} onClick={() => setActiveTab(tab.id)}>
            <span>{tab.emoji}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="scroll-area">
        <div className="section">
          {activeTab === 'life' && (
            <>
              {careerPathId && annualSalary > 0 && (
                <div className="info-chip">💼 Earning €{annualSalary.toLocaleString()}/yr</div>
              )}
              <ActivityMenu onActivity={onActivity} isBusy={isBusy} character={character} />
              <EventLog events={eventLog} />
            </>
          )}
          {activeTab === 'career' && (
            <CareerPanel character={character} onCareerAction={onCareerAction} />
          )}
          {activeTab === 'crime' && (
            <CrimePanel character={character} onCrimeActivity={onCrimeActivity} />
          )}
        </div>
      </div>
    </div>
  )
}

function statColor(v) {
  return v > 70 ? '#4CAF50' : v > 40 ? '#FF9800' : '#F44336'
}
