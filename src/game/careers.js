export const EDUCATION_LEVELS = ['None', 'Middle School', 'High School', "Bachelor's", "Master's", 'PhD']

export const CAREER_PATHS = [
  {
    id: 'tech',
    name: 'Technology',
    emoji: '💻',
    description: 'Code your way to the top',
    minSmarts: 55,
    minEducation: 'None',
    levels: [
      { title: 'Junior Developer',    salary: 28000,  yearsRequired: 0, smartsRequired: 55 },
      { title: 'Developer',           salary: 45000,  yearsRequired: 2, smartsRequired: 60 },
      { title: 'Senior Developer',    salary: 70000,  yearsRequired: 3, smartsRequired: 70 },
      { title: 'Tech Lead',           salary: 95000,  yearsRequired: 4, smartsRequired: 78 },
      { title: 'Engineering Manager', salary: 130000, yearsRequired: 4, smartsRequired: 82 },
      { title: 'CTO',                 salary: 220000, yearsRequired: 5, smartsRequired: 88 },
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
      { title: 'Intern',                salary: 32000,  yearsRequired: 0, smartsRequired: 70 },
      { title: 'Resident Doctor',       salary: 52000,  yearsRequired: 3, smartsRequired: 72 },
      { title: 'General Practitioner',  salary: 90000,  yearsRequired: 3, smartsRequired: 75 },
      { title: 'Specialist',            salary: 150000, yearsRequired: 4, smartsRequired: 82 },
      { title: 'Senior Specialist',     salary: 220000, yearsRequired: 5, smartsRequired: 88 },
      { title: 'Chief of Medicine',     salary: 320000, yearsRequired: 5, smartsRequired: 92 },
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
      { title: 'Paralegal',       salary: 30000,  yearsRequired: 0, smartsRequired: 65 },
      { title: 'Junior Lawyer',   salary: 55000,  yearsRequired: 2, smartsRequired: 68 },
      { title: 'Lawyer',          salary: 90000,  yearsRequired: 3, smartsRequired: 74 },
      { title: 'Senior Lawyer',   salary: 150000, yearsRequired: 4, smartsRequired: 80 },
      { title: 'Partner',         salary: 250000, yearsRequired: 5, smartsRequired: 86 },
      { title: 'Judge',           salary: 180000, yearsRequired: 6, smartsRequired: 90 },
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
      { title: 'Intern',          salary: 18000,  yearsRequired: 0, smartsRequired: 50 },
      { title: 'Analyst',         salary: 38000,  yearsRequired: 2, smartsRequired: 55 },
      { title: 'Manager',         salary: 65000,  yearsRequired: 3, smartsRequired: 62 },
      { title: 'Senior Manager',  salary: 95000,  yearsRequired: 3, smartsRequired: 68 },
      { title: 'Director',        salary: 150000, yearsRequired: 4, smartsRequired: 74 },
      { title: 'VP',              salary: 220000, yearsRequired: 4, smartsRequired: 80 },
      { title: 'CEO',             salary: 400000, yearsRequired: 5, smartsRequired: 86 },
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
      { title: 'Police Cadet',    salary: 26000,  yearsRequired: 0, smartsRequired: 45 },
      { title: 'Police Officer',  salary: 42000,  yearsRequired: 2, smartsRequired: 50 },
      { title: 'Detective',       salary: 62000,  yearsRequired: 3, smartsRequired: 58 },
      { title: 'Sergeant',        salary: 80000,  yearsRequired: 3, smartsRequired: 64 },
      { title: 'Inspector',       salary: 105000, yearsRequired: 4, smartsRequired: 70 },
      { title: 'Commissioner',    salary: 160000, yearsRequired: 5, smartsRequired: 78 },
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
      { title: 'Aspiring Artist',     salary: 8000,   yearsRequired: 0, smartsRequired: 35 },
      { title: 'Extra / Background',  salary: 18000,  yearsRequired: 1, smartsRequired: 38 },
      { title: 'Supporting Actor',    salary: 45000,  yearsRequired: 2, smartsRequired: 42 },
      { title: 'Lead Actor',          salary: 120000, yearsRequired: 3, smartsRequired: 50 },
      { title: 'A-List Celebrity',    salary: 500000, yearsRequired: 4, smartsRequired: 58 },
      { title: 'Global Superstar',    salary: 1200000,yearsRequired: 5, smartsRequired: 65 },
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
      { title: 'Amateur Athlete',     salary: 5000,   yearsRequired: 0, smartsRequired: 30 },
      { title: 'Semi-Pro',            salary: 30000,  yearsRequired: 2, smartsRequired: 32 },
      { title: 'Professional',        salary: 80000,  yearsRequired: 2, smartsRequired: 35 },
      { title: 'Star Player',         salary: 300000, yearsRequired: 3, smartsRequired: 40 },
      { title: 'Club Legend',         salary: 800000, yearsRequired: 3, smartsRequired: 45 },
      { title: 'All-Time Legend',     salary: 2000000,yearsRequired: 4, smartsRequired: 50 },
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
      { title: 'Laborer',             salary: 22000,  yearsRequired: 0, smartsRequired: 35 },
      { title: 'Skilled Worker',      salary: 35000,  yearsRequired: 2, smartsRequired: 40 },
      { title: 'Foreman',             salary: 52000,  yearsRequired: 3, smartsRequired: 48 },
      { title: 'Site Manager',        salary: 75000,  yearsRequired: 3, smartsRequired: 55 },
      { title: 'Project Manager',     salary: 110000, yearsRequired: 4, smartsRequired: 62 },
      { title: 'Construction Mogul',  salary: 280000, yearsRequired: 5, smartsRequired: 70 },
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
      { title: 'Dishwasher',          salary: 16000,  yearsRequired: 0, smartsRequired: 30 },
      { title: 'Waiter / Waitress',   salary: 22000,  yearsRequired: 1, smartsRequired: 33 },
      { title: 'Sous Chef',           salary: 38000,  yearsRequired: 2, smartsRequired: 40 },
      { title: 'Head Chef',           salary: 65000,  yearsRequired: 3, smartsRequired: 50 },
      { title: 'Restaurant Manager',  salary: 90000,  yearsRequired: 3, smartsRequired: 58 },
      { title: 'Restaurant Owner',    salary: 200000, yearsRequired: 5, smartsRequired: 65 },
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
      { title: 'Private',             salary: 24000,  yearsRequired: 0, smartsRequired: 40 },
      { title: 'Corporal',            salary: 32000,  yearsRequired: 2, smartsRequired: 44 },
      { title: 'Sergeant',            salary: 45000,  yearsRequired: 3, smartsRequired: 50 },
      { title: 'Lieutenant',          salary: 65000,  yearsRequired: 3, smartsRequired: 56 },
      { title: 'Captain',             salary: 90000,  yearsRequired: 4, smartsRequired: 62 },
      { title: 'Colonel',             salary: 130000, yearsRequired: 5, smartsRequired: 70 },
      { title: 'General',             salary: 200000, yearsRequired: 6, smartsRequired: 80 },
    ],
  },
]

export function canJoinCareer(path, character) {
  if (character.age < 16) return { ok: false, reason: 'Too young to work' }
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
  if (character.yearsAtJob < nextLevel.yearsRequired) {
    return { ok: false, reason: `Need ${nextLevel.yearsRequired - character.yearsAtJob} more year(s) at this level` }
  }
  if (character.stats.smarts < nextLevel.smartsRequired) {
    return { ok: false, reason: `Need ${nextLevel.smartsRequired} smarts` }
  }
  return { ok: true, nextLevel }
}

export function getCareerById(id) {
  return CAREER_PATHS.find(c => c.id === id) || null
}
