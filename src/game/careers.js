export const EDUCATION_LEVELS = ['None', 'Middle School', 'High School', "Bachelor's", "Master's", 'PhD']

export const CAREER_PATHS = [
  {
    id: 'fastfood',
    name: 'Fast Food',
    emoji: '🍔',
    description: 'Everyone starts somewhere',
    minAge: 14,
    minSmarts: 0,
    minEducation: 'None',
    levels: [
      { title: 'Burger Flipper',  salary: 10000,  weeksRequired: 0,  smartsRequired: 0 },
      { title: 'Crew Member',     salary: 14000,  weeksRequired: 52, smartsRequired: 20 },
      { title: 'Crew Leader',     salary: 18000,  weeksRequired: 52, smartsRequired: 25 },
      { title: 'Shift Manager',   salary: 24000,  weeksRequired: 104, smartsRequired: 32 },
      { title: 'Store Manager',   salary: 38000,  weeksRequired: 156, smartsRequired: 40 },
      { title: 'Area Manager',    salary: 65000,  weeksRequired: 208, smartsRequired: 50 },
      { title: 'Franchise Owner', salary: 150000, weeksRequired: 260, smartsRequired: 60 },
    ],
  },
  {
    id: 'tech',
    name: 'Technology',
    emoji: '💻',
    description: 'Code your way to the top',
    minSmarts: 55,
    minEducation: 'None',
    levels: [
      { title: 'Junior Developer',    salary: 28000,  weeksRequired: 0,   smartsRequired: 55 },
      { title: 'Developer',           salary: 45000,  weeksRequired: 104, smartsRequired: 60 },
      { title: 'Senior Developer',    salary: 70000,  weeksRequired: 156, smartsRequired: 70 },
      { title: 'Tech Lead',           salary: 95000,  weeksRequired: 208, smartsRequired: 78 },
      { title: 'Engineering Manager', salary: 130000, weeksRequired: 208, smartsRequired: 82 },
      { title: 'CTO',                 salary: 220000, weeksRequired: 260, smartsRequired: 88 },
    ],
  },
  {
    id: 'medical',
    name: 'Medicine',
    emoji: '🏥',
    description: 'Save lives and earn big',
    minSmarts: 70,
    minEducation: "Bachelor's",
    majorRequired: 'Medicine',
    levels: [
      { title: 'Intern',                salary: 32000,  weeksRequired: 0,   smartsRequired: 70 },
      { title: 'Resident Doctor',       salary: 52000,  weeksRequired: 156, smartsRequired: 72 },
      { title: 'General Practitioner',  salary: 90000,  weeksRequired: 156, smartsRequired: 75 },
      { title: 'Specialist',            salary: 150000, weeksRequired: 208, smartsRequired: 82 },
      { title: 'Senior Specialist',     salary: 220000, weeksRequired: 260, smartsRequired: 88 },
      { title: 'Chief of Medicine',     salary: 320000, weeksRequired: 260, smartsRequired: 92 },
    ],
  },
  {
    id: 'law',
    name: 'Law',
    emoji: '⚖️',
    description: 'Justice — or the highest bidder',
    minSmarts: 65,
    minEducation: "Bachelor's",
    majorRequired: 'Law',
    levels: [
      { title: 'Paralegal',       salary: 30000,  weeksRequired: 0,   smartsRequired: 65 },
      { title: 'Junior Lawyer',   salary: 55000,  weeksRequired: 104, smartsRequired: 68 },
      { title: 'Lawyer',          salary: 90000,  weeksRequired: 156, smartsRequired: 74 },
      { title: 'Senior Lawyer',   salary: 150000, weeksRequired: 208, smartsRequired: 80 },
      { title: 'Partner',         salary: 250000, weeksRequired: 260, smartsRequired: 86 },
      { title: 'Judge',           salary: 180000, weeksRequired: 312, smartsRequired: 90 },
    ],
  },
  {
    id: 'business',
    name: 'Business',
    emoji: '📊',
    description: 'Climb the corporate ladder',
    minSmarts: 50,
    minEducation: 'None',
    levels: [
      { title: 'Intern',          salary: 18000,  weeksRequired: 0,   smartsRequired: 50 },
      { title: 'Analyst',         salary: 38000,  weeksRequired: 104, smartsRequired: 55 },
      { title: 'Manager',         salary: 65000,  weeksRequired: 156, smartsRequired: 62 },
      { title: 'Senior Manager',  salary: 95000,  weeksRequired: 156, smartsRequired: 68 },
      { title: 'Director',        salary: 150000, weeksRequired: 208, smartsRequired: 74 },
      { title: 'VP',              salary: 220000, weeksRequired: 208, smartsRequired: 80 },
      { title: 'CEO',             salary: 400000, weeksRequired: 260, smartsRequired: 86 },
    ],
  },
  {
    id: 'police',
    name: 'Law Enforcement',
    emoji: '🚓',
    description: 'Protect and serve',
    minSmarts: 45,
    minEducation: 'High School',
    noCriminalRecord: true,
    levels: [
      { title: 'Police Cadet',    salary: 26000,  weeksRequired: 0,   smartsRequired: 45 },
      { title: 'Police Officer',  salary: 42000,  weeksRequired: 104, smartsRequired: 50 },
      { title: 'Detective',       salary: 62000,  weeksRequired: 156, smartsRequired: 58 },
      { title: 'Sergeant',        salary: 80000,  weeksRequired: 156, smartsRequired: 64 },
      { title: 'Inspector',       salary: 105000, weeksRequired: 208, smartsRequired: 70 },
      { title: 'Commissioner',    salary: 160000, weeksRequired: 260, smartsRequired: 78 },
    ],
  },
  {
    id: 'entertainment',
    name: 'Entertainment',
    emoji: '🎭',
    description: 'Fame, fortune, and drama',
    minSmarts: 35,
    minEducation: 'None',
    looksBonus: true,
    levels: [
      { title: 'Aspiring Artist',     salary: 8000,    weeksRequired: 0,   smartsRequired: 35 },
      { title: 'Extra / Background',  salary: 18000,   weeksRequired: 52,  smartsRequired: 38 },
      { title: 'Supporting Actor',    salary: 45000,   weeksRequired: 104, smartsRequired: 42 },
      { title: 'Lead Actor',          salary: 120000,  weeksRequired: 156, smartsRequired: 50 },
      { title: 'A-List Celebrity',    salary: 500000,  weeksRequired: 208, smartsRequired: 58 },
      { title: 'Global Superstar',    salary: 1200000, weeksRequired: 208, smartsRequired: 65 },
    ],
  },
  {
    id: 'sports',
    name: 'Professional Sports',
    emoji: '⚽',
    description: 'Live for the game',
    minSmarts: 30,
    minEducation: 'None',
    maxAge: 45,
    healthRequired: 65,
    levels: [
      { title: 'Amateur Athlete',     salary: 5000,    weeksRequired: 0,   smartsRequired: 30 },
      { title: 'Semi-Pro',            salary: 30000,   weeksRequired: 104, smartsRequired: 32 },
      { title: 'Professional',        salary: 80000,   weeksRequired: 104, smartsRequired: 35 },
      { title: 'Star Player',         salary: 300000,  weeksRequired: 156, smartsRequired: 40 },
      { title: 'Club Legend',         salary: 800000,  weeksRequired: 156, smartsRequired: 45 },
      { title: 'All-Time Legend',     salary: 2000000, weeksRequired: 208, smartsRequired: 50 },
    ],
  },
  {
    id: 'construction',
    name: 'Construction',
    emoji: '🏗️',
    description: 'Build the world around you',
    minSmarts: 35,
    minEducation: 'None',
    levels: [
      { title: 'Laborer',             salary: 22000,  weeksRequired: 0,   smartsRequired: 35 },
      { title: 'Skilled Worker',      salary: 35000,  weeksRequired: 104, smartsRequired: 40 },
      { title: 'Foreman',             salary: 52000,  weeksRequired: 156, smartsRequired: 48 },
      { title: 'Site Manager',        salary: 75000,  weeksRequired: 156, smartsRequired: 55 },
      { title: 'Project Manager',     salary: 110000, weeksRequired: 208, smartsRequired: 62 },
      { title: 'Construction Mogul',  salary: 280000, weeksRequired: 260, smartsRequired: 70 },
    ],
  },
  {
    id: 'food',
    name: 'Hospitality & Food',
    emoji: '🍳',
    description: 'From kitchen to empire',
    minSmarts: 30,
    minEducation: 'None',
    levels: [
      { title: 'Dishwasher',          salary: 16000,  weeksRequired: 0,   smartsRequired: 30 },
      { title: 'Waiter / Waitress',   salary: 22000,  weeksRequired: 52,  smartsRequired: 33 },
      { title: 'Sous Chef',           salary: 38000,  weeksRequired: 104, smartsRequired: 40 },
      { title: 'Head Chef',           salary: 65000,  weeksRequired: 156, smartsRequired: 50 },
      { title: 'Restaurant Manager',  salary: 90000,  weeksRequired: 156, smartsRequired: 58 },
      { title: 'Restaurant Owner',    salary: 200000, weeksRequired: 260, smartsRequired: 65 },
    ],
  },
  {
    id: 'military',
    name: 'Military',
    emoji: '🎖️',
    description: 'Serve your country with honor',
    minSmarts: 40,
    minEducation: 'High School',
    noCriminalRecord: true,
    levels: [
      { title: 'Private',             salary: 24000,  weeksRequired: 0,   smartsRequired: 40 },
      { title: 'Corporal',            salary: 32000,  weeksRequired: 104, smartsRequired: 44 },
      { title: 'Sergeant',            salary: 45000,  weeksRequired: 156, smartsRequired: 50 },
      { title: 'Lieutenant',          salary: 65000,  weeksRequired: 156, smartsRequired: 56 },
      { title: 'Captain',             salary: 90000,  weeksRequired: 208, smartsRequired: 62 },
      { title: 'Colonel',             salary: 130000, weeksRequired: 260, smartsRequired: 70 },
      { title: 'General',             salary: 200000, weeksRequired: 312, smartsRequired: 80 },
    ],
  },
]

