import { useState } from 'react'
import CharacterCreation from './components/CharacterCreation'
import Dashboard from './components/Dashboard'
import GameOver from './components/GameOver'
import { getRandomEvents } from './game/events'
import { performActivity } from './game/activities'
import { getCareerById, canPromote } from './game/careers'
import { attemptCrime, getArrestChance, xpToNextLevel } from './game/crime'

const clamp = (val, min = 0, max = 100) => Math.min(max, Math.max(min, val))
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min

export const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December'
]

function applyChanges(stats, money, changes) {
  const newStats = { ...stats }
  let newMoney = money
  for (const [key, val] of Object.entries(changes)) {
    if (key === 'money') newMoney += val
    else if (key in newStats) newStats[key] = clamp(newStats[key] + val)
  }
  return { stats: newStats, money: newMoney }
}

const INITIAL_STATE = {
  screen: 'creation',
  name: '', gender: '', country: '',
  age: 12,
  week: 1,    // 1–52
  month: 8,   // 0–11 (start September)

  stats: { health: 80, happiness: 75, smarts: 55, looks: 65 },
  money: 500,
  education: 'None',
  eventLog: [],
  isAlive: true,
  deathCause: '',

  // Career
  careerPathId: null,
  careerLevel: 0,
  yearsAtJob: 0,
  jobPerformance: 50,
  annualSalary: 0,

  // Crime
  heatLevel: 0,
  crimeLevel: 1,
  crimeXP: 0,
  criminalRecord: 0,
  inPrison: false,
  prisonYearsLeft: 0,
  totalCrimeEarnings: 0,
}

// Advances time by 1 week. Handles month + year transitions.
function tickWeek(prev, extraLog = []) {
  let newWeek = prev.week + 1
  let newMonth = prev.month
  let newAge = prev.age
  let newStats = { ...prev.stats }
  let newMoney = prev.money
  let newHeat = prev.heatLevel
  let newLog = [...prev.eventLog, ...extraLog]
  let newPrison = prev.inPrison
  let prisonYears = prev.prisonYearsLeft
  let newPerformance = prev.jobPerformance
  let newYearsAtJob = prev.yearsAtJob
  let newEducation = prev.education
  let newCareerPathId = prev.careerPathId
  let newCareerLevel = prev.careerLevel
  let newAnnualSalary = prev.annualSalary

  // Month advances every 4 weeks
  if (newWeek % 4 === 0) {
    newMonth = (newMonth + 1) % 12
  }

  // Year boundary
  if (newWeek > 52) {
    newWeek = 1
    newAge = prev.age + 1

    // Prison countdown
    if (newPrison) {
      prisonYears -= 1
      if (prisonYears <= 0) {
        newPrison = false
        prisonYears = 0
        newLog.push({ text: 'You were released from prison. Fresh start... 🔓', type: 'neutral', age: newAge })
      } else {
        newLog.push({ text: `Another year behind bars. ${prisonYears} year${prisonYears !== 1 ? 's' : ''} left. 🔒`, type: 'bad', age: newAge })
        newStats.happiness = clamp(newStats.happiness - 5)
        newStats.health = clamp(newStats.health - 2)
      }
    }

    // Annual salary
    if (newCareerPathId && newAnnualSalary > 0 && !newPrison) {
      newMoney += newAnnualSalary
      newYearsAtJob += 1
      const path = getCareerById(newCareerPathId)
      newLog.push({
        text: `💼 ${path?.levels[newCareerLevel]?.title}: salary €${newAnnualSalary.toLocaleString()} received`,
        type: 'neutral', age: newAge,
      })
    }

    // Stat drift with age
    if (newAge > 50) { newStats.health = clamp(newStats.health - 1); newStats.looks = clamp(newStats.looks - 1) }
    if (newAge > 70) { newStats.health = clamp(newStats.health - 2) }

    // Heat decay
    newHeat = clamp(newHeat - rand(3, 7), 0, 100)

    // Arrest chance
    const arrestChance = getArrestChance(newHeat)
    if (!newPrison && arrestChance > 0 && Math.random() < arrestChance) {
      const sentence = rand(1, Math.ceil(newHeat / 20))
      newPrison = true
      prisonYears = sentence
      newHeat = clamp(newHeat - 20, 0, 100)
      newLog.push({ text: `🚨 Police caught up with you! Sentenced to ${sentence} year${sentence > 1 ? 's' : ''}.`, type: 'bad', age: newAge })
    }

    // Career performance drift
    if (newCareerPathId) {
      newPerformance = clamp(newPerformance + rand(-8, 12) + (newStats.smarts > 50 ? 2 : -2))
    }

    // Auto education at 18
    if (newAge === 18 && newEducation === 'None') newEducation = 'High School'

    // Random life events
    const { events, death } = getRandomEvents({ ...prev, age: newAge, stats: newStats })
    for (const event of events) {
      const r = applyChanges(newStats, newMoney, event.statChanges || {})
      newStats = r.stats; newMoney = r.money
      newLog.push({ text: event.text, type: event.type, age: newAge })
    }

    if (death.isDead) {
      if (death.text) newLog.push({ text: death.text, type: 'bad', age: newAge })
      return {
        ...prev, age: newAge, week: newWeek, month: newMonth,
        stats: newStats, money: newMoney, education: newEducation,
        heatLevel: newHeat, jobPerformance: newPerformance,
        careerPathId: newCareerPathId, careerLevel: newCareerLevel,
        yearsAtJob: newYearsAtJob, annualSalary: newAnnualSalary,
        inPrison: newPrison, prisonYearsLeft: prisonYears,
        eventLog: newLog.slice(-60),
        isAlive: false, deathCause: death.cause, screen: 'gameover',
      }
    }
  }

  return {
    ...prev,
    age: newAge, week: newWeek, month: newMonth,
    stats: newStats, money: newMoney, education: newEducation,
    heatLevel: newHeat, jobPerformance: newPerformance,
    careerPathId: newCareerPathId, careerLevel: newCareerLevel,
    yearsAtJob: newYearsAtJob, annualSalary: newAnnualSalary,
    inPrison: newPrison, prisonYearsLeft: prisonYears,
    eventLog: newLog.slice(-60),
  }
}

