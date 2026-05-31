import { useState } from 'react'
import { MONTHS } from '../App'
import EventLog from './EventLog'
import ActivityMenu from './ActivityMenu'
import CareerPanel from './CareerPanel'
import CrimePanel from './CrimePanel'
import PrisonPanel from './PrisonPanel'
import { getCareerById } from '../game/careers'

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

function StatRing({ value, emoji, size = 52 }) {
  const stroke = 5, r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const color = value > 70 ? '#3FE0A0' : value > 40 ? '#FFC857' : '#FF5E7E'
  const off = c * (1 - value / 100)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.10)" strokeWidth={stroke} />
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeDasharray={c} strokeDashoffset={off} />
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>{emoji}</div>
      </div>
      <span style={{ fontSize: 12, fontWeight: 800, color }}>{Math.round(value)}</span>
    </div>
  )
}

function Avatar({ size = 54 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ display: 'block', borderRadius: '50%', filter: 'drop-shadow(0 0 8px rgba(33,230,193,0.5))' }}>
      <defs>
        <linearGradient id="av-g" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2BF0CD" />
          <stop offset="100%" stopColor="#1FA8FF" />
        </linearGradient>
        <clipPath id="av-c"><circle cx="50" cy="50" r="50" /></clipPath>
      </defs>
      <g clipPath="url(#av-c)">
        <rect width="100" height="100" fill="url(#av-g)" />
        <path d="M50 58c-19 0-33 12-37 30 22 16 52 16 74 0-4-18-18-30-37-30z" fill="rgba(255,255,255,0.20)" />
        <circle cx="50" cy="40" r="16" fill="rgba(255,255,255,0.26)" />
      </g>
      <circle cx="50" cy="50" r="48" fill="none" stroke="#21E6C1" strokeWidth="3" />
    </svg>
  )
}

export default function Dashboard({ character, onSkipWeek, onActivity, onCareerAction, onCrimeActivity, onPrisonChore, onStudyDegree, onStudySchool }) {
  const [activeTab, setActiveTab] = useState('life')
  const { name, age, month, week, country, stats, money, eventLog,
          careerPathId, annualSalary, inPrison, prisonWeeksLeft } = character

  const flag = COUNTRY_FLAGS[country] || '🌍'
  const weekProgress = Math.round((week / 52) * 100)

  return (
    <div className="screen">
      {/* Hero panel */}
      <div className="hero-panel">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Avatar />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 17, fontWeight: 800 }}>{flag} {name}</div>
            <div style={{ fontSize: 11.5, color: 'var(--sub)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {character.careerPathId ? character.annualSalary > 0 ? `${getCareerById(character.careerPathId)?.levels[character.careerLevel]?.title} · Age ${age}` : `Age ${age}` : `Age ${age}`}
            </div>
          </div>
          {/* Money coin pill */}
          <div className="coin-pill">
            <div className="coin-icon">€</div>
            <span>{formatMoney(money)}</span>
          </div>
        </div>
        {/* Stat rings */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 14 }}>
          <StatRing value={stats.health} emoji="❤️" />
          <StatRing value={stats.happiness} emoji="😊" />
          <StatRing value={stats.smarts} emoji="🧠" />
          <StatRing value={stats.looks} emoji="✨" />
        </div>
        {/* Year progress */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 14 }}>
          <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--faint)' }}>{MONTHS[month].slice(0,3).toUpperCase()}</span>
          <div style={{ flex: 1, height: 7, borderRadius: 4, background: 'rgba(255,255,255,0.06)', overflow: 'hidden', boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.4)' }}>
            <div className="kp-sheen" style={{ width: `${weekProgress}%`, height: '100%', borderRadius: 4, background: 'linear-gradient(135deg, #2BF0CD 0%, #1FA8FF 100%)' }} />
          </div>
          <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--teal)' }}>{weekProgress}%</span>
        </div>
      </div>

      {/* Prison banner */}
      {inPrison && (
        <div className="prison-banner" style={{ margin: '4px 12px 0' }}>
          🔒 In prison — {prisonWeeksLeft} week{prisonWeeksLeft !== 1 ? 's' : ''} left
        </div>
      )}

      {/* Content */}
      <div className="scroll-area">
        <div className="section">
          {activeTab === 'life' && (
            <>
              {inPrison ? (
                <PrisonPanel character={character} onPrisonChore={onPrisonChore} onSkipWeek={onSkipWeek} />
              ) : (
                <>
                  {careerPathId && annualSalary > 0 && (
                    <div className="info-chip">💼 Earning €{Math.round(annualSalary / 52).toLocaleString()}/wk</div>
                  )}
                  <ActivityMenu onActivity={onActivity} character={character} />
                </>
              )}
              <EventLog events={eventLog} />
            </>
          )}
          {activeTab === 'career' && (
            <CareerPanel character={character} onCareerAction={onCareerAction} onStudyDegree={onStudyDegree} onStudySchool={onStudySchool} />
          )}
          {activeTab === 'crime' && (
            <CrimePanel character={character} onCrimeActivity={onCrimeActivity} />
          )}
        </div>
      </div>

      {/* Skip Week pinned above tab bar */}
      {activeTab === 'life' && !inPrison && (
        <div style={{ padding: '0 16px 10px', flexShrink: 0 }}>
          <button className="btn-primary btn-age-up" style={{ fontSize: 15 }} onClick={onSkipWeek}>
            Skip Week ⏭
          </button>
        </div>
      )}

      {/* Bottom tab bar */}
      <div className="tab-bar">
        {TABS.map(tab => (
          <button key={tab.id} className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`} onClick={() => setActiveTab(tab.id)}>
            <span>{tab.emoji}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
