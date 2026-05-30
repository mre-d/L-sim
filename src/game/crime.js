const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min

// XP needed to level up
export function xpToNextLevel(crimeLevel) {
  return crimeLevel * 10
}

export const CRIME_LEVEL_NAMES = [
  '',
  'Petty Thief',      // 1-2
  'Petty Thief',
  'Street Criminal',  // 3-5
  'Street Criminal',
  'Street Criminal',
  'Gang Member',      // 6-8
  'Gang Member',
  'Gang Member',
  'Enforcer',         // 9-11
  'Enforcer',
  'Enforcer',
  'Crime Boss',       // 12-14
  'Crime Boss',
  'Crime Boss',
  'Underboss',        // 15-16
  'Underboss',
  'Cartel Leader',    // 17-19
  'Cartel Leader',
  'Cartel Leader',
  '👑 Kingpin',       // 20
]

// successRate = baseSuccess + (crimeLevel - unlockLevel) * 3, capped at 95%
// Higher level = better criminal = higher success = harder to catch
export function getSuccessRate(crime, crimeLevel) {
  const levelsAbove = Math.max(0, crimeLevel - crime.unlockLevel)
  return Math.min(95, crime.baseSuccess + levelsAbove * 3)
}

// Reward scales with levels above unlock
export function getRewardRange(crime, crimeLevel) {
  const mult = 1 + Math.max(0, crimeLevel - crime.unlockLevel) * 0.08
  return [Math.floor(crime.baseReward[0] * mult), Math.floor(crime.baseReward[1] * mult)]
}

