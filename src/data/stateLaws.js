// Comprehensive state-specific legal information
// This data would typically be stored in a database and updated regularly

export const STATE_LAWS_DATA = {
  'California': {
    state_name: 'California',
    rights_summary: `California provides strong protections for citizens during police encounters. You have the right to remain silent, refuse searches without a warrant, and record police interactions in public spaces.`,
    script_guidance_english: {
      'traffic-stop': {
        whatToSay: [
          "I am exercising my right to remain silent.",
          "I do not consent to any searches of my vehicle.",
          "Am I free to leave?",
          "I would like to speak to an attorney."
        ],
        whatNotToSay: [
          "Don't argue about the reason for the stop",
          "Don't consent to vehicle searches",
          "Don't answer questions about where you're going",
          "Don't make sudden movements"
        ]
      },
      'home-visit': {
        whatToSay: [
          "I do not consent to you entering my home.",
          "Do you have a warrant?",
          "I am exercising my right to remain silent.",
          "I would like to see your identification."
        ],
        whatNotToSay: [
          "Don't open the door unless they have a warrant",
          "Don't let them in 'just to talk'",
          "Don't answer questions without an attorney",
          "Don't consent to searches"
        ]
      }
    },
    script_guidance_spanish: {
      'traffic-stop': {
        whatToSay: [
          "Estoy ejerciendo mi derecho a permanecer en silencio.",
          "No consiento ningún registro de mi vehículo.",
          "¿Soy libre de irme?",
          "Me gustaría hablar con un abogado."
        ],
        whatNotToSay: [
          "No discuta sobre la razón de la parada",
          "No consienta a registros del vehículo",
          "No responda preguntas sobre a dónde va",
          "No haga movimientos repentinos"
        ]
      }
    },
    common_pitfalls: [
      "Consenting to searches when not required",
      "Answering questions beyond providing identification",
      "Not knowing you can record police interactions",
      "Assuming you must answer all police questions"
    ],
    specific_laws: {
      recording_police: "Legal in public spaces (Penal Code Section 148)",
      vehicle_searches: "Requires warrant or probable cause",
      home_searches: "Requires warrant except in exigent circumstances",
      stop_and_frisk: "Requires reasonable suspicion of criminal activity"
    }
  },

  'Texas': {
    state_name: 'Texas',
    rights_summary: `Texas law provides constitutional protections during police encounters. You have the right to remain silent and refuse consent to searches, though Texas has specific laws about identification requirements.`,
    script_guidance_english: {
      'traffic-stop': {
        whatToSay: [
          "I am exercising my right to remain silent.",
          "I do not consent to searches.",
          "Am I being detained or am I free to go?",
          "I would like to speak to an attorney."
        ],
        whatNotToSay: [
          "Don't argue with the officer",
          "Don't consent to vehicle searches",
          "Don't volunteer information about your activities",
          "Don't resist physically"
        ]
      }
    },
    script_guidance_spanish: {
      'traffic-stop': {
        whatToSay: [
          "Estoy ejerciendo mi derecho a permanecer en silencio.",
          "No consiento a registros.",
          "¿Estoy detenido o soy libre de irme?",
          "Me gustaría hablar con un abogado."
        ]
      }
    },
    common_pitfalls: [
      "Not knowing Texas identification requirements",
      "Consenting to searches of vehicles",
      "Answering questions beyond legal requirements",
      "Not understanding detention vs. arrest"
    ],
    specific_laws: {
      identification: "Must provide name if lawfully arrested (Penal Code 38.02)",
      recording_police: "Generally legal in public spaces",
      vehicle_searches: "Requires warrant, consent, or probable cause",
      open_carry: "Legal with proper licensing"
    }
  },

  'New York': {
    state_name: 'New York',
    rights_summary: `New York provides strong civil rights protections. Citizens have the right to remain silent, refuse searches, and record police interactions. Stop-and-frisk requires reasonable suspicion.`,
    script_guidance_english: {
      'traffic-stop': {
        whatToSay: [
          "I am exercising my right to remain silent.",
          "I do not consent to any searches.",
          "Am I free to leave?",
          "I want to speak to a lawyer."
        ],
        whatNotToSay: [
          "Don't argue about the traffic stop",
          "Don't consent to vehicle searches",
          "Don't answer questions about your destination",
          "Don't make sudden movements"
        ]
      },
      'street-encounter': {
        whatToSay: [
          "Am I free to leave?",
          "I do not consent to any searches.",
          "I am exercising my right to remain silent.",
          "What is the reason for this stop?"
        ],
        whatNotToSay: [
          "Don't run or resist",
          "Don't consent to searches",
          "Don't answer questions without a lawyer",
          "Don't provide false information"
        ]
      }
    },
    common_pitfalls: [
      "Not knowing stop-and-frisk limitations",
      "Consenting to searches without warrants",
      "Not exercising right to remain silent",
      "Not knowing recording rights"
    ],
    specific_laws: {
      stop_and_frisk: "Requires reasonable suspicion (Terry v. Ohio)",
      recording_police: "Legal in public spaces",
      vehicle_searches: "Requires warrant or exigent circumstances",
      identification: "Not required unless under arrest"
    }
  },

  'Florida': {
    state_name: 'Florida',
    rights_summary: `Florida law protects citizens' constitutional rights during police encounters. You have the right to remain silent and refuse consent to searches, with specific protections for vehicle and home searches.`,
    script_guidance_english: {
      'traffic-stop': {
        whatToSay: [
          "I am exercising my right to remain silent.",
          "I do not consent to searches of my vehicle.",
          "Am I free to leave?",
          "I would like to contact an attorney."
        ],
        whatNotToSay: [
          "Don't argue about the traffic violation",
          "Don't consent to vehicle searches",
          "Don't answer questions about your activities",
          "Don't exit the vehicle unless instructed"
        ]
      }
    },
    common_pitfalls: [
      "Consenting to vehicle searches during traffic stops",
      "Not knowing you can refuse field sobriety tests",
      "Answering questions beyond providing documents",
      "Not understanding your recording rights"
    ],
    specific_laws: {
      vehicle_searches: "Requires warrant, consent, or probable cause",
      recording_police: "Legal in public spaces",
      field_sobriety: "Can be refused (with consequences for license)",
      home_searches: "Requires warrant except emergencies"
    }
  }
}

