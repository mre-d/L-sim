const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min

const SUCCESS_FLAVORS = {
  pickpocket:          ['Tourist wallet lifted clean', "Phone swiped at the market", "Old man's cash, easy pickings"],
  shoplift:            ['Jacket walked out the door', 'Electronics tucked away nicely', 'Designer perfume, no receipt'],
  mugging:             ['Victim handed over everything 👊', 'Quick grab in the alley, clean exit', 'Nobody saw a thing'],
  drug_deal:           ['3g weed sold to a regular 🌿', '5 pills moved on the corner', 'Small batch delivered, no questions'],
  car_theft:           ['BMW boosted from the lot', 'Keys left inside — your gain', 'Sold to the chop shop no problem'],
  burglary:            ['Empty house, full pockets', 'In and out in 4 minutes ⚡', 'Jewelry box hit the jackpot 💍'],
  fraud:               ['Shell company worked a treat', 'Wire transfer complete', 'Fake invoice cashed out clean'],
  hacking:             ['Bank database cracked 💾', 'Funds rerouted undetected', 'Backdoor access exploited perfectly'],
  extortion:           ['Business paid up without a fight 🤝', 'Monthly protection agreed', 'They know better than to call the cops'],
  armed_robbery:       ['Everyone on the floor 🔫', 'Cashier cooperated nicely', 'In and out, clean escape'],
  money_laundering:    ['Accounts look spotless', 'Shell company did the job', 'Wire cleared, no flags raised'],
  blackmail:           ['Target paid to keep it quiet 📧', 'Leverage worked perfectly', 'They transferred within the hour'],
  kidnapping:          ['Ransom wire received 💸', 'Family paid without calling police', 'Smooth handoff, clean exit'],
  art_theft:           ['Painting lifted from the gallery 🖼️', 'Private collector paid top dollar', 'Alarm bypassed, priceless piece secured'],
  heist:               ['Vault cracked in under an hour 🏦', 'Getaway flawless ⚡', 'Guards bribed, no shots fired'],
  arms_dealing:        ['Crate delivered to the buyer 🗡️', 'Shipment cleared the border', 'Anonymous transfer, full payment'],
  contract_kill:       ['Target eliminated cleanly 🔪', 'One shot, confirmed 🎯', 'Client satisfied, payment done'],
  counterfeit_money:   ['Fake notes passed undetected 💴', 'Batch distributed through the network', 'Print run complete, ready to circulate'],
  drug_empire:         ['Entire shipment distributed smooth 🏭', 'All distributors paid up 💰', 'Territory expanding nicely'],
  political_corruption:['Minister signed the deal 🏛️', 'Policy changed overnight — as ordered', 'Untouchable. Above the law.'],
}

export function getSuccessFlavor(crimeId) {
  const list = SUCCESS_FLAVORS[crimeId]
  if (!list) return null
  return list[Math.floor(Math.random() * list.length)]
}

// XP needed to go from crimeLevel to crimeLevel+1
// +100 per normal level, +150 at milestone levels (5, 10, 15, 20)
export function xpToNextLevel(crimeLevel) {
  if (crimeLevel >= 20) return Infinity
  const isMilestone = crimeLevel % 5 === 0
  return crimeLevel * 100 + (isMilestone ? 150 : 0)
}
// Results: 100, 200, 300, 400, 650, 600, 700, 800, 900, 1150, 1100, 1200, 1300, 1400, 1650...

export const CRIME_LEVEL_NAMES = [
  '',
  'Petty Thief',     // 1-2
  'Petty Thief',
  'Street Criminal', // 3-5
  'Street Criminal',
  'Street Criminal',
  'Gang Member',     // 6-8
  'Gang Member',
  'Gang Member',
  'Enforcer',        // 9-11
  'Enforcer',
  'Enforcer',
  'Crime Boss',      // 12-14
  'Crime Boss',
  'Crime Boss',
  'Underboss',       // 15-16
  'Underboss',
  'Cartel Leader',   // 17-19
  'Cartel Leader',
  'Cartel Leader',
  '👑 Kingpin',      // 20
]

