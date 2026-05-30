const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min

export const CRIMINAL_RANKS = [
  { title: 'Small-time Thug',   minLevel: 0  },
  { title: 'Street Criminal',   minLevel: 3  },
  { title: 'Gang Member',       minLevel: 8  },
  { title: 'Gang Lieutenant',   minLevel: 15 },
  { title: 'Crime Boss',        minLevel: 25 },
  { title: 'Cartel Leader',     minLevel: 40 },
]

export function getCriminalRank(crimeXP) {
  return [...CRIMINAL_RANKS].reverse().find(r => crimeXP >= r.minLevel) || CRIMINAL_RANKS[0]
}

export const HEAT_LABELS = [
  { max: 20,  label: 'Clean',            emoji: '😇', color: '#4CAF50' },
  { max: 40,  label: 'Person of Interest', emoji: '🤨', color: '#8BC34A' },
  { max: 60,  label: 'Wanted',           emoji: '😬', color: '#FF9800' },
  { max: 80,  label: 'High Priority',    emoji: '😰', color: '#FF5722' },
  { max: 101, label: 'Most Wanted',      emoji: '🚨', color: '#F44336' },
]

export function getHeatInfo(heat) {
  return HEAT_LABELS.find(h => heat < h.max) || HEAT_LABELS[HEAT_LABELS.length - 1]
}

export function getArrestChance(heat) {
  if (heat < 25) return 0
  if (heat < 50) return 0.06
  if (heat < 70) return 0.14
  if (heat < 85) return 0.25
  return 0.42
}

export const CRIME_ACTIVITIES = [
  {
    id: 'pickpocket',
    name: 'Pickpocket',
    emoji: '👛',
    description: 'Steal from unsuspecting people',
    minAge: 12,
    minCrimeXP: 0,
    baseReward: [50, 250],
    heatGain: [2, 5],
    successBase: 0.80,
    caughtFine: [200, 500],
    prisonYears: 0,
    xpGain: 1,
  },
  {
    id: 'shoplift',
    name: 'Shoplift',
    emoji: '🛒',
    description: 'Five-finger discount at the shops',
    minAge: 13,
    minCrimeXP: 0,
    baseReward: [100, 600],
    heatGain: [3, 7],
    successBase: 0.75,
    caughtFine: [300, 800],
    prisonYears: 0,
    xpGain: 1,
  },
  {
    id: 'drug_deal',
    name: 'Drug Deal',
    emoji: '💊',
    description: 'Move product on the streets',
    minAge: 15,
    minCrimeXP: 2,
    baseReward: [400, 2000],
    heatGain: [5, 12],
    successBase: 0.70,
    caughtFine: [1000, 3000],
    prisonYears: [1, 3],
    xpGain: 2,
  },
  {
    id: 'car_theft',
    name: 'Car Theft',
    emoji: '🚗',
    description: 'Boost rides and sell them',
    minAge: 16,
    minCrimeXP: 3,
    baseReward: [800, 4000],
    heatGain: [6, 14],
    successBase: 0.65,
    caughtFine: [2000, 5000],
    prisonYears: [1, 2],
    xpGain: 2,
  },
  {
    id: 'burglary',
    name: 'Burglary',
    emoji: '🏠',
    description: 'Break into homes while owners are away',
    minAge: 16,
    minCrimeXP: 5,
    baseReward: [1500, 8000],
    heatGain: [8, 18],
    successBase: 0.60,
    caughtFine: [3000, 8000],
    prisonYears: [1, 4],
    xpGain: 3,
  },
  {
    id: 'fraud',
    name: 'Fraud / Scam',
    emoji: '🎰',
    description: 'Con people out of their money',
    minAge: 18,
    minCrimeXP: 5,
    baseReward: [2000, 10000],
    heatGain: [6, 15],
    successBase: 0.65,
    smartsBonus: true,
    caughtFine: [5000, 15000],
    prisonYears: [1, 5],
    xpGain: 3,
  },
  {
    id: 'hacking',
    name: 'Cybercrime',
    emoji: '💻',
    description: 'Hack systems and steal data',
    minAge: 16,
    minCrimeXP: 8,
    baseReward: [3000, 15000],
    heatGain: [5, 12],
    successBase: 0.60,
    smartsBonus: true,
    caughtFine: [8000, 25000],
    prisonYears: [2, 6],
    xpGain: 4,
  },
  {
    id: 'armed_robbery',
    name: 'Armed Robbery',
    emoji: '🔫',
    description: 'High risk, high reward',
    minAge: 17,
    minCrimeXP: 10,
    baseReward: [5000, 25000],
    heatGain: [15, 30],
    successBase: 0.52,
    caughtFine: [5000, 10000],
    prisonYears: [3, 8],
    xpGain: 5,
    healthRisk: true,
  },
  {
    id: 'kidnapping',
    name: 'Kidnapping',
    emoji: '🪤',
    description: 'Seize and ransom for big money',
    minAge: 20,
    minCrimeXP: 20,
    baseReward: [20000, 80000],
    heatGain: [25, 45],
    successBase: 0.45,
    caughtFine: [0, 0],
    prisonYears: [8, 20],
    xpGain: 8,
  },
  {
    id: 'heist',
    name: 'Bank Heist',
    emoji: '🏦',
    description: 'Plan and execute the perfect robbery',
    minAge: 22,
    minCrimeXP: 30,
    baseReward: [50000, 300000],
    heatGain: [30, 60],
    successBase: 0.38,
    caughtFine: [0, 0],
    prisonYears: [10, 25],
    xpGain: 12,
    healthRisk: true,
  },
  {
    id: 'contract_kill',
    name: 'Contract Killing',
    emoji: '🔪',
    description: 'Eliminate targets for hire',
    minAge: 21,
    minCrimeXP: 35,
    baseReward: [30000, 150000],
    heatGain: [30, 55],
    successBase: 0.40,
    caughtFine: [0, 0],
    prisonYears: [15, 40],
    xpGain: 10,
    healthRisk: true,
  },
  {
    id: 'money_laundering',
    name: 'Money Laundering',
    emoji: '🧺',
    description: 'Clean your dirty money',
    minAge: 20,
    minCrimeXP: 15,
    baseReward: [5000, 30000],
    heatGain: [-10, -5],
    successBase: 0.70,
    smartsBonus: true,
    caughtFine: [10000, 50000],
    prisonYears: [3, 10],
    xpGain: 4,
    note: 'Lowers heat instead of raising it!',
  },
]

