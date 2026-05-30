const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min

const COUNTRY_EVENTS = {
  Netherlands: [
    { text: 'You cycled through the tulip fields near Amsterdam. 🌷', type: 'good', statChanges: { happiness: 5 } },
    { text: 'You got a great job offer at ASML in Eindhoven! 🏭', type: 'good', statChanges: { money: 3000, happiness: 10 } },
    { text: 'You celebrated King\'s Day in a sea of orange! 🧡', type: 'good', statChanges: { happiness: 8 } },
    { text: 'Your bike got stolen in the city center. 😤', type: 'bad', statChanges: { happiness: -5, money: -300 } },
    { text: 'You visited the Rijksmuseum and felt inspired. 🎨', type: 'good', statChanges: { smarts: 3, happiness: 5 } },
  ],
  Belgium: [
    { text: 'You ate the best waffles in Bruges. 🧇', type: 'good', statChanges: { happiness: 6 } },
    { text: 'You found an amazing job at the European Commission! 🇪🇺', type: 'good', statChanges: { money: 2500, happiness: 8 } },
    { text: 'You discovered a new Belgian beer variety. 🍺', type: 'good', statChanges: { happiness: 4 } },
  ],
  Germany: [
    { text: 'You attended Oktoberfest in Munich! 🍺', type: 'good', statChanges: { happiness: 8 } },
    { text: 'You got a job at a top German engineering firm! ⚙️', type: 'good', statChanges: { money: 2800, happiness: 7 } },
    { text: 'You visited Neuschwanstein Castle. 🏰', type: 'good', statChanges: { happiness: 6, smarts: 2 } },
  ],
  'United States': [
    { text: 'You visited New York City for the first time. 🗽', type: 'good', statChanges: { happiness: 10 } },
    { text: 'You got a Silicon Valley job offer! 💻', type: 'good', statChanges: { money: 5000, happiness: 12 } },
    { text: 'Your medical bill arrived for a routine checkup. 😱', type: 'bad', statChanges: { money: -1500, happiness: -5 } },
  ],
  'United Kingdom': [
    { text: 'You had fish and chips by the seaside. 🐟', type: 'good', statChanges: { happiness: 5 } },
    { text: 'You got a job at a prestigious London firm. 🎩', type: 'good', statChanges: { money: 2600, happiness: 8 } },
    { text: 'It rained for the 15th day in a row. ☔', type: 'bad', statChanges: { happiness: -3 } },
  ],
  Japan: [
    { text: 'You experienced cherry blossom season in Tokyo! 🌸', type: 'good', statChanges: { happiness: 12 } },
    { text: 'You got hired at a top Japanese tech company! 🤖', type: 'good', statChanges: { money: 2200, happiness: 8 } },
    { text: 'You visited a traditional onsen. ♨️', type: 'good', statChanges: { health: 8, happiness: 10 } },
  ],
  Brazil: [
    { text: 'You experienced Carnival in Rio de Janeiro! 🎭', type: 'good', statChanges: { happiness: 15 } },
    { text: 'You got a job at a booming Brazilian startup! 🚀', type: 'good', statChanges: { money: 1800, happiness: 6 } },
    { text: 'You watched a football match at the Maracanã! ⚽', type: 'good', statChanges: { happiness: 10 } },
  ],
}

