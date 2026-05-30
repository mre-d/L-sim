import { useState } from 'react'
import CharacterCreation from './components/CharacterCreation'
import Dashboard from './components/Dashboard'
import GameOver from './components/GameOver'
import { getRandomEvents } from './game/events'
import { performActivity } from './game/activities'
import { getCareerById, canPromote } from './game/careers'
import { attemptCrime, getArrestChance, getHeatInfo } from './game/crime'

const clamp = (val, min = 0, max = 100) => Math.min(max, Math.max(min, val))
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min

function applyStatChanges(stats, money, changes) {
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
  name: '',
  age: 0,
  gender: '',
  country: '',
  stats: { health: 70, happiness: 70, smarts: 50, looks: 60 },
  money: 1000,
  education: 'None',
  eventLog: [],
  isAlive: true,
  deathCause: '',
  activitiesThisTurn: 0,
  maxActivities: 3,

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

export default function App() {
  const [game, setGame] = useState(INITIAL_STATE)

  function startGame({ name, gender, country }) {
    setGame({
      ...INITIAL_STATE,
      screen: 'game',
      name,
      gender,
      country,
      age: 0,
      eventLog: [{ text: `${name} was born in ${country}! A new life begins. 🌱`, type: 'good', age: 0 }],
    })
  }

  function ageUp() {
    setGame(prev => {
      if (prev.inPrison && prev.prisonYearsLeft > 0) {
        const yearsLeft = prev.prisonYearsLeft - 1
        const released = yearsLeft <= 0
        const newLog = [...prev.eventLog]
        if (released) {
          newLog.push({ text: 'You were released from prison. Time to start fresh... or not. 🔓', type: 'neutral', age: prev.age + 1 })
        } else {
          newLog.push({ text: `Another year behind bars. ${yearsLeft} year${yearsLeft !== 1 ? 's' : ''} left. 🔒`, type: 'bad', age: prev.age + 1 })
        }
        return {
          ...prev,
          age: prev.age + 1,
          prisonYearsLeft: yearsLeft,
          inPrison: !released,
          activitiesThisTurn: 0,
          stats: { ...prev.stats, happiness: clamp(prev.stats.happiness - 5), health: clamp(prev.stats.health - 2) },
          eventLog: newLog,
        }
      }

      const newAge = prev.age + 1
      const newLog = [...prev.eventLog]
      let newStats = { ...prev.stats }
      let newMoney = prev.money

      // Passive salary income
      if (prev.careerPathId && prev.annualSalary > 0) {
        newMoney += prev.annualSalary
        const path = getCareerById(prev.careerPathId)
        if (path) {
          newLog.push({
            text: `💼 ${path.levels[prev.careerLevel].title}: salary of €${prev.annualSalary.toLocaleString()} received`,
            type: 'neutral',
            age: newAge,
          })
        }
      }

      // Age-based stat drift
      if (newAge > 50) { newStats.health = clamp(newStats.health - 1); newStats.looks = clamp(newStats.looks - 1) }
      if (newAge > 70) { newStats.health = clamp(newStats.health - 2) }

      // Heat decay
      let newHeat = clamp(prev.heatLevel - rand(3, 7), 0, 100)

      // Arrest check
      const arrestChance = getArrestChance(newHeat)
      let newPrison = false
      let prisonYears = 0
      if (arrestChance > 0 && Math.random() < arrestChance) {
        const sentence = rand(1, Math.ceil(newHeat / 20))
        newPrison = true
        prisonYears = sentence
        newHeat = clamp(newHeat - 20, 0, 100)
        newLog.push({
          text: `🚨 Police finally caught up with you! Sentenced to ${sentence} year${sentence > 1 ? 's' : ''} in prison.`,
          type: 'bad',
          age: newAge,
        })
      }

      // Career performance drift
      let newPerformance = prev.jobPerformance
      if (prev.careerPathId) {
        const drift = rand(-8, 12) + (newStats.smarts > 50 ? 2 : -2)
        newPerformance = clamp(newPerformance + drift)
      }

      // Random life events
      const { events, death } = getRandomEvents({ ...prev, age: newAge, stats: newStats })
      for (const event of events) {
        const result = applyStatChanges(newStats, newMoney, event.statChanges || {})
        newStats = result.stats
        newMoney = result.money
        newLog.push({ text: event.text, type: event.type, age: newAge })
      }

      // Auto-education at 18
      let newEducation = prev.education
      if (newAge === 18 && newEducation === 'None') newEducation = 'High School'

      // Death check
      if (death.isDead) {
        if (death.text) newLog.push({ text: death.text, type: 'bad', age: newAge })
        return {
          ...prev,
          age: newAge,
          stats: newStats,
          money: newMoney,
          education: newEducation,
          heatLevel: newHeat,
          jobPerformance: newPerformance,
          eventLog: newLog,
          isAlive: false,
          deathCause: death.cause,
          activitiesThisTurn: 0,
          screen: 'gameover',
        }
      }

      return {
        ...prev,
        age: newAge,
        stats: newStats,
        money: newMoney,
        education: newEducation,
        heatLevel: newHeat,
        jobPerformance: newPerformance,
        yearsAtJob: prev.careerPathId ? prev.yearsAtJob + 1 : 0,
        inPrison: newPrison,
        prisonYearsLeft: prisonYears,
        eventLog: newLog,
        activitiesThisTurn: 0,
      }
    })
  }

  function doActivity(activityId) {
    setGame(prev => {
      if (prev.activitiesThisTurn >= prev.maxActivities) return prev
      const result = performActivity(activityId, prev)
      if (!result) return prev
      const { stats: newStats, money: newMoney } = applyStatChanges(prev.stats, prev.money, result.statChanges || {})
      return {
        ...prev,
        stats: newStats,
        money: newMoney,
        activitiesThisTurn: prev.activitiesThisTurn + 1,
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
          careerPathId: path.id,
          careerLevel: 0,
          yearsAtJob: 0,
          jobPerformance: 50,
          annualSalary: level.salary,
          eventLog: [...prev.eventLog, {
            text: `💼 You started working as a ${level.title} at €${level.salary.toLocaleString()}/yr! ${path.emoji}`,
            type: 'good',
            age: prev.age,
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
          careerLevel: newLevel,
          yearsAtJob: 0,
          jobPerformance: clamp(prev.jobPerformance - 10),
          annualSalary: newLevelData.salary,
          eventLog: [...prev.eventLog, {
            text: `🚀 Promoted to ${newLevelData.title}! New salary: €${newLevelData.salary.toLocaleString()}/yr ${path.emoji}`,
            type: 'good',
            age: prev.age,
          }],
        }
      }

      if (action === 'quit') {
        const path = getCareerById(prev.careerPathId)
        return {
          ...prev,
          careerPathId: null,
          careerLevel: 0,
          yearsAtJob: 0,
          annualSalary: 0,
          jobPerformance: 50,
          eventLog: [...prev.eventLog, {
            text: `🚪 You quit your job as ${path?.levels[prev.careerLevel]?.title || 'employee'}.`,
            type: 'neutral',
            age: prev.age,
          }],
        }
      }

      return prev
    })
  }

  function doCrimeActivity(crimeId) {
    setGame(prev => {
      if (prev.activitiesThisTurn >= prev.maxActivities) return prev
      if (prev.inPrison) return prev

      const result = attemptCrime(crimeId, prev)
      if (!result) return prev

      const { stats: newStats, money: newMoney } = applyStatChanges(
        prev.stats,
        prev.money,
        { money: result.money, health: result.healthLoss ? -result.healthLoss : 0 }
      )

      const newHeat = clamp(prev.heatLevel + result.heatChange, 0, 100)
      const newXP = prev.crimeXP + (result.xpGain || 0)

      let newPrison = prev.inPrison
      let prisonYears = prev.prisonYearsLeft
      let newRecord = prev.criminalRecord
      let newTotalCrime = prev.totalCrimeEarnings

      if (result.success) {
        newTotalCrime += result.money
      } else if (result.prisonYears > 0) {
        newPrison = true
        prisonYears = result.prisonYears
        newRecord += 1
      }

      return {
        ...prev,
        stats: newStats,
        money: newMoney,
        heatLevel: newHeat,
        crimeXP: newXP,
        criminalRecord: newRecord,
        inPrison: newPrison,
        prisonYearsLeft: prisonYears,
        totalCrimeEarnings: newTotalCrime,
        activitiesThisTurn: prev.activitiesThisTurn + 1,
        eventLog: [...prev.eventLog, { text: result.message, type: result.type, age: prev.age }],
      }
    })
  }

  function restart() {
    setGame(INITIAL_STATE)
  }

  if (game.screen === 'creation') return <CharacterCreation onStart={startGame} />
  if (game.screen === 'gameover') return <GameOver character={game} onRestart={restart} />

  return (
    <Dashboard
      character={game}
      onAgeUp={ageUp}
      onActivity={doActivity}
      onCareerAction={doCareerAction}
      onCrimeActivity={doCrimeActivity}
    />
  )
}