// successRate = baseSuccess + (crimeLevel - unlockLevel) * 3, max 95%
// Higher level = better criminal = higher chance of success
export function getSuccessRate(crime, crimeLevel) {
  const levelsAbove = Math.max(0, crimeLevel - crime.unlockLevel)
  return Math.min(95, crime.baseSuccess + levelsAbove * 3)
}

// Reward scales slightly with levels above unlock
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
    baseSuccess: 80,
    baseReward: [30, 150],
    xpOnSuccess: 5,
    prison: [3, 8],
    fine: [50, 200],
    warnFirst: true,
    minAge: 12,
  },
  {
    id: 'shoplift',
    name: 'Shoplift',
    emoji: '🛒',
    description: 'Five-finger discount',
    unlockLevel: 2,
    baseSuccess: 75,
    baseReward: [80, 400],
    xpOnSuccess: 10,
    prison: [6, 16],
    fine: [100, 500],
    warnFirst: true,
    minAge: 13,
  },
  {
    id: 'mugging',
    name: 'Mugging',
    emoji: '👊',
    description: 'Rob someone on the street',
    unlockLevel: 3,
    baseSuccess: 72,
    baseReward: [100, 600],
    xpOnSuccess: 15,
    prison: [4, 12],
    fine: [200, 800],
    minAge: 13,
  },
  {
    id: 'drug_deal',
    name: 'Drug Deal',
    emoji: '💊',
    description: 'Move product on the streets',
    unlockLevel: 4,
    baseSuccess: 65,
    baseReward: [300, 1500],
    xpOnSuccess: 25,
    prison: [26, 52],
    fine: [500, 2000],
    warnFirst: true,
    minAge: 15,
  },
  {
    id: 'car_theft',
    name: 'Car Theft',
    emoji: '🚗',
    description: 'Boost rides and sell them',
    unlockLevel: 5,
    baseSuccess: 60,
    baseReward: [800, 4000],
    xpOnSuccess: 35,
    prison: [26, 52],
    fine: [1000, 3000],
    minAge: 16,
  },
  {
    id: 'burglary',
    name: 'Burglary',
    emoji: '🏠',
    description: 'Break into homes',
    unlockLevel: 6,
    baseSuccess: 55,
    baseReward: [1500, 8000],
    xpOnSuccess: 50,
    prison: [26, 78],
    fine: [2000, 6000],
    minAge: 16,
  },
  {
    id: 'fraud',
    name: 'Fraud',
    emoji: '🎭',
    description: 'Con people out of their money',
    unlockLevel: 7,
    baseSuccess: 58,
    baseReward: [2000, 12000],
    xpOnSuccess: 60,
    prison: [26, 104],
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
    baseSuccess: 60,
    baseReward: [3000, 18000],
    xpOnSuccess: 75,
    prison: [52, 130],
    fine: [5000, 20000],
    smartsBonus: true,
    minAge: 16,
  },
  {
    id: 'extortion',
    name: 'Extortion',
    emoji: '🤝',
    description: 'Squeeze businesses for protection money',
    unlockLevel: 9,
    baseSuccess: 52,
    baseReward: [800, 5000],
    xpOnSuccess: 80,
    prison: [52, 156],
    fine: [0, 0],
    minAge: 17,
  },
  {
    id: 'armed_robbery',
    name: 'Armed Robbery',
    emoji: '🔫',
    description: 'High risk, high reward',
    unlockLevel: 10,
    baseSuccess: 40,
    baseReward: [5000, 25000],
    xpOnSuccess: 100,
    prison: [78, 208],
    fine: [0, 0],
    healthRisk: true,
    minAge: 17,
  },
  {
    id: 'money_laundering',
    name: 'Launder Money',
    emoji: '🧺',
    description: 'Clean dirty money',
    unlockLevel: 11,
    baseSuccess: 62,
    baseReward: [1000, 8000],
    xpOnSuccess: 60,
    prison: [52, 156],
    fine: [0, 0],
    smartsBonus: true,
    minAge: 20,
  },
  {
    id: 'blackmail',
    name: 'Blackmail',
    emoji: '📧',
    description: 'Threaten to expose secrets',
    unlockLevel: 12,
    baseSuccess: 55,
    baseReward: [3000, 20000],
    xpOnSuccess: 110,
    prison: [78, 208],
    fine: [0, 0],
    smartsBonus: true,
    minAge: 20,
  },
  {
    id: 'kidnapping',
    name: 'Kidnapping',
    emoji: '🪤',
    description: 'Seize and demand ransom',
    unlockLevel: 13,
    baseSuccess: 35,
    baseReward: [15000, 80000],
    xpOnSuccess: 150,
    prison: [208, 520],
    fine: [0, 0],
    minAge: 20,
  },
  {
    id: 'art_theft',
    name: 'Art Theft',
    emoji: '🖼️',
    description: 'Steal rare artwork for private collectors',
    unlockLevel: 14,
    baseSuccess: 30,
    baseReward: [20000, 120000],
    xpOnSuccess: 170,
    prison: [156, 312],
    fine: [0, 0],
    minAge: 22,
  },
  {
    id: 'heist',
    name: 'Bank Heist',
    emoji: '🏦',
    description: 'Rob a bank — the big one',
    unlockLevel: 15,
    baseSuccess: 25,
    baseReward: [50000, 300000],
    xpOnSuccess: 250,
    prison: [260, 650],
    fine: [0, 0],
    healthRisk: true,
    minAge: 22,
  },
  {
    id: 'arms_dealing',
    name: 'Arms Dealing',
    emoji: '🗡️',
    description: 'Traffic illegal weapons across borders',
    unlockLevel: 16,
    baseSuccess: 28,
    baseReward: [30000, 200000],
    xpOnSuccess: 220,
    prison: [260, 780],
    fine: [0, 0],
    minAge: 23,
  },
  {
    id: 'contract_kill',
    name: 'Contract Kill',
    emoji: '🔪',
    description: 'Eliminate targets for hire',
    unlockLevel: 17,
    baseSuccess: 30,
    baseReward: [25000, 150000],
    xpOnSuccess: 200,
    prison: [390, 1040],
    fine: [0, 0],
    healthRisk: true,
    minAge: 21,
  },
  {
    id: 'counterfeit_money',
    name: 'Counterfeit Money',
    emoji: '💴',
    description: 'Print and circulate fake currency',
    unlockLevel: 18,
    baseSuccess: 32,
    baseReward: [40000, 300000],
    xpOnSuccess: 280,
    prison: [312, 780],
    fine: [0, 0],
    smartsBonus: true,
    minAge: 24,
  },
  {
    id: 'drug_empire',
    name: 'Drug Empire',
    emoji: '🏭',
    description: 'Run your own operation',
    unlockLevel: 19,
    baseSuccess: 38,
    baseReward: [80000, 500000],
    xpOnSuccess: 350,
    prison: [520, 1040],
    fine: [0, 0],
    minAge: 25,
  },
  {
    id: 'political_corruption',
    name: 'Political Corruption',
    emoji: '🏛️',
    description: 'Bribe politicians and control the system',
    unlockLevel: 20,
    baseSuccess: 45,
    baseReward: [100000, 800000],
    xpOnSuccess: 0,
    prison: [520, 1040],
    fine: [0, 0],
    minAge: 30,
  },
]

