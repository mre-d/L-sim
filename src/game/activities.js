const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min

// cost: money required. 0 = free. Shown on the button.
// Each activity costs 1 week regardless.

export const ACTIVITIES = [
  {
    id: 'exercise',
    label: 'Exercise',
    emoji: '🏋️',
    cost: 0,
    allowedInPrison: true,
    minAge: 6,
    perform: (character) => {
      const healthGain = rand(3, 8)
      const looksGain = rand(1, 4)
      return {
        statChanges: { health: healthGain, looks: looksGain },
        message: `Solid workout session. +${healthGain} health, +${looksGain} looks 💪`,
        type: 'good',
      }
    },
  },
  {
    id: 'meditate',
    label: 'Meditate',
    emoji: '🧘',
    cost: 0,
    allowedInPrison: true,
    minAge: 10,
    perform: (character) => {
      const gain = rand(4, 12)
      return {
        statChanges: { happiness: gain },
        message: `You cleared your mind. +${gain} happiness 🧘`,
        type: 'good',
      }
    },
  },
  {
    id: 'read',
    label: 'Read Book',
    emoji: '📖',
    cost: 15,
    allowedInPrison: true,
    minAge: 8,
    perform: (character) => {
      if (character.money < 15) return { statChanges: {}, message: `Can't afford a book. 😔`, type: 'neutral' }
      return {
        statChanges: { smarts: rand(3, 7), happiness: rand(1, 4), money: -15 },
        message: `Finished a great book. Mind is sharper! 📖`,
        type: 'good',
      }
    },
  },
  {
    id: 'study',
    label: 'Study',
    emoji: '📚',
    cost: 0,
    allowedInPrison: true,
    minAge: 5,
    maxAge: 26,
    perform: (character) => {
      const gain = rand(5, 14)
      return {
        statChanges: { smarts: gain },
        message: `You hit the books hard. +${gain} smarts 📚`,
        type: 'good',
      }
    },
  },
  {
    id: 'doctor',
    label: 'Doctor',
    emoji: '🏥',
    cost: 200,
    minAge: 0,
    perform: (character) => {
      if (character.money < 200) return { statChanges: {}, message: `Can't afford the doctor. 😔`, type: 'neutral' }
      const gain = rand(8, 20)
      return {
        statChanges: { health: gain, money: -200 },
        message: `Doctor visit done. +${gain} health 🩺`,
        type: 'good',
      }
    },
  },
  {
    id: 'therapy',
    label: 'Therapy',
    emoji: '🛋️',
    cost: 150,
    minAge: 13,
    perform: (character) => {
      if (character.money < 150) return { statChanges: {}, message: `Can't afford therapy. 😔`, type: 'neutral' }
      const gain = rand(8, 18)
      return {
        statChanges: { happiness: gain, money: -150 },
        message: `Good session. You feel lighter. +${gain} happiness 🛋️`,
        type: 'good',
      }
    },
  },
  {
    id: 'socialize',
    label: 'Go Out',
    emoji: '🎉',
    cost: 60,
    minAge: 12,
    perform: (character) => {
      if (character.money < 60) return { statChanges: {}, message: `Broke — can't go out. 😔`, type: 'neutral' }
      const gain = rand(5, 14)
      const msgs = [
        `Great night out with friends! +${gain} happiness 🎉`,
        `Bar crawl — laughed all night. +${gain} happiness 🍻`,
        `Dinner party at yours. +${gain} happiness 🍽️`,
        `Reconnected with an old friend. +${gain} happiness 😊`,
      ]
      return {
        statChanges: { happiness: gain, money: -60 },
        message: msgs[rand(0, msgs.length - 1)],
        type: 'good',
      }
    },
  },
  {
    id: 'eat_healthy',
    label: 'Eat Healthy',
    emoji: '🥗',
    cost: 80,
    minAge: 12,
    perform: (character) => {
      if (character.money < 80) return { statChanges: {}, message: `Can't afford healthy food. 😔`, type: 'neutral' }
      return {
        statChanges: { health: rand(4, 10), looks: rand(1, 3), money: -80 },
        message: `Meal prepped all week. Feeling great! 🥗`,
        type: 'good',
      }
    },
  },
  {
    id: 'fast_food',
    label: 'Fast Food',
    emoji: '🍔',
    cost: 15,
    minAge: 10,
    perform: (character) => {
      if (character.money < 15) return { statChanges: {}, message: `Even fast food is out of budget. 😔`, type: 'neutral' }
      return {
        statChanges: { happiness: rand(3, 7), health: -rand(2, 6), money: -15 },
        message: `Tasty but not great for you. 🍔`,
        type: 'neutral',
      }
    },
  },
  {
    id: 'work_harder',
    label: 'Overtime',
    emoji: '💼',
    cost: 0,
    minAge: 16,
    requiresJob: true,
    perform: (character) => {
      const base = character.annualSalary > 0 ? character.annualSalary : 18000
      const gain = Math.floor(base * rand(2, 6) / 100)
      return {
        statChanges: { money: gain, happiness: -rand(3, 7) },
        message: `Worked overtime. +€${gain.toLocaleString()} earned 💼`,
        type: 'good',
      }
    },
  },
  {
    id: 'invest',
    label: 'Invest',
    emoji: '📈',
    cost: 500,
    minAge: 18,
    perform: (character) => {
      if (character.money < 500) return { statChanges: {}, message: `Need €500+ to invest. 💰`, type: 'neutral' }
      const amount = Math.min(character.money * 0.15, 10000)
      const roll = Math.random()
      if (roll < 0.48) {
        const gain = Math.floor(amount * rand(10, 55) / 100)
        return { statChanges: { money: gain, happiness: 6 }, message: `Investment paid off! +€${gain.toLocaleString()} 📈`, type: 'good' }
      } else if (roll < 0.75) {
        return { statChanges: { happiness: 1 }, message: `Investment broke even this week. 📊`, type: 'neutral' }
      } else {
        const loss = Math.floor(amount * rand(10, 40) / 100)
        return { statChanges: { money: -loss, happiness: -6 }, message: `Market dipped. Lost €${loss.toLocaleString()} 📉`, type: 'bad' }
      }
    },
  },
  {
    id: 'casino',
    label: 'Casino',
    emoji: '🎰',
    cost: 100,
    minAge: 18,
    perform: (character) => {
      if (character.money < 100) return { statChanges: {}, message: `Not enough to gamble. 🎰`, type: 'neutral' }
      const bet = Math.min(character.money * 0.1, 2000)
      const roll = Math.random()
      if (roll < 0.35) {
        const win = Math.floor(bet * rand(15, 40) / 10)
        return { statChanges: { money: win, happiness: 15 }, message: `You won big at the casino! +€${win.toLocaleString()} 🎰`, type: 'good' }
      } else {
        return { statChanges: { money: -Math.floor(bet), happiness: -8 }, message: `You lost €${Math.floor(bet).toLocaleString()} gambling. 🎲`, type: 'bad' }
      }
    },
  },
  {
    id: 'vacation',
    label: 'Vacation',
    emoji: '✈️',
    cost: 1200,
    minAge: 18,
    perform: (character) => {
      if (character.money < 1200) return { statChanges: {}, message: `Can't afford a vacation right now. ✈️`, type: 'neutral' }
      const gain = rand(15, 30)
      return {
        statChanges: { happiness: gain, health: rand(3, 8), money: -1200 },
        message: `Amazing vacation! Recharged and refreshed. +${gain} happiness ✈️`,
        type: 'good',
      }
    },
  },
  {
    id: 'plastic_surgery',
    label: 'Surgery',
    emoji: '💉',
    cost: 5000,
    minAge: 18,
    perform: (character) => {
      if (character.money < 5000) return { statChanges: {}, message: `Need €5,000 for surgery. 💉`, type: 'neutral' }
      const roll = Math.random()
      if (roll < 0.75) {
        const gain = rand(10, 25)
        return { statChanges: { looks: gain, money: -5000 }, message: `Surgery went well. +${gain} looks 💉`, type: 'good' }
      } else {
        return { statChanges: { health: -rand(5, 15), looks: -rand(2, 8), money: -5000 }, message: `Surgery complications. You don't look great... 😬`, type: 'bad' }
      }
    },
  },
]

export function getAvailableActivities(character) {
  return ACTIVITIES.filter(activity => {
    if (character.inPrison && !activity.allowedInPrison) return false
    if (character.age < (activity.minAge || 0)) return false
    if (activity.maxAge && character.age > activity.maxAge) return false
    if (activity.requiresJob && !character.careerPathId) return false
    return true
  })
}

export function performActivity(activityId, character) {
  const activity = ACTIVITIES.find(a => a.id === activityId)
  if (!activity) return null
  const result = activity.perform(character)
  return { ...result, weekCost: 1, activityLabel: activity.label }
}
