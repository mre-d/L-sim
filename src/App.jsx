import { useState } from 'react'
import CharacterCreation from './components/CharacterCreation'
import Dashboard from './components/Dashboard'
import GameOver from './components/GameOver'
import { getRandomEvents } from './game/events'
import { performActivity } from './game/activities'

const clamp = (val, min = 0, max = 100) => Math.min(max, Math.max(min, val))

const JOBS_BY_AGE = [
  { minAge: 60, job: 'Retired' },
  { minAge: 30, job: 'Senior Professional' },
  { minAge: 24, job: 'Professional' },
  { minAge: 18, job: 'Junior Employee' },
  { minAge: 16, job: 'Part-time Worker' },
]

function getDefaultJob(age, smarts) {
  const match = JOBS_BY_AGE.find(j => age >= j.minAge)
  return match ? match.job : 'Student'
}

function applyStatChanges(stats, money, changes) {
  const newStats = { ...stats }
  let newMoney = money

  for (const [key, val] of Object.entries(changes)) {
    if (key === 'money') {
      newMoney += val
    } else if (key in newStats) {
      newStats[key] = clamp(newStats[key] + val)
    }
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
  job: 'Student',
  eventLog: [],
  isAlive: true,
  deathCause: '',
  activitiesThisTurn: 0,
  maxActivities: 3,
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
      const newAge = prev.age + 1
      const { events, death } = getRandomEvents({ ...prev, age: newAge })

      let newStats = { ...prev.stats }
      let newMoney = prev.money
      const newLog = [...prev.eventLog]

      // Natural stat drift by age
      if (newAge > 50) {
        newStats.health = clamp(newStats.health - 1)
        newStats.looks = clamp(newStats.looks - 1)
      }
      if (newAge > 70) {
        newStats.health = clamp(newStats.health - 2)
      }

      // Process random events
      for (const event of events) {
        const result = applyStatChanges(newStats, newMoney, event.statChanges || {})
        newStats = result.stats
        newMoney = result.money
        newLog.push({ text: event.text, type: event.type, age: newAge })
      }

      // Auto-update job
      const newJob = newAge >= 60 ? 'Retired' : prev.job === 'Student' && newAge >= 22
        ? getDefaultJob(newAge, newStats.smarts)
        : prev.job === 'Student' && newAge >= 18
          ? 'Junior Employee'
          : prev.job

      if (death.isDead) {
        if (death.text) newLog.push({ text: death.text, type: 'bad', age: newAge })
        return {
          ...prev,
          age: newAge,
          stats: newStats,
          money: newMoney,
          job: newJob,
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
        job: newJob,
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

      const { stats: newStats, money: newMoney } = applyStatChanges(
        prev.stats, prev.money, result.statChanges || {}
      )

      return {
        ...prev,
        stats: newStats,
        money: newMoney,
        activitiesThisTurn: prev.activitiesThisTurn + 1,
        eventLog: [...prev.eventLog, { text: result.message, type: result.type || 'activity', age: prev.age }],
      }
    })
  }

  function restart() {
    setGame(INITIAL_STATE)
  }

  if (game.screen === 'creation') {
    return <CharacterCreation onStart={startGame} />
  }

  if (game.screen === 'gameover') {
    return <GameOver character={game} onRestart={restart} />
  }

  return <Dashboard character={game} onAgeUp={ageUp} onActivity={doActivity} />
}