export function getAvailableCrimes(crimeLevel, age) {
  return CRIMES.filter(c => crimeLevel >= c.unlockLevel && age >= c.minAge)
}

export function getLockedCrimes(crimeLevel, age) {
  return CRIMES
    .filter(c => crimeLevel < c.unlockLevel && age >= (c.minAge || 0))
    .sort((a, b) => a.unlockLevel - b.unlockLevel)
    .slice(0, 3)
}

export function attemptCrime(crimeId, character) {
  const crime = CRIMES.find(c => c.id === crimeId)
  if (!crime) return null

  let successRate = getSuccessRate(crime, character.crimeLevel)
  if (crime.smartsBonus) {
    successRate = Math.min(95, successRate + Math.floor((character.stats.smarts - 50) / 5))
  }

  const success = Math.random() * 100 < successRate

  if (success) {
    const [minR, maxR] = getRewardRange(crime, character.crimeLevel)
    const reward = minR === 0 ? 0 : rand(minR, maxR)

    return {
      success: true,
      money: reward,
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
    const prisonWeeks = crime.prison[1] > 0 ? rand(crime.prison[0], crime.prison[1]) : 0
    const healthLoss = crime.healthRisk ? rand(5, 20) : 0

    return {
      success: false,
      money: -fine,
      xpGain: 0,
      healthLoss,
      prisonWeeks,
      successRate: Math.round(successRate),
      message: buildFailMsg(crime, fine, prisonWeeks),
      type: 'bad',
      weekCost: 1,
    }
  }
}

function buildSuccessMsg(crime, reward) {
  const moneyStr = reward > 0 ? ` +€${reward.toLocaleString()}` : ''
  const msgs = {
    pickpocket:          `Wallet lifted without a trace.${moneyStr} 👛`,
    shoplift:            `Walked out clean.${moneyStr} 🛒`,
    mugging:             `Victim handed it over.${moneyStr} 👊`,
    drug_deal:           `Deal went smoothly.${moneyStr} 💊`,
    car_theft:           `Boosted and sold without issues.${moneyStr} 🚗`,
    burglary:            `House was empty — jackpot.${moneyStr} 🏠`,
    fraud:               `Scam worked perfectly.${moneyStr} 🎭`,
    hacking:             `Funds transferred successfully.${moneyStr} 💻`,
    extortion:           `Protection money collected.${moneyStr} 🤝`,
    armed_robbery:       `Everyone hit the floor. Walked out clean.${moneyStr} 🔫`,
    money_laundering:    `Money is clean.${moneyStr} 🧺`,
    blackmail:           `Target paid up without hesitation.${moneyStr} 📧`,
    kidnapping:          `Ransom paid in full.${moneyStr} 🪤`,
    art_theft:           `Masterpiece secured, sold privately.${moneyStr} 🖼️`,
    heist:               `FLAWLESS execution.${moneyStr} straight from the vault! 🏦`,
    arms_dealing:        `Shipment delivered, payment cleared.${moneyStr} 🗡️`,
    contract_kill:       `Target eliminated. Payment received.${moneyStr} 🔪`,
    counterfeit_money:   `Fake notes in circulation, undetected.${moneyStr} 💴`,
    drug_empire:         `Empire running smooth.${moneyStr} this week 🏭`,
    political_corruption:`Policy changed overnight. Payment offshore.${moneyStr} 🏛️`,
  }
  return msgs[crime.id] || `Crime succeeded!${moneyStr}`
}

function prisonTimeStr(weeks) {
  if (weeks <= 0) return ''
  if (weeks < 52) return `${weeks} week${weeks !== 1 ? 's' : ''}`
  const years = Math.round(weeks / 52)
  return `${years} year${years !== 1 ? 's' : ''}`
}

function buildFailMsg(crime, fine, prisonWeeks) {
  const base = {
    pickpocket:          'Caught pickpocketing! 🚨',
    shoplift:            'Store security grabbed you. 🚨',
    mugging:             'Victim fought back and called police! 🚨',
    drug_deal:           'It was a sting operation! 🚨',
    car_theft:           'CCTV footage exposed you. 🚨',
    burglary:            'Owner came home early — busted! 🚨',
    fraud:               'Scheme traced back to you. 🚨',
    hacking:             'Cybercrime unit tracked your IP. 🚨',
    extortion:           'Business owner went to the police. 🚨',
    armed_robbery:       'Police ambush outside the door! 🚨',
    money_laundering:    'Tax authority flagged the transaction. 🚨',
    blackmail:           'Target recorded everything and went to the cops. 🚨',
    kidnapping:          'Ransom handoff was a trap! 🚨',
    art_theft:           'Silent alarm triggered — surrounded at the exit. 🚨',
    heist:               'Dye pack exploded. Police swarmed in! 🚨',
    arms_dealing:        'Undercover agent in the buyer group! 🚨',
    contract_kill:       'Target was protected — you got shot! 🚨',
    counterfeit_money:   'Serial numbers flagged by the central bank. 🚨',
    drug_empire:         'DEA raid on your entire operation! 🚨',
    political_corruption:'Whistleblower leaked everything to the press. 🚨',
  }
  let msg = base[crime.id] || 'Caught! 🚨'
  if (fine > 0) msg += ` Fine: €${fine.toLocaleString()}.`
  if (prisonWeeks > 0) msg += ` ${prisonTimeStr(prisonWeeks)} in prison.`
  return msg
}
