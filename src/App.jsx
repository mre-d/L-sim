import { useState } from 'react'
import CharacterCreation from './components/CharacterCreation'
import Dashboard from './components/Dashboard'
import GameOver from './components/GameOver'
import CrimeResultModal from './components/CrimeResultModal'
import { getRandomEvents } from './game/events'
import { performActivity } from './game/activities'
import { getCareerById, canPromote } from './game/careers'
import { attemptCrime, xpToNextLevel, CRIMES, getSuccessFlavor } from './game/crime'

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
  collegeMajor: null,
  completedDegrees: [],
  enrolledDegree: null,
  middleSchoolProgress: 0,
  highSchoolProgress: 0,
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
  crimeLevel: 1,
  crimeXP: 0,
  criminalRecord: 0,
  inPrison: false,
  prisonWeeksLeft: 0,
  totalCrimeEarnings: 0,
  warnedCrimes: {},
  pendingCrimeResult: null,
}

// Advances time by 1 week. Handles month + year transitions.
function tickWeek(prev, extraLog = []) {
  let newWeek = prev.week + 1
  let newMonth = prev.month
  let newAge = prev.age
  let newStats = { ...prev.stats }
  let newMoney = prev.money
  let newLog = [...prev.eventLog, ...extraLog]
  let newPrison = prev.inPrison
  let prisonWeeks = prev.prisonWeeksLeft
  let newPerformance = prev.jobPerformance
  let newYearsAtJob = prev.yearsAtJob
  let newEducation = prev.education
  let newCollegeMajor = prev.collegeMajor
  let newCompletedDegrees = prev.completedDegrees || []
  let newEnrolledDegree = prev.enrolledDegree
  let newCareerPathId = prev.careerPathId
  let newCareerLevel = prev.careerLevel
  let newAnnualSalary = prev.annualSalary

  // Prison countdown (every week)
  if (newPrison) {
    prisonWeeks -= 1
    newStats.happiness = clamp(newStats.happiness - 1)
    if (prisonWeeks <= 0) {
      newPrison = false
      prisonWeeks = 0
      newLog.push({ text: '🔓 Released from prison. Fresh start!', type: 'neutral', age: prev.age })
    }
  }

  // Month advances every 4 weeks
  if (newWeek % 4 === 0) {
    newMonth = (newMonth + 1) % 12
  }

  // Year boundary
  if (newWeek > 52) {
    newWeek = 1
    newAge = prev.age + 1

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

    // Career performance drift
    if (newCareerPathId) {
      newPerformance = clamp(newPerformance + rand(-8, 12) + (newStats.smarts > 50 ? 2 : -2))
    }

    // College / Masters progress
    if (newEnrolledDegree) {
      const yearsLeft = newEnrolledDegree.yearsLeft - 1
      if (yearsLeft <= 0) {
        const prefix = newEnrolledDegree.level === 'masters' ? 'Masters' : "Bachelor's"
        const degreeName = `${prefix} - ${newEnrolledDegree.major}`
        newCompletedDegrees = [...newCompletedDegrees, degreeName]
        if (newEnrolledDegree.level === 'bachelor') { newEducation = "Bachelor's"; newCollegeMajor = newEnrolledDegree.major }
        else newEducation = "Master's"
        newLog.push({ text: `🎓 Graduated! ${degreeName} earned.`, type: 'good', age: newAge })
        newEnrolledDegree = null
      } else {
        newEnrolledDegree = { ...newEnrolledDegree, yearsLeft }
        newLog.push({ text: `📚 ${newEnrolledDegree.major}: ${yearsLeft} year${yearsLeft !== 1 ? 's' : ''} left`, type: 'neutral', age: newAge })
      }
    }

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
        collegeMajor: newCollegeMajor, completedDegrees: newCompletedDegrees, enrolledDegree: newEnrolledDegree,
        jobPerformance: newPerformance,
        careerPathId: newCareerPathId, careerLevel: newCareerLevel,
        yearsAtJob: newYearsAtJob, annualSalary: newAnnualSalary,
        inPrison: newPrison, prisonWeeksLeft: prisonWeeks,
        eventLog: newLog.slice(-60),
        isAlive: false, deathCause: death.cause, screen: 'gameover',
      }
    }
  }

  return {
    ...prev,
    age: newAge, week: newWeek, month: newMonth,
    stats: newStats, money: newMoney, education: newEducation,
    jobPerformance: newPerformance,
    careerPathId: newCareerPathId, careerLevel: newCareerLevel,
    yearsAtJob: newYearsAtJob, annualSalary: newAnnualSalary,
    inPrison: newPrison, prisonWeeksLeft: prisonWeeks,
    eventLog: newLog.slice(-60),
  }
}

