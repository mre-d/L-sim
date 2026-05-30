const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min

export const ACTIVITIES = [
  {
    id: 'study',
    label: 'Study',
    emoji: '📚',
    description: 'Hit the books and get smarter',
    minAge: 5,
    maxAge: 25,
    perform: (character) => {
      const gain = rand(5, 15)
      return {
        statChanges: { smarts: gain },
        message: `You studied hard and feel ${gain >= 10 ? 'much' : ''} smarter! 📚`,
        type: 'good',
      }
    },
  },
  {
    id: 'exercise',
    label: 'Exercise',
    emoji: '🏋️',
    description: 'Work out for health and looks',
    minAge: 6,
    maxAge: 999,
    perform: (character) => {
      const healthGain = rand(5, 10)
      const looksGain = rand(2, 5)
      return {
        statChanges: { health: healthGain, looks: looksGain },
        message: `Great workout! You feel energized and look better. 💪`,
        type: 'good',
      }
    },
  },
  {
    id: 'meditate',
    label: 'Meditate',
    emoji: '🧘',
    description: 'Find your inner peace',
    minAge: 10,
    maxAge: 999,
    perform: (character) => {
      const gain = rand(5, 15)
      return {
        statChanges: { happiness: gain },
        message: `You meditated for an hour and feel at peace. 🧘`,
        type: 'good',
      }
    },
  },
  {
    id: 'work_harder',
    label: 'Work Harder',
    emoji: '💼',
    description: 'Put in extra hours for more money',
    minAge: 16,
    maxAge: 70,
    requiresJob: true,
    perform: (character) => {
      const gain = rand(500, 2000)
      const happinessLoss = rand(2, 6)
      return {
        statChanges: { money: gain, happiness: -happinessLoss },
        message: `You worked overtime and earned €${gain.toLocaleString()}. Exhausting but worth it! 💰`,
        type: 'good',
      }
    },
  },
  {
    id: 'doctor',
    label: 'Visit Doctor',
    emoji: '🏥',
    description: 'Get a checkup (costs €200)',
    minAge: 0,
    maxAge: 999,
    cost: 200,
    perform: (character) => {
      if (character.money < 200) {
        return {
          statChanges: {},
          message: `You can't afford the doctor right now. 😔`,
          type: 'neutral',
        }
      }
      const gain = rand(10, 20)
      return {
        statChanges: { health: gain, money: -200 },
        message: `The doctor gave you a clean bill of health and some advice. +${gain} health! 🩺`,
        type: 'good',
      }
    },
  },
  {
    id: 'socialize',
    label: 'Socialize',
    emoji: '🤝',
    description: 'Spend time with friends',
    minAge: 5,
    maxAge: 999,
    perform: (character) => {
      const gain = rand(5, 12)
      const messages = [
        `You had a great time with friends! 🎉`,
        `You went out for drinks and laughed all night. 🍻`,
        `You threw a dinner party and everyone loved it. 🍽️`,
        `You reconnected with an old friend. 😊`,
      ]
      return {
        statChanges: { happiness: gain },
        message: messages[Math.floor(Math.random() * messages.length)],
        type: 'good',
      }
    },
  },
  {
    id: 'read',
    label: 'Read Books',
    emoji: '📖',
    description: 'Expand your knowledge',
    minAge: 8,
    maxAge: 999,
    perform: (character) => {
      const smarts = rand(3, 8)
      const happiness = rand(2, 5)
      return {
        statChanges: { smarts, happiness },
        message: `You finished an interesting book. Your mind is sharper! 📖`,
        type: 'good',
      }
    },
  },
  {
    id: 'gaming',
    label: 'Play Games',
    emoji: '🎮',
    description: 'Relax with some games',
    minAge: 6,
    maxAge: 999,
    perform: (character) => {
      const gain = rand(3, 10)
      return {
        statChanges: { happiness: gain },
        message: `You had a fun gaming session! 🎮 Life is good.`,
        type: 'good',
      }
    },
  },
  {
    id: 'diet',
    label: 'Eat Healthy',
    emoji: '🥗',
    description: 'Improve health with better diet',
    minAge: 12,
    maxAge: 999,
    perform: (character) => {
      const healthGain = rand(5, 12)
      const looksGain = rand(1, 4)
      return {
        statChanges: { health: healthGain, looks: looksGain },
        message: `You committed to eating healthy this year. Looking and feeling great! 🥗`,
        type: 'good',
      }
    },
  },
  {
    id: 'therapy',
    label: 'Go to Therapy',
    emoji: '🛋️',
    description: 'Work on your mental health (€150)',
    minAge: 16,
    maxAge: 999,
    cost: 150,
    perform: (character) => {
      if (character.money < 150) {
        return {
          statChanges: {},
          message: `You can't afford therapy right now. 😔`,
          type: 'neutral',
        }
      }
      const gain = rand(10, 20)
      return {
        statChanges: { happiness: gain, money: -150 },
        message: `Therapy helped you work through some issues. You feel so much better! 🛋️`,
        type: 'good',
      }
    },
  },
  {
    id: 'invest',
    label: 'Invest Money',
    emoji: '📈',
    description: 'Try your luck in the market',
    minAge: 18,
    maxAge: 999,
    minMoney: 500,
    perform: (character) => {
      if (character.money < 500) {
        return {
          statChanges: {},
          message: `You need at least €500 to invest. Save up first! 💰`,
          type: 'neutral',
        }
      }
      const amount = Math.min(character.money * 0.2, 5000)
      const roll = Math.random()
      if (roll < 0.5) {
        const gain = Math.floor(amount * (rand(10, 50) / 100))
        return {
          statChanges: { money: gain, happiness: 8 },
          message: `Your investment paid off! You earned €${gain.toLocaleString()}! 📈`,
          type: 'good',
        }
      } else if (roll < 0.8) {
        return {
          statChanges: { happiness: 2 },
          message: `Your investment broke even this year. At least you didn't lose! 📊`,
          type: 'neutral',
        }
      } else {
        const loss = Math.floor(amount * (rand(10, 40) / 100))
        return {
          statChanges: { money: -loss, happiness: -5 },
          message: `The market crashed and you lost €${loss.toLocaleString()}. 📉 Ouch.`,
          type: 'bad',
        }
      }
    },
  },
]

export function getAvailableActivities(character) {
  return ACTIVITIES.filter(activity => {
    if (character.age < activity.minAge) return false
    if (character.age > activity.maxAge) return false
    if (activity.requiresJob && character.job === 'Unemployed') return false
    return true
  })
}

export function performActivity(activityId, character) {
  const activity = ACTIVITIES.find(a => a.id === activityId)
  if (!activity) return null
  return activity.perform(character)
}