export function canJoinCareer(path, character) {
  const minAge = path.minAge ?? 16
  if (character.age < minAge) return { ok: false, reason: `Must be ${minAge}+ to work here` }
  if (path.noCriminalRecord && character.criminalRecord) return { ok: false, reason: 'Criminal record blocks this job' }
  if (character.stats.smarts < path.minSmarts) return { ok: false, reason: `Need ${path.minSmarts} smarts` }
  if (path.healthRequired && character.stats.health < path.healthRequired) return { ok: false, reason: `Need ${path.healthRequired} health` }
  if (path.maxAge && character.age > path.maxAge) return { ok: false, reason: 'Too old for this career' }
  const eduIndex = EDUCATION_LEVELS.indexOf(path.minEducation)
  const charEduIndex = EDUCATION_LEVELS.indexOf(character.education)
  if (charEduIndex < eduIndex) return { ok: false, reason: `Requires ${path.minEducation}` }
  if (path.majorRequired && character.collegeMajor !== path.majorRequired) {
    return { ok: false, reason: `Requires ${path.majorRequired} degree` }
  }
  return { ok: true }
}

export function canPromote(path, levelIndex, character) {
  const nextLevel = path.levels[levelIndex + 1]
  if (!nextLevel) return { ok: false, reason: 'Already at the top!' }
  const weeksNeeded = nextLevel.weeksRequired ?? 0
  if (character.weeksAtJob < weeksNeeded) {
    const weeksLeft = weeksNeeded - character.weeksAtJob
    const display = weeksLeft >= 52
      ? `${Math.ceil(weeksLeft / 52)} more yr(s)`
      : `${weeksLeft} more wk(s)`
    return { ok: false, reason: `Need ${display} at this level` }
  }
  if (character.stats.smarts < nextLevel.smartsRequired) {
    return { ok: false, reason: `Need ${nextLevel.smartsRequired} smarts` }
  }
  return { ok: true, nextLevel }
}

export function getCareerById(id) {
  return CAREER_PATHS.find(c => c.id === id) || null
}