export default function App() {
  const [game, setGame] = useState(INITIAL_STATE)

  function startGame({ name, gender, country, lifeStart }) {
    const isYoungAdult = lifeStart === 'youngAdult'
    setGame({
      ...INITIAL_STATE,
      screen: 'game', name, gender, country,
      age: isYoungAdult ? 18 : 12,
      money: isYoungAdult ? 1000 : 500,
      education: isYoungAdult ? 'High School' : 'None',
      middleSchoolProgress: isYoungAdult ? 75 : 0,
      highSchoolProgress: isYoungAdult ? 100 : 0,
      completedDegrees: isYoungAdult ? ['Middle School', 'High School'] : [],
      eventLog: [{
        text: isYoungAdult
          ? `${name} is 18 in ${country}. Adult life begins! 🧑`
          : `${name} is 12 in ${country}. Life begins! 🌱`,
        type: 'good',
        age: isYoungAdult ? 18 : 12,
      }],
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

      const crime = CRIMES.find(c => c.id === crimeId)

      // Warning system: first offence for small crimes = fine only, no prison
      let isWarning = false
      let effectivePrisonWeeks = result.prisonWeeks || 0
      let newWarnedCrimes = prev.warnedCrimes || {}
      if (!result.success && crime?.warnFirst && !newWarnedCrimes[crimeId]) {
        isWarning = true
        effectivePrisonWeeks = 0
        newWarnedCrimes = { ...newWarnedCrimes, [crimeId]: true }
      }

      const statChanges = { money: result.money }
      if (result.healthLoss) statChanges.health = -result.healthLoss
      if (result.statBonus) Object.assign(statChanges, result.statBonus)

      const { stats: newStats, money: newMoney } = applyChanges(prev.stats, prev.money, statChanges)

      // XP and leveling
      let newXP = prev.crimeXP + (result.xpGain || 0)
      let newCrimeLevel = prev.crimeLevel
      const crimeLog = [{ text: result.message, type: result.type, age: prev.age }]

      while (newCrimeLevel < 20 && newXP >= xpToNextLevel(newCrimeLevel)) {
        newXP -= xpToNextLevel(newCrimeLevel)
        newCrimeLevel += 1
        crimeLog.push({ text: `🔓 Crime level up! Now level ${newCrimeLevel}!`, type: 'good', age: prev.age })
      }

      let newPrisonActive = prev.inPrison
      let prisonWks = prev.prisonWeeksLeft
      let newRecord = prev.criminalRecord
      let newTotal = prev.totalCrimeEarnings
      if (result.success) {
        newTotal += Math.max(0, result.money)
      } else if (effectivePrisonWeeks > 0) {
        newPrisonActive = true
        prisonWks = effectivePrisonWeeks
        newRecord += 1
      }

      // Build popup data
      const pendingCrimeResult = {
        success: result.success,
        isWarning,
        crimeId,
        crimeName: crime?.name,
        crimeEmoji: crime?.emoji,
        money: result.money,
        xpGain: result.xpGain || 0,
        prisonWeeks: effectivePrisonWeeks,
        healthLoss: result.healthLoss || 0,
        flavorText: result.success ? getSuccessFlavor(crimeId) : null,
        rawMessage: result.message,
      }

      const updated = {
        ...prev, stats: newStats, money: newMoney,
        crimeLevel: newCrimeLevel, crimeXP: newXP,
        criminalRecord: newRecord, inPrison: newPrisonActive,
        prisonWeeksLeft: prisonWks, totalCrimeEarnings: newTotal,
        warnedCrimes: newWarnedCrimes,
        pendingCrimeResult,
      }
      return tickWeek(updated, crimeLog)
    })
  }

  const PRISON_CHORES = {
    chores:   { stat: { happiness: 3 }, msg: '🧹 Cell is spotless. Small comfort. +happiness' },
    kitchen:  { stat: { money: 50 },    msg: '🍳 Kitchen work pays a little. +€50' },
    exercise: { stat: { health: 4 },    msg: '🏋️ Stayed in shape. +health' },
    study:    { stat: { smarts: 2 },    msg: '📚 Used the prison library. +smarts' },
    network:  { crimeXP: 10,            msg: '🤝 Made connections inside. +10 crime XP' },
  }

  function doPrisonChore(choreId) {
    setGame(prev => {
      if (!prev.inPrison) return prev
      const chore = PRISON_CHORES[choreId]
      if (!chore) return prev

      let newCrimeXP = prev.crimeXP
      let newCrimeLevel = prev.crimeLevel
      const { stats: newStats, money: newMoney } = applyChanges(prev.stats, prev.money, chore.stat || {})

      if (chore.crimeXP) {
        newCrimeXP += chore.crimeXP
        while (newCrimeLevel < 20 && newCrimeXP >= xpToNextLevel(newCrimeLevel)) {
          newCrimeXP -= xpToNextLevel(newCrimeLevel)
          newCrimeLevel += 1
        }
      }

      const log = [{ text: chore.msg, type: 'activity', age: prev.age }]
      return tickWeek({ ...prev, stats: newStats, money: newMoney, crimeXP: newCrimeXP, crimeLevel: newCrimeLevel }, log)
    })
  }

  function doStudySchool(school) {
    setGame(prev => {
      const targets = { middleSchool: 75, highSchool: 100 }
      const target = targets[school]
      const progressKey = `${school}Progress`
      const current = prev[progressKey] || 0
      if (current >= target) return prev
      if (school === 'highSchool' && (prev.middleSchoolProgress || 0) < 75) return prev

      const newProgress = current + 1
      const updates = { [progressKey]: newProgress }
      const log = []

      if (newProgress >= target) {
        const name = school === 'middleSchool' ? 'Middle School' : 'High School'
        updates.completedDegrees = [...(prev.completedDegrees || []), name]
        if (school === 'middleSchool' && prev.education === 'None') updates.education = 'Middle School'
        if (school === 'highSchool') updates.education = 'High School'
        log.push({ text: `🎓 ${name} completed!`, type: 'good', age: prev.age })
      }

      return tickWeek({ ...prev, ...updates }, log)
    })
  }

  function doEnrollSchool(level, major, cost, years) {
    setGame(prev => {
      if (prev.enrolledDegree) return prev
      if (prev.money < cost) return prev
      const log = [{ text: `📚 Enrolled in ${level === 'masters' ? "Masters" : "Bachelor's"} — ${major}. ${years} years ahead!`, type: 'good', age: prev.age }]
      const updated = { ...prev, money: prev.money - cost, enrolledDegree: { level, major, yearsLeft: years, totalYears: years } }
      return tickWeek(updated, log)
    })
  }

  function clearCrimeResult() {
    setGame(prev => ({ ...prev, pendingCrimeResult: null }))
  }

  function restart() { setGame(INITIAL_STATE) }

  if (game.screen === 'creation') return <CharacterCreation onStart={startGame} />
  if (game.screen === 'gameover') return <GameOver character={game} onRestart={restart} />

  return (
    <>
      <Dashboard
        character={game}
        onSkipWeek={skipWeek}
        onActivity={doActivity}
        onCareerAction={doCareerAction}
        onCrimeActivity={doCrimeActivity}
        onPrisonChore={doPrisonChore}
        onEnrollSchool={doEnrollSchool}
        onStudySchool={doStudySchool}
      />
      {game.pendingCrimeResult && (
        <CrimeResultModal result={game.pendingCrimeResult} onClose={clearCrimeResult} />
      )}
    </>
  )
}
