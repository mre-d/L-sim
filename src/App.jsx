import { useState, useEffect, useCallback } from 'react'
import CharacterCreation from './components/CharacterCreation'
import Dashboard from './components/Dashboard'
import GameOver from './components/GameOver'
import { getRandomEvents } from './game/events'
import { performActivity } from './game/activities'
import { getCareerById, canPromote } from './game/careers'
import { attemptCrime, getArrestChance } from './game/crime'

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
  week: 1,      // 1–52
  month: 8,     // 0–11 index (start in September)
  stats: { health: 80, happiness: 75, smarts: 55, looks: 65 },
  money: 500,
  education: 'None',
  eventLog: [],
  isAlive: true,
  deathCause: '',
  isPaused: false,
  speed: 1,           // 1 | 2 | 4
  busyWeeks: 0,       // weeks until next action available
  currentActivity: null,

  // Career
  careerPathId: null,
  careerLevel: 0,
  yearsAtJob: 0,
  jobPerformance: 50,
  annualSalary: 0,

  // Crime
  heatLevel: 0,
  crimeXP: 0,
  criminalRecord: 0,
  inPrison: false,
  prisonYearsLeft: 0,
  totalCrimeEarnings: 0,
}

function advanceOneWeek(prev) {
  if (!prev.isAlive || prev.screen !== 'game') return prev

  // Tick busy weeks down
  const newBusy = Math.max(0, prev.busyWeeks - 1)

  let newWeek = prev.week + 1
  let newMonth = prev.month
  let newAge = prev.age
  let newStats = { ...prev.stats }
  let newMoney = prev.money
  let newHeat = prev.heatLevel
  let newLog = [...prev.eventLog]
  let newPrison = prev.inPrison
  let prisonYears = prev.prisonYearsLeft
  let newPerformance = prev.jobPerformance
  let newYearsAtJob = prev.yearsAtJob
  let newEducation = prev.education
  let newCareerPathId = prev.careerPathId
  let newCareerLevel = prev.careerLevel
  let newAnnualSalary = prev.annualSalary

  // Advance month every ~4 weeks
  if (newWeek % 4 === 0) {
    newMonth = (newMonth + 1) % 12
  }

  // New year
  if (newWeek > 52) {
    newWeek = 1
    newAge = prev.age + 1

    // Prison countdown
    if (newPrison) {
      prisonYears = prisonYears - 1
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
        text: `💼 ${path?.levels[newCareerLevel]?.title}: €${newAnnualSalary.toLocaleString()} salary received`,
        type: 'neutral',
        age: newAge,
      })
    }

    // Age stat drift
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
      newLog.push({ text: `🚨 Police caught you! Sentenced to ${sentence} year${sentence > 1 ? 's' : ''}.`, type: 'bad', age: newAge })
    }

    // Career performance drift
    if (newCareerPathId) {
      const drift = rand(-8, 12) + (newStats.smarts > 50 ? 2 : -2)
      newPerformance = clamp(newPerformance + drift)
    }

    // Auto education at 18
    if (newAge === 18 && newEducation === 'None') newEducation = 'High School'

    // Random yearly events
    const { events, death } = getRandomEvents({ ...prev, age: newAge, stats: newStats })
    for (const event of events) {
      const result = applyChanges(newStats, newMoney, event.statChanges || {})
      newStats = result.stats
      newMoney = result.money
      newLog.push({ text: event.text, type: event.type, age: newAge })
    }

    if (death.isDead) {
      if (death.text) newLog.push({ text: death.text, type: 'bad', age: newAge })
      return {
        ...prev, age: newAge, week: newWeek, month: newMonth,
        stats: newStats, money: newMoney, education: newEducation,
        heatLevel: newHeat, jobPerformance: newPerformance,
        eventLog: newLog, isAlive: false, deathCause: death.cause,
        screen: 'gameover', busyWeeks: 0,
        careerPathId: newCareerPathId, careerLevel: newCareerLevel,
        yearsAtJob: newYearsAtJob, annualSalary: newAnnualSalary,
        inPrison: newPrison, prisonYearsLeft: prisonYears,
      }
    }
  }

  return {
    ...prev,
    age: newAge, week: newWeek, month: newMonth,
    stats: newStats, money: newMoney, education: newEducation,
    heatLevel: newHeat, jobPerformance: newPerformance,
    yearsAtJob: newYearsAtJob, annualSalary: newAnnualSalary,
    careerPathId: newCareerPathId, careerLevel: newCareerLevel,
    inPrison: newPrison, prisonYearsLeft: prisonYears,
    eventLog: newLog.slice(-50),   // keep last 50 events
    busyWeeks: newBusy,
    currentActivity: newBusy > 0 ? prev.currentActivity : null,
  }
}