export function getAvailableCrimes(character) {
  return CRIME_ACTIVITIES.filter(c => {
    if (character.age < c.minAge) return false
    if (character.crimeXP < c.minCrimeXP) return false
    return true
  })
}

export function attemptCrime(crimeId, character) {
  const crime = CRIME_ACTIVITIES.find(c => c.id === crimeId)
  if (!crime) return null

  let successRate = crime.successBase
  if (crime.smartsBonus) successRate += (character.stats.smarts - 50) * 0.004
  successRate = Math.max(0.1, Math.min(0.92, successRate))

  const success = Math.random() < successRate

  if (success) {
    const reward = rand(crime.baseReward[0], crime.baseReward[1])
    const heatArr = crime.heatGain
    const heat = rand(heatArr[0], heatArr[1])
    const healthLoss = crime.healthRisk ? rand(0, 15) : 0

    return {
      success: true,
      money: reward,
      heatChange: heat,
      xpGain: crime.xpGain,
      healthLoss,
      message: successMessage(crime, reward),
      type: 'good',
      weekCost: 1,
    }
  } else {
    const fine = Array.isArray(crime.caughtFine) ? rand(crime.caughtFine[0], crime.caughtFine[1]) : 0
    const prisonYears = Array.isArray(crime.prisonYears)
      ? (crime.prisonYears[1] > 0 ? rand(crime.prisonYears[0], crime.prisonYears[1]) : 0)
      : 0

    return {
      success: false,
      money: -fine,
      heatChange: rand(5, 15),
      xpGain: Math.floor(crime.xpGain / 2),
      healthLoss: crime.healthRisk ? rand(5, 25) : 0,
      prisonYears,
      message: failMessage(crime, fine, prisonYears),
      type: 'bad',
      weekCost: 1,
    }
  }
}

function successMessage(crime, reward) {
  const msgs = {
    pickpocket:     `You slipped someone's wallet out of their pocket. +€${reward.toLocaleString()} 👛`,
    shoplift:       `You walked out of the store without paying. Score: €${reward.toLocaleString()} 🛒`,
    drug_deal:      `The deal went smoothly. Pocketed €${reward.toLocaleString()} 💊`,
    car_theft:      `You boosted a sweet ride and sold it. €${reward.toLocaleString()} richer 🚗`,
    burglary:       `Empty house, full pockets. You made off with €${reward.toLocaleString()} 🏠`,
    fraud:          `Your scam worked perfectly. Victims are €${reward.toLocaleString()} poorer 🎰`,
    hacking:        `You breached the system and transferred €${reward.toLocaleString()} 💻`,
    armed_robbery:  `Everyone hit the floor. You walked out with €${reward.toLocaleString()} 🔫`,
    kidnapping:     `Ransom paid in full: €${reward.toLocaleString()} 🪤`,
    heist:          `FLAWLESS. €${reward.toLocaleString()} straight from the vault! 🏦`,
    contract_kill:  `Target eliminated. Payment received: €${reward.toLocaleString()} 🔪`,
    money_laundering: `The money is clean. €${reward.toLocaleString()} legitimized, heat reduced 🧺`,
  }
  return msgs[crime.id] || `Crime succeeded! +€${reward.toLocaleString()}`
}

function failMessage(crime, fine, prison) {
  const base = {
    pickpocket:     'You got caught pickpocketing! 🚨',
    shoplift:       'The store security grabbed you. 🚨',
    drug_deal:      'It was a sting operation! 🚨',
    car_theft:      'Caught red-handed boosting the car! 🚨',
    burglary:       'The owner came home early. Busted! 🚨',
    fraud:          'Your scam was traced back to you. 🚨',
    hacking:        'Cybercrime unit tracked your IP. 🚨',
    armed_robbery:  'The police were waiting outside. Ambush! 🚨',
    kidnapping:     'Ransom was a trap. FBI swarmed in! 🚨',
    heist:          'Dye pack exploded. Surrounded by police! 🚨',
    contract_kill:  'The target was protected. You got shot! 🚨',
    money_laundering: 'The laundering scheme was detected by tax authorities. 🚨',
  }
  let msg = base[crime.id] || 'You got caught! 🚨'
  if (fine > 0) msg += ` Fine: €${fine.toLocaleString()}.`
  if (prison > 0) msg += ` Sentenced to ${prison} year${prison > 1 ? 's' : ''} in prison.`
  return msg
}