export const CRIMES = [
  {
    id: 'pickpocket',
    name: 'Pickpocket',
    emoji: '👛',
    description: 'Slip wallets from strangers',
    unlockLevel: 1,
    baseSuccess: 40,      // 40% success at level 1 → max 95% at level ~19
    baseReward: [30, 150],
    xpOnSuccess: 1,
    prison: [0, 0],
    fine: [50, 200],
    minAge: 12,
  },
  {
    id: 'shoplift',
    name: 'Shoplift',
    emoji: '🛒',
    description: 'Five-finger discount',
    unlockLevel: 2,
    baseSuccess: 35,
    baseReward: [80, 400],
    xpOnSuccess: 1,
    prison: [0, 0],
    fine: [100, 500],
    minAge: 13,
  },
  {
    id: 'vandalism',
    name: 'Vandalism',
    emoji: '🪣',
    description: 'Damage property for kicks',
    unlockLevel: 2,
    baseSuccess: 45,
    baseReward: [0, 0],
    xpOnSuccess: 1,
    statBonus: { happiness: 5 },
    prison: [0, 0],
    fine: [200, 600],
    minAge: 12,
  },
  {
    id: 'drug_deal',
    name: 'Drug Deal',
    emoji: '💊',
    description: 'Move product on the streets',
    unlockLevel: 4,
    baseSuccess: 38,
    baseReward: [300, 1500],
    xpOnSuccess: 2,
    prison: [1, 2],
    fine: [500, 2000],
    minAge: 15,
  },
  {
    id: 'car_theft',
    name: 'Car Theft',
    emoji: '🚗',
    description: 'Boost rides and sell them',
    unlockLevel: 5,
    baseSuccess: 35,
    baseReward: [800, 4000],
    xpOnSuccess: 2,
    prison: [1, 2],
    fine: [1000, 3000],
    minAge: 16,
  },
  {
    id: 'burglary',
    name: 'Burglary',
    emoji: '🏠',
    description: 'Break into homes',
    unlockLevel: 6,
    baseSuccess: 32,
    baseReward: [1500, 8000],
    xpOnSuccess: 3,
    prison: [1, 3],
    fine: [2000, 6000],
    minAge: 16,
  },
  {
    id: 'fraud',
    name: 'Fraud',
    emoji: '🎭',
    description: 'Con people out of their money',
    unlockLevel: 7,
    baseSuccess: 38,
    baseReward: [2000, 12000],
    xpOnSuccess: 3,
    prison: [1, 4],
    fine: [3000, 10000],
    smartsBonus: true,
    minAge: 18,
  },
  {
    id: 'hacking',
    name: 'Cybercrime',
    emoji: '💻',
    description: 'Hack systems for money',
    unlockLevel: 8,
    baseSuccess: 42,
    baseReward: [3000, 18000],
    xpOnSuccess: 3,
    prison: [2, 5],
    fine: [5000, 20000],
    smartsBonus: true,
    minAge: 16,
  },
  {
    id: 'armed_robbery',
    name: 'Armed Robbery',
    emoji: '🔫',
    description: 'High risk, high reward',
    unlockLevel: 10,
    baseSuccess: 28,
    baseReward: [5000, 25000],
    xpOnSuccess: 4,
    prison: [3, 8],
    fine: [0, 0],
    healthRisk: true,
    minAge: 17,
  },
  {
    id: 'money_laundering',
    name: 'Launder Money',
    emoji: '🧺',
    description: 'Clean cash, lower your heat',
    unlockLevel: 11,
    baseSuccess: 45,
    baseReward: [1000, 8000],
    xpOnSuccess: 3,
    prison: [2, 6],
    fine: [0, 0],
    reducesHeat: true,
    smartsBonus: true,
    minAge: 20,
  },
  {
    id: 'kidnapping',
    name: 'Kidnapping',
    emoji: '🪤',
    description: 'Seize and demand ransom',
    unlockLevel: 13,
    baseSuccess: 25,
    baseReward: [15000, 80000],
    xpOnSuccess: 5,
    prison: [8, 20],
    fine: [0, 0],
    minAge: 20,
  },
  {
    id: 'heist',
    name: 'Bank Heist',
    emoji: '🏦',
    description: 'Rob a bank — the big one',
    unlockLevel: 15,
    baseSuccess: 22,
    baseReward: [50000, 300000],
    xpOnSuccess: 7,
    prison: [10, 25],
    fine: [0, 0],
    healthRisk: true,
    minAge: 22,
  },
  {
    id: 'contract_kill',
    name: 'Contract Kill',
    emoji: '🔪',
    description: 'Eliminate targets for hire',
    unlockLevel: 17,
    baseSuccess: 25,
    baseReward: [25000, 150000],
    xpOnSuccess: 6,
    prison: [15, 40],
    fine: [0, 0],
    healthRisk: true,
    minAge: 21,
  },
  {
    id: 'drug_empire',
    name: 'Drug Empire',
    emoji: '🏭',
    description: 'Run your own operation',
    unlockLevel: 19,
    baseSuccess: 30,
    baseReward: [80000, 500000],
    xpOnSuccess: 8,
    prison: [20, 40],
    fine: [0, 0],
    minAge: 25,
  },
]

export function getAvailableCrimes(crimeLevel, age) {
  return CRIMES.filter(c => crimeLevel >= c.unlockLevel && age >= c.minAge)
}

export function getLockedCrimes(crimeLevel, age) {
  return CRIMES.filter(c => crimeLevel < c.unlockLevel && age >= (c.minAge || 0))
    .sort((a, b) => a.unlockLevel - b.unlockLevel)
    .slice(0, 3) // show next 3 locked crimes
}

export function attemptCrime(crimeId, character) {
  const crime = CRIMES.find(c => c.id === crimeId)
  if (!crime) return null

  let successRate = getSuccessRate(crime, character.crimeLevel)
  // Smarts bonus for certain crimes
  if (crime.smartsBonus) {
    successRate = Math.min(95, successRate + Math.floor((character.stats.smarts - 50) / 5))
  }

  const success = Math.random() * 100 < successRate

  if (success) {
    const [minR, maxR] = getRewardRange(crime, character.crimeLevel)
    const reward = minR === 0 ? 0 : rand(minR, maxR)
    const heatChange = crime.reducesHeat ? -rand(5, 15) : rand(3, 10)

    return {
      success: true,
      money: reward,
      heatChange,
      xpGain: crime.xpOnSuccess,
      healthLoss: 0,
      statBonus: crime.statBonus || null,
      successRate: Math.round(successRate),
      message: buildSuccessMsg(crime, reward),
      type: 'good',
      weekCost: 1,
    }
  } else {
    const fine = crime.fine[1] > 0 ? rand(crime.fine[0], crime.fine[1]) : 0
    const prisonYears = crime.prison[1] > 0 ? rand(crime.prison[0], crime.prison[1]) : 0
    const healthLoss = crime.healthRisk ? rand(5, 20) : 0

    return {
      success: false,
      money: -fine,
      heatChange: rand(10, 25),
      xpGain: 0,
      healthLoss,
      prisonYears,
      successRate: Math.round(successRate),
      message: buildFailMsg(crime, fine, prisonYears),
      type: 'bad',
      weekCost: 1,
    }
  }
}