export default function App() {
  const [game, setGame] = useState(INITIAL_STATE)

  // Auto-advance time
  useEffect(() => {
    if (game.screen !== 'game' || game.isPaused) return
    const ms = game.speed === 4 ? 250 : game.speed === 2 ? 600 : 1200
    const timer = setInterval(() => {
      setGame(prev => advanceOneWeek(prev))
    }, ms)
    return () => clearInterval(timer)
  }, [game.screen, game.isPaused, game.speed])

  function startGame({ name, gender, country }) {
    setGame({
      ...INITIAL_STATE,
      screen: 'game', name, gender, country,
      eventLog: [{ text: `${name} starts their story in ${country}. Age 12 — the world awaits. 🌱`, type: 'good', age: 12 }],
    })
  }

  function togglePause() {
    setGame(prev => ({ ...prev, isPaused: !prev.isPaused }))
  }

  function setSpeed(speed) {
    setGame(prev => ({ ...prev, speed, isPaused: false }))
  }

  function doActivity(activityId) {
    setGame(prev => {
      if (prev.busyWeeks > 0) return prev
      const result = performActivity(activityId, prev)
      if (!result) return prev
      const { stats: newStats, money: newMoney } = applyChanges(prev.stats, prev.money, result.statChanges || {})
      const weekCost = result.weekCost || 1
      return {
        ...prev,
        stats: newStats, money: newMoney,
        busyWeeks: weekCost,
        currentActivity: result.activityLabel || activityId,
        eventLog: [...prev.eventLog, { text: result.message, type: result.type || 'activity', age: prev.age }],
      }
    })
  }

  function doCareerAction(action, payload = {}) {
    setGame(prev => {
      if (action === 'apply') {
        const path = getCareerById(payload.pathId)
        if (!path) return prev
        const level = path.levels[0]
        return {
          ...prev,
          careerPathId: path.id, careerLevel: 0, yearsAtJob: 0,
          jobPerformance: 50, annualSalary: level.salary,
          busyWeeks: 2, currentActivity: 'Starting new job',
          eventLog: [...prev.eventLog, {
            text: `💼 You started as ${level.title} — €${level.salary.toLocaleString()}/yr! ${path.emoji}`,
            type: 'good', age: prev.age,
          }],
        }
      }
      if (action === 'promote') {
        const path = getCareerById(prev.careerPathId)
        if (!path) return prev
        const check = canPromote(path, prev.careerLevel, prev)
        if (!check.ok) return prev
        const newLevel = prev.careerLevel + 1
        const newLevelData = path.levels[newLevel]
        return {
          ...prev,
          careerLevel: newLevel, yearsAtJob: 0,
          jobPerformance: clamp(prev.jobPerformance - 10),
          annualSalary: newLevelData.salary,
          busyWeeks: 1, currentActivity: 'Promotion interview',
          eventLog: [...prev.eventLog, {
            text: `🚀 Promoted to ${newLevelData.title}! €${newLevelData.salary.toLocaleString()}/yr ${path.emoji}`,
            type: 'good', age: prev.age,
          }],
        }
      }
      if (action === 'quit') {
        const path = getCareerById(prev.careerPathId)
        return {
          ...prev,
          careerPathId: null, careerLevel: 0, yearsAtJob: 0,
          annualSalary: 0, jobPerformance: 50,
          eventLog: [...prev.eventLog, {
            text: `🚪 You quit your job as ${path?.levels[prev.careerLevel]?.title}.`,
            type: 'neutral', age: prev.age,
          }],
        }
      }
      return prev
    })
  }

  function doCrimeActivity(crimeId) {
    setGame(prev => {
      if (prev.busyWeeks > 0 || prev.inPrison) return prev
      const result = attemptCrime(crimeId, prev)
      if (!result) return prev
      const { stats: newStats, money: newMoney } = applyChanges(
        prev.stats, prev.money,
        { money: result.money, health: result.healthLoss ? -result.healthLoss : 0 }
      )
      const newHeat = clamp(prev.heatLevel + result.heatChange, 0, 100)
      const newXP = prev.crimeXP + (result.xpGain || 0)
      let newPrison = prev.inPrison
      let prisonYears = prev.prisonYearsLeft
      let newRecord = prev.criminalRecord
      let newTotalCrime = prev.totalCrimeEarnings
      if (result.success) newTotalCrime += result.money
      else if (result.prisonYears > 0) {
        newPrison = true; prisonYears = result.prisonYears; newRecord += 1
      }
      return {
        ...prev,
        stats: newStats, money: newMoney, heatLevel: newHeat,
        crimeXP: newXP, criminalRecord: newRecord,
        inPrison: newPrison, prisonYearsLeft: prisonYears,
        totalCrimeEarnings: newTotalCrime,
        busyWeeks: result.weekCost || 1,
        currentActivity: result.success ? 'On the run...' : 'In custody',
        eventLog: [...prev.eventLog, { text: result.message, type: result.type, age: prev.age }],
      }
    })
  }

  function restart() { setGame(INITIAL_STATE) }

  if (game.screen === 'creation') return <CharacterCreation onStart={startGame} />
  if (game.screen === 'gameover') return <GameOver character={game} onRestart={restart} />

  return (
    <Dashboard
      character={game}
      onTogglePause={togglePause}
      onSetSpeed={setSpeed}
      onActivity={doActivity}
      onCareerAction={doCareerAction}
      onCrimeActivity={doCrimeActivity}
    />
  )
}