export default function App() {
  const [game, setGame] = useState(INITIAL_STATE)

  function startGame({ name, gender, country }) {
    setGame({
      ...INITIAL_STATE,
      screen: 'game', name, gender, country,
      eventLog: [{ text: `${name} is 12 years old in ${country}. Life begins! 🌱`, type: 'good', age: 12 }],
    })
  }

  // Skip a week without doing anything
  function skipWeek() {
    setGame(prev => tickWeek(prev))
  }

  // Do an activity (costs 1 week)
  function doActivity(activityId) {
    setGame(prev => {
      if (prev.inPrison) return prev
      const result = performActivity(activityId, prev)
      if (!result) return prev
      const { stats: newStats, money: newMoney } = applyChanges(prev.stats, prev.money, result.statChanges || {})
      const actLog = [{ text: result.message, type: result.type || 'activity', age: prev.age }]
      return tickWeek({ ...prev, stats: newStats, money: newMoney }, actLog)
    })
  }

  // Career actions (cost 1 week)
  function doCareerAction(action, payload = {}) {
    setGame(prev => {
      let updated = prev
      let logEntry = null

      if (action === 'apply') {
        const path = getCareerById(payload.pathId)
        if (!path) return prev
        const level = path.levels[0]
        logEntry = { text: `💼 Started as ${level.title} — €${level.salary.toLocaleString()}/yr ${path.emoji}`, type: 'good', age: prev.age }
        updated = { ...prev, careerPathId: path.id, careerLevel: 0, yearsAtJob: 0, jobPerformance: 50, annualSalary: level.salary }
      }

      if (action === 'promote') {
        const path = getCareerById(prev.careerPathId)
        if (!path) return prev
        const check = canPromote(path, prev.careerLevel, prev)
        if (!check.ok) return prev
        const newLevel = prev.careerLevel + 1
        const lvl = path.levels[newLevel]
        logEntry = { text: `🚀 Promoted to ${lvl.title}! €${lvl.salary.toLocaleString()}/yr ${path.emoji}`, type: 'good', age: prev.age }
        updated = { ...prev, careerLevel: newLevel, yearsAtJob: 0, jobPerformance: clamp(prev.jobPerformance - 10), annualSalary: lvl.salary }
      }

      if (action === 'quit') {
        const path = getCareerById(prev.careerPathId)
        logEntry = { text: `🚪 Quit job as ${path?.levels[prev.careerLevel]?.title}.`, type: 'neutral', age: prev.age }
        updated = { ...prev, careerPathId: null, careerLevel: 0, yearsAtJob: 0, annualSalary: 0, jobPerformance: 50 }
      }

      return tickWeek(updated, logEntry ? [logEntry] : [])
    })
  }

  // Crime (costs 1 week)
  function doCrimeActivity(crimeId) {
    setGame(prev => {
      if (prev.inPrison) return prev
      const result = attemptCrime(crimeId, prev)
      if (!result) return prev

      const statChanges = { money: result.money }
      if (result.healthLoss) statChanges.health = -result.healthLoss
      if (result.statBonus) Object.assign(statChanges, result.statBonus)

      const { stats: newStats, money: newMoney } = applyChanges(prev.stats, prev.money, statChanges)
      const newHeat = clamp(prev.heatLevel + result.heatChange, 0, 100)

      // XP and leveling
      let newXP = prev.crimeXP + (result.xpGain || 0)
      let newCrimeLevel = prev.crimeLevel
      const crimeLog = [{ text: result.message, type: result.type, age: prev.age }]

      while (newCrimeLevel < 20 && newXP >= xpToNextLevel(newCrimeLevel)) {
        newXP -= xpToNextLevel(newCrimeLevel)
        newCrimeLevel += 1
        crimeLog.push({ text: `🔓 Crime level up! Now level ${newCrimeLevel} — new crimes unlocked!`, type: 'good', age: prev.age })
      }

      let newPrison = prev.inPrison
      let prisonYears = prev.prisonYearsLeft
      let newRecord = prev.criminalRecord
      let newTotal = prev.totalCrimeEarnings
      if (result.success) newTotal += Math.max(0, result.money)
      else if (result.prisonYears > 0) { newPrison = true; prisonYears = result.prisonYears; newRecord += 1 }

      const updated = {
        ...prev, stats: newStats, money: newMoney,
        heatLevel: newHeat, crimeLevel: newCrimeLevel, crimeXP: newXP,
        criminalRecord: newRecord, inPrison: newPrison,
        prisonYearsLeft: prisonYears, totalCrimeEarnings: newTotal,
      }
      return tickWeek(updated, crimeLog)
    })
  }

  function restart() { setGame(INITIAL_STATE) }

  if (game.screen === 'creation') return <CharacterCreation onStart={startGame} />
  if (game.screen === 'gameover') return <GameOver character={game} onRestart={restart} />

  return (
    <Dashboard
      character={game}
      onSkipWeek={skipWeek}
      onActivity={doActivity}
      onCareerAction={doCareerAction}
      onCrimeActivity={doCrimeActivity}
    />
  )
}