function buildSuccessMsg(crime, reward) {
  const moneyStr = reward > 0 ? ` +€${reward.toLocaleString()}` : ''
  const msgs = {
    pickpocket:      `Wallet lifted without a trace.${moneyStr} 👛`,
    shoplift:        `Walked out clean.${moneyStr} 🛒`,
    vandalism:       `Left your mark on the city. +happiness 🪣`,
    drug_deal:       `Deal went smoothly.${moneyStr} 💊`,
    car_theft:       `Boosted and sold without issues.${moneyStr} 🚗`,
    burglary:        `House was empty — jackpot.${moneyStr} 🏠`,
    fraud:           `Scam worked perfectly.${moneyStr} 🎭`,
    hacking:         `Funds transferred successfully.${moneyStr} 💻`,
    armed_robbery:   `Everyone hit the floor. Walked out clean.${moneyStr} 🔫`,
    money_laundering:`Money is clean. Heat reduced. 🧺`,
    kidnapping:      `Ransom paid in full.${moneyStr} 🪤`,
    heist:           `FLAWLESS execution.${moneyStr} straight from the vault! 🏦`,
    contract_kill:   `Target eliminated. Payment received.${moneyStr} 🔪`,
    drug_empire:     `Empire running smooth.${moneyStr} this week 🏭`,
  }
  return msgs[crime.id] || `Crime succeeded!${moneyStr}`
}

function buildFailMsg(crime, fine, prison) {
  const base = {
    pickpocket:      'Caught pickpocketing! 🚨',
    shoplift:        'Store security grabbed you. 🚨',
    vandalism:       'Cop caught you in the act. 🚨',
    drug_deal:       'It was a sting operation! 🚨',
    car_theft:       'CCTV footage exposed you. 🚨',
    burglary:        'Owner came home early — busted! 🚨',
    fraud:           'Scheme was traced back to you. 🚨',
    hacking:         'Cybercrime unit tracked your IP. 🚨',
    armed_robbery:   'Police ambush outside the door! 🚨',
    money_laundering:'Tax authority flagged the transaction. 🚨',
    kidnapping:      'Ransom handoff was a trap! 🚨',
    heist:           'Dye pack exploded. Police swarmed in! 🚨',
    contract_kill:   'Target was protected — you got shot! 🚨',
    drug_empire:     'DEA raid on your entire operation! 🚨',
  }
  let msg = base[crime.id] || 'Caught! 🚨'
  if (fine > 0) msg += ` Fine: €${fine.toLocaleString()}.`
  if (prison > 0) msg += ` ${prison} year${prison > 1 ? 's' : ''} in prison.`
  return msg
}

export function getHeatLabel(heat) {
  if (heat < 20) return { label: 'Clean',              emoji: '😇', color: '#4CAF50' }
  if (heat < 40) return { label: 'Person of Interest', emoji: '🤨', color: '#8BC34A' }
  if (heat < 60) return { label: 'Wanted',             emoji: '😬', color: '#FF9800' }
  if (heat < 80) return { label: 'High Priority',      emoji: '😰', color: '#FF5722' }
  return             { label: 'Most Wanted',            emoji: '🚨', color: '#F44336' }
}

export function getArrestChance(heat) {
  if (heat < 25) return 0
  if (heat < 50) return 0.06
  if (heat < 70) return 0.14
  if (heat < 85) return 0.25
  return 0.42
}
