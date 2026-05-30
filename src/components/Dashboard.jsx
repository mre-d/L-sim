import { useState } from 'react'
import { MONTHS } from '../App'
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
  if (abs >= 1_000_000)     return sign + '€' + (abs / 1_000_000).toFixed(2) + 'M'
  if (abs >= 1_000)         return sign + '€' + (abs / 1_000).toFixed(1) + 'K'
  return sign + '€' + abs.toLocaleString()
}

function statColor(v) {
  return v > 70 ? '#4CAF50' : v > 40 ? '#FF9800' : '#F44336'
}

export default function Dashboard({ character, onSkipWeek, onActivity, onCareerAction, onCrimeActivity }) {
  const [activeTab, setActiveTab] = useState('life')
  const { name, age, month, week, country, stats, money, eventLog,
          careerPathId, annualSalary, inPrison, prisonYearsLeft } = character

  const flag = COUNTRY_FLAGS[country] || '🌍'
  const weekProgress = Math.round((week / 52) * 100)

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

      {/* Year progress bar */}
      <div className="year-progress">
        <div className="year-progress-fill" style={{ width: `${weekProgress}%` }} />
      </div>

      {/* Stats */}
      <div className="hud-stats">
        <div className="stat-row">
          <span className="stat-icon">❤️</span>
          <div className="stat-bar-track flex1">
            <div className="stat-bar-fill" style={{ width: `${stats.health}%`, backgroundColor: statColor(stats.health) }} />
          </div>
          <span className="stat-val">{Math.round(stats.health)}</span>
        </div>
        <div className="stat-row">
          <span className="stat-icon">😊</span>
          <div className="stat-bar-track flex1">
            <div className="stat-bar-fill" style={{ width: `${stats.happiness}%`, backgroundColor: statColor(stats.happiness) }} />
          </div>
          <span className="stat-val">{Math.round(stats.happiness)}</span>
        </div>
        <div className="stat-row">
          <span className="stat-icon">🧠</span>
          <div className="stat-bar-track flex1">
            <div className="stat-bar-fill" style={{ width: `${stats.smarts}%`, backgroundColor: statColor(stats.smarts) }} />
          </div>
          <span className="stat-val">{Math.round(stats.smarts)}</span>
        </div>
        <div className="stat-row">
          <span className="stat-icon">✨</span>
          <div className="stat-bar-track flex1">
            <div className="stat-bar-fill" style={{ width: `${stats.looks}%`, backgroundColor: statColor(stats.looks) }} />
          </div>
          <span className="stat-val">{Math.round(stats.looks)}</span>
        </div>
      </div>

      {/* Money + Skip */}
      <div className="hud-money-row">
        <div className="hud-money-block">
          <span className="hud-money-icon">💰</span>
          <span className="hud-money-value" style={{ color: money < 0 ? 'var(--danger)' : 'var(--success)' }}>
            {formatMoney(money)}
          </span>
        </div>
        <button className="btn-skip" onClick={onSkipWeek}>
          Skip week ⏭
        </button>
      </div>

      {/* Prison banner */}
      {inPrison && (
        <div className="prison-banner" style={{ margin: '0 12px 0' }}>
          🔒 In prison — {prisonYearsLeft} year{prisonYearsLeft !== 1 ? 's' : ''} left. Skip weeks to serve time.
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
                <div className="info-chip">💼 Earning €{annualSalary.toLocaleString()}/yr — paid each birthday</div>
              )}
              <ActivityMenu onActivity={onActivity} character={character} />
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