const LIFE_EVENTS = {
  baby: [
    { text: 'You took your first steps! 👣', type: 'good', statChanges: { health: 3, happiness: 5 } },
    { text: 'You said your first word. 🗣️', type: 'good', statChanges: { smarts: 5 } },
    { text: 'You had a bad case of the flu. 🤒', type: 'bad', statChanges: { health: -8, happiness: -5 } },
    { text: 'You made your first friend at daycare! 👫', type: 'good', statChanges: { happiness: 8 } },
    { text: 'You got a cuddly new teddy bear! 🧸', type: 'good', statChanges: { happiness: 6 } },
  ],
  child: [
    { text: 'You got an A+ on your school test! 📝', type: 'good', statChanges: { smarts: 8, happiness: 5 } },
    { text: 'You failed your math test. 📉', type: 'bad', statChanges: { smarts: -3, happiness: -5 } },
    { text: 'You won first place in the school sports day! 🏆', type: 'good', statChanges: { health: 5, happiness: 10, looks: 3 } },
    { text: 'You got bullied at school. 😢', type: 'bad', statChanges: { happiness: -10, health: -3 } },
    { text: 'Your best friend moved away to another city. 😞', type: 'bad', statChanges: { happiness: -8 } },
    { text: 'You discovered a passion for reading! 📚', type: 'good', statChanges: { smarts: 10, happiness: 5 } },
    { text: 'You joined the school football team! ⚽', type: 'good', statChanges: { health: 8, happiness: 8 } },
    { text: 'You got a new puppy! 🐕', type: 'good', statChanges: { happiness: 15 } },
    { text: 'You broke your arm falling from a tree. 🦴', type: 'bad', statChanges: { health: -15, happiness: -8 } },
    { text: 'You won a local chess tournament! ♟️', type: 'good', statChanges: { smarts: 10 } },
  ],
  teen: [
    { text: 'You got your first crush. 💘', type: 'good', statChanges: { happiness: 10 } },
    { text: 'Your crush rejected you. 💔', type: 'bad', statChanges: { happiness: -12 } },
    { text: 'You got straight A\'s this semester! 🎓', type: 'good', statChanges: { smarts: 10, happiness: 8 } },
    { text: 'You were caught cheating on an exam. 😬', type: 'bad', statChanges: { smarts: -5, happiness: -10 } },
    { text: 'You discovered your talent for music! 🎸', type: 'good', statChanges: { happiness: 12, looks: 3 } },
    { text: 'You went to your first party. 🎉', type: 'good', statChanges: { happiness: 8 } },
    { text: 'You got grounded for a month. 😒', type: 'bad', statChanges: { happiness: -8 } },
    { text: 'You started working out regularly. 💪', type: 'good', statChanges: { health: 10, looks: 8 } },
    { text: 'You got into a fight with your best friend. 😡', type: 'bad', statChanges: { happiness: -8 } },
    { text: 'You aced your driving test! 🚗', type: 'good', statChanges: { happiness: 10 } },
    { text: 'You got your first part-time job! 💼', type: 'good', statChanges: { money: 500, happiness: 5 } },
  ],
  youngAdult: [
    { text: 'You got into your dream university! 🎓', type: 'good', statChanges: { smarts: 15, happiness: 15 } },
    { text: 'You failed your university entrance exam. 📉', type: 'bad', statChanges: { happiness: -12, smarts: -5 } },
    { text: 'You fell in love! ❤️', type: 'good', statChanges: { happiness: 20 } },
    { text: 'You broke up with your partner. 💔', type: 'bad', statChanges: { happiness: -18 } },
    { text: 'You got your first real job! 💼', type: 'good', statChanges: { money: 1500, happiness: 12 } },
    { text: 'You moved into your first apartment! 🏠', type: 'good', statChanges: { happiness: 15, money: -800 } },
    { text: 'You had too much fun at a college party. 🍻', type: 'bad', statChanges: { health: -5, happiness: 3 } },
    { text: 'You graduated with honors! 🏅', type: 'good', statChanges: { smarts: 12, happiness: 15 } },
    { text: 'You went backpacking through Europe! 🌍', type: 'good', statChanges: { happiness: 20, smarts: 8, money: -1200 } },
    { text: 'You started your own side business. 💡', type: 'good', statChanges: { money: 2000, happiness: 10, smarts: 5 } },
  ],
  adult: [
    { text: 'You got promoted at work! 📈', type: 'good', statChanges: { money: 3000, happiness: 15 } },
    { text: 'You got fired from your job. 😱', type: 'bad', statChanges: { money: -2000, happiness: -20 } },
    { text: 'You got married! 💍', type: 'good', statChanges: { happiness: 25, money: -5000 } },
    { text: 'You had a baby! 👶', type: 'good', statChanges: { happiness: 20, health: -5, money: -3000 } },
    { text: 'You bought a house! 🏡', type: 'good', statChanges: { happiness: 20, money: -10000 } },
    { text: 'You had a car accident. 🚗', type: 'bad', statChanges: { health: -15, money: -3000, happiness: -10 } },
    { text: 'You won a work award! 🏆', type: 'good', statChanges: { happiness: 10, money: 1000 } },
    { text: 'You started a new hobby: painting. 🎨', type: 'good', statChanges: { happiness: 8 } },
    { text: 'You went through a rough divorce. 💔', type: 'bad', statChanges: { happiness: -25, money: -8000, health: -10 } },
    { text: 'You ran your first marathon! 🏃', type: 'good', statChanges: { health: 15, happiness: 12 } },
    { text: 'You were diagnosed with high blood pressure. 🩺', type: 'bad', statChanges: { health: -15, happiness: -8 } },
    { text: 'Your investment portfolio did really well! 📊', type: 'good', statChanges: { money: 5000, happiness: 10 } },
    { text: 'You lost money in the stock market. 📉', type: 'bad', statChanges: { money: -4000, happiness: -10 } },
  ],
  senior: [
    { text: 'You retired with a great pension! 🎉', type: 'good', statChanges: { happiness: 20, money: 2000 } },
    { text: 'You became a grandparent! 👴👶', type: 'good', statChanges: { happiness: 25 } },
    { text: 'You developed arthritis. 😔', type: 'bad', statChanges: { health: -12, happiness: -8 } },
    { text: 'You went on a world cruise! 🚢', type: 'good', statChanges: { happiness: 20, money: -5000 } },
    { text: 'You wrote your memoirs. 📖', type: 'good', statChanges: { happiness: 10, smarts: 5 } },
    { text: 'Your old friend passed away. 😢', type: 'bad', statChanges: { happiness: -15, health: -5 } },
    { text: 'You took up gardening. 🌻', type: 'good', statChanges: { happiness: 8, health: 5 } },
    { text: 'You had a minor heart attack scare. ❤️', type: 'bad', statChanges: { health: -20, happiness: -15 } },
    { text: 'You won a senior chess championship! ♟️', type: 'good', statChanges: { smarts: 5, happiness: 12 } },
    { text: 'You started volunteering at the local shelter. 🤝', type: 'good', statChanges: { happiness: 15 } },
  ],
  health: [
    { text: 'You got a bad cold that lasted two weeks. 🤧', type: 'bad', statChanges: { health: -8, happiness: -5 } },
    { text: 'Your annual checkup went great! 💪', type: 'good', statChanges: { health: 5 } },
    { text: 'You had food poisoning from a restaurant. 🤢', type: 'bad', statChanges: { health: -10, happiness: -5 } },
    { text: 'You quit smoking! 🚭', type: 'good', statChanges: { health: 15, happiness: 5 } },
    { text: 'You discovered a serious vitamin D deficiency. 🩺', type: 'bad', statChanges: { health: -8 } },
  ],
}