// Get state laws data
export const getStateLaws = (stateName) => {
  return STATE_LAWS_DATA[stateName] || null
}

// Get all available states
export const getAllStates = () => {
  return Object.keys(STATE_LAWS_DATA).sort()
}

// Search for specific legal information
export const searchLegalInfo = (query, stateName = null) => {
  const searchTerms = query.toLowerCase().split(' ')
  const results = []

  const statesToSearch = stateName ? [stateName] : getAllStates()

  statesToSearch.forEach(state => {
    const stateData = STATE_LAWS_DATA[state]
    if (!stateData) return

    // Search in rights summary
    if (searchTerms.some(term => stateData.rights_summary.toLowerCase().includes(term))) {
      results.push({
        state,
        type: 'rights_summary',
        content: stateData.rights_summary,
        relevance: calculateRelevance(stateData.rights_summary, searchTerms)
      })
    }

    // Search in common pitfalls
    stateData.common_pitfalls.forEach(pitfall => {
      if (searchTerms.some(term => pitfall.toLowerCase().includes(term))) {
        results.push({
          state,
          type: 'common_pitfall',
          content: pitfall,
          relevance: calculateRelevance(pitfall, searchTerms)
        })
      }
    })

    // Search in specific laws
    Object.entries(stateData.specific_laws || {}).forEach(([lawType, description]) => {
      if (searchTerms.some(term => 
        lawType.toLowerCase().includes(term) || 
        description.toLowerCase().includes(term)
      )) {
        results.push({
          state,
          type: 'specific_law',
          lawType,
          content: description,
          relevance: calculateRelevance(`${lawType} ${description}`, searchTerms)
        })
      }
    })
  })

  // Sort by relevance
  return results.sort((a, b) => b.relevance - a.relevance)
}

// Calculate relevance score for search results
const calculateRelevance = (text, searchTerms) => {
  const lowerText = text.toLowerCase()
  let score = 0

  searchTerms.forEach(term => {
    const occurrences = (lowerText.match(new RegExp(term, 'g')) || []).length
    score += occurrences * term.length
  })

  return score
}

// Get scenario-specific scripts
export const getScenarioScripts = (stateName, scenario, language = 'english') => {
  const stateData = STATE_LAWS_DATA[stateName]
  if (!stateData) return null

  const scripts = language === 'spanish' 
    ? stateData.script_guidance_spanish 
    : stateData.script_guidance_english

  return scripts?.[scenario] || null
}

// Validate state name
export const isValidState = (stateName) => {
  return STATE_LAWS_DATA.hasOwnProperty(stateName)
}
