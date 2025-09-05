import { API_CONFIG } from '../config/api.js'

// OpenAI API service
class OpenAIService {
  constructor() {
    this.apiKey = API_CONFIG.openai.apiKey
    this.baseUrl = API_CONFIG.openai.baseUrl
  }

  async makeRequest(endpoint, data) {
    if (!this.apiKey) {
      throw new Error('OpenAI API key not configured')
    }

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('OpenAI API request failed:', error)
      throw error
    }
  }

  // Generate context-aware legal scripts
  async generateScript(scenario, state, language = 'english', context = {}) {
    const prompt = this.buildScriptPrompt(scenario, state, language, context)
    
    const data = {
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a legal expert specializing in civil rights and police interactions. Provide accurate, helpful, and safe guidance for citizens during law enforcement encounters. Always emphasize de-escalation and legal compliance.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 500,
      temperature: 0.3
    }

    try {
      const response = await this.makeRequest('/chat/completions', data)
      return this.parseScriptResponse(response)
    } catch (error) {
      // Fallback to default scripts if API fails
      return this.getFallbackScript(scenario, language)
    }
  }

  buildScriptPrompt(scenario, state, language, context) {
    const languageInstruction = language === 'spanish' 
      ? 'Respond in Spanish.' 
      : 'Respond in English.'

    return `
Generate appropriate scripts for a ${scenario} scenario in ${state}. ${languageInstruction}

Context: ${JSON.stringify(context)}

Please provide:
1. 3-4 key phrases the person SHOULD say
2. 3-4 things the person should NOT say or do

Format as JSON:
{
  "whatToSay": ["phrase1", "phrase2", "phrase3"],
  "whatNotToSay": ["avoid1", "avoid2", "avoid3"]
}

Focus on:
- Constitutional rights
- De-escalation
- Legal compliance
- Personal safety
- State-specific considerations for ${state}
`
  }

  parseScriptResponse(response) {
    try {
      const content = response.choices[0]?.message?.content
      if (!content) throw new Error('No content in response')

      // Try to parse JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0])
      }

      // If no JSON found, parse manually
      return this.parseTextResponse(content)
    } catch (error) {
      console.error('Failed to parse OpenAI response:', error)
      return null
    }
  }

  parseTextResponse(content) {
    const whatToSay = []
    const whatNotToSay = []

    const lines = content.split('\n')
    let currentSection = null

    for (const line of lines) {
      const trimmed = line.trim()
      if (trimmed.toLowerCase().includes('should say') || trimmed.toLowerCase().includes('what to say')) {
        currentSection = 'say'
      } else if (trimmed.toLowerCase().includes('should not') || trimmed.toLowerCase().includes('avoid')) {
        currentSection = 'avoid'
      } else if (trimmed.startsWith('-') || trimmed.startsWith('•') || /^\d+\./.test(trimmed)) {
        const text = trimmed.replace(/^[-•\d.]\s*/, '').replace(/"/g, '')
        if (currentSection === 'say') {
          whatToSay.push(text)
        } else if (currentSection === 'avoid') {
          whatNotToSay.push(text)
        }
      }
    }

    return { whatToSay, whatNotToSay }
  }

  getFallbackScript(scenario, language) {
    const fallbacks = {
      'traffic-stop': {
        english: {
          whatToSay: [
            "I am exercising my right to remain silent.",
            "I do not consent to any searches.",
            "Am I free to leave?",
            "I would like to speak to an attorney."
          ],
          whatNotToSay: [
            "Don't argue or resist physically",
            "Don't answer questions about where you're going",
            "Don't consent to searches",
            "Don't make sudden movements"
          ]
        },
        spanish: {
          whatToSay: [
            "Estoy ejerciendo mi derecho a permanecer en silencio.",
            "No consiento ningún registro.",
            "¿Soy libre de irme?",
            "Me gustaría hablar con un abogado."
          ],
          whatNotToSay: [
            "No discuta o resista físicamente",
            "No responda preguntas sobre a dónde va",
            "No consienta a registros",
            "No haga movimientos repentinos"
          ]
        }
      }
    }

    return fallbacks[scenario]?.[language] || fallbacks['traffic-stop']['english']
  }

  // Translate text to Spanish
  async translateToSpanish(text) {
    const data = {
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a professional translator specializing in legal terminology. Translate the following text to Spanish, maintaining legal accuracy and formality.'
        },
        {
          role: 'user',
          content: `Translate this to Spanish: ${text}`
        }
      ],
      max_tokens: 200,
      temperature: 0.1
    }

    try {
      const response = await this.makeRequest('/chat/completions', data)
      return response.choices[0]?.message?.content || text
    } catch (error) {
      console.error('Translation failed:', error)
      return text
    }
  }

  // Simplify complex legal text
  async simplifyLegalText(text, readingLevel = 'middle-school') {
    const data = {
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `You are an expert at explaining complex legal concepts in simple terms. Rewrite legal text at a ${readingLevel} reading level while maintaining accuracy.`
        },
        {
          role: 'user',
          content: `Simplify this legal text: ${text}`
        }
      ],
      max_tokens: 300,
      temperature: 0.2
    }

    try {
      const response = await this.makeRequest('/chat/completions', data)
      return response.choices[0]?.message?.content || text
    } catch (error) {
      console.error('Text simplification failed:', error)
      return text
    }
  }
}

export const openaiService = new OpenAIService()