const DEATH_EVENTS = [
  { text: 'Your heart gave out after years of unhealthy living. ❤️', cause: 'Heart failure', minAge: 50 },
  { text: 'You passed away from pneumonia. 🫁', cause: 'Pneumonia', minAge: 60 },
  { text: 'A sudden stroke took you. 🧠', cause: 'Stroke', minAge: 55 },
  { text: 'You died peacefully in your sleep at an old age. 😴', cause: 'Natural causes', minAge: 80 },
  { text: 'Your liver failed after years of partying. 🍺', cause: 'Liver failure', minAge: 45 },
  { text: 'You were in a fatal car accident. 🚗', cause: 'Car accident', minAge: 16 },
]

function pickPhase(age) {
  if (age < 3) return 'baby'
  if (age < 13) return 'child'
  if (age < 18) return 'teen'
  if (age < 26) return 'youngAdult'
  if (age < 62) return 'adult'
  return 'senior'
}

function checkDeath(character) {
  const { age, stats } = character

  if (stats.health <= 0) {
    const deathEvent = DEATH_EVENTS.find(e => age >= e.minAge) || DEATH_EVENTS[0]
    return { isDead: true, cause: deathEvent.cause, text: deathEvent.text }
  }

  if (age >= 90) {
    const chance = Math.random()
    if (chance < 0.35) {
      return { isDead: true, cause: 'Natural causes', text: 'You passed away peacefully at a ripe old age. 🕊️' }
    }
  } else if (age >= 80) {
    const chance = Math.random()
    if (chance < 0.12) {
      return { isDead: true, cause: 'Natural causes', text: 'Your time on earth came to a peaceful end. 🕊️' }
    }
  } else if (age >= 70 && stats.health < 30) {
    const chance = Math.random()
    if (chance < 0.08) {
      const deathEvent = DEATH_EVENTS.find(e => age >= e.minAge && e.minAge >= 55)
      return { isDead: true, cause: deathEvent?.cause || 'Heart failure', text: deathEvent?.text || 'Your heart gave out. ❤️' }
    }
  }

  return { isDead: false }
}

export function getRandomEvents(character) {
  const { age, country } = character
  const phase = pickPhase(age)
  const events = []
  const numEvents = rand(1, 3)

  const allPhaseEvents = LIFE_EVENTS[phase] || []

  for (let i = 0; i < numEvents; i++) {
    const roll = Math.random()

    if (roll < 0.15 && COUNTRY_EVENTS[country]) {
      const pool = COUNTRY_EVENTS[country]
      events.push(pool[rand(0, pool.length - 1)])
    } else if (roll < 0.25) {
      const pool = LIFE_EVENTS.health
      events.push(pool[rand(0, pool.length - 1)])
    } else if (allPhaseEvents.length > 0) {
      events.push(allPhaseEvents[rand(0, allPhaseEvents.length - 1)])
    }
  }

  const deathCheck = checkDeath(character)
  return { events, death: deathCheck }
}
