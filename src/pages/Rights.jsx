import React, { useState } from 'react'
import { Copy, Volume2, Languages, Shield, Car, Home, Phone } from 'lucide-react'
import Card from '../components/Card'
import Button from '../components/Button'
import { useUser } from '../context/UserContext'

const Rights = () => {
  const { selectedState } = useUser()
  const [selectedScenario, setSelectedScenario] = useState('traffic-stop')
  const [language, setLanguage] = useState('english')

  const scenarios = {
    'traffic-stop': {
      title: 'Traffic Stop',
      icon: Car,
      rights: [
        'You have the right to remain silent',
        'You have the right to refuse consent to search your vehicle',
        'You have the right to ask "Am I free to leave?"',
        'You must provide license, registration, and proof of insurance if asked'
      ],
      scripts: {
        english: {
          whatToSay: [
            '"I am exercising my right to remain silent."',
            '"I do not consent to any searches."',
            '"Am I free to leave?"',
            '"I would like to speak to an attorney."'
          ],
          whatNotToSay: [
            'Don\'t argue or resist physically',
            'Don\'t answer questions about where you\'re going or coming from',
            'Don\'t consent to searches',
            'Don\'t make sudden movements'
          ]
        },
        spanish: {
          whatToSay: [
            '"Estoy ejerciendo mi derecho a permanecer en silencio."',
            '"No consiento ningún registro."',
            '"¿Soy libre de irme?"',
            '"Me gustaría hablar con un abogado."'
          ],
          whatNotToSay: [
            'No discuta o resista físicamente',
            'No responda preguntas sobre a dónde va o de dónde viene',
            'No consienta a registros',
            'No haga movimientos repentinos'
          ]
        }
      }
    },
    'home-visit': {
      title: 'Home Visit',
      icon: Home,
      rights: [
        'You have the right to refuse entry without a warrant',
        'You have the right to see the warrant if they have one',
        'You have the right to remain silent',
        'You can ask to speak to an attorney'
      ],
      scripts: {
        english: {
          whatToSay: [
            '"I do not consent to you entering my home."',
            '"Do you have a warrant?"',
            '"I am exercising my right to remain silent."',
            '"I would like to speak to an attorney."'
          ],
          whatNotToSay: [
            'Don\'t open the door unless they have a warrant',
            'Don\'t let them in "just to talk"',
            'Don\'t answer questions without an attorney',
            'Don\'t consent to searches'
          ]
        },
        spanish: {
          whatToSay: [
            '"No consiento que entren a mi hogar."',
            '"¿Tienen una orden?"',
            '"Estoy ejerciendo mi derecho a permanecer en silencio."',
            '"Me gustaría hablar con un abogado."'
          ],
          whatNotToSay: [
            'No abra la puerta a menos que tengan una orden',
            'No los deje entrar "solo para hablar"',
            'No responda preguntas sin un abogado',
            'No consienta a registros'
          ]
        }
      }
    },
    'street-encounter': {
      title: 'Street Encounter',
      icon: Shield,
      rights: [
        'You have the right to ask if you\'re free to leave',
        'You have the right to remain silent',
        'You have the right to refuse consent to search',
        'You have the right to record the interaction'
      ],
      scripts: {
        english: {
          whatToSay: [
            '"Am I free to leave?"',
            '"I am exercising my right to remain silent."',
            '"I do not consent to any searches."',
            '"I am recording this interaction for my safety."'
          ],
          whatNotToSay: [
            'Don\'t run away',
            'Don\'t resist or argue',
            'Don\'t answer investigative questions',
            'Don\'t reach for anything without permission'
          ]
        },
        spanish: {
          whatToSay: [
            '"¿Soy libre de irme?"',
            '"Estoy ejerciendo mi derecho a permanecer en silencio."',
            '"No consiento ningún registro."',
            '"Estoy grabando esta interacción por mi seguridad."'
          ],
          whatNotToSay: [
            'No huya',
            'No resista o discuta',
            'No responda preguntas de investigación',
            'No alcance nada sin permiso'
          ]
        }
      }
    }
  }

  const currentScenario = scenarios[selectedScenario]
  const currentScripts = currentScenario.scripts[language]

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    // Could add a toast notification here
  }

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = language === 'spanish' ? 'es-ES' : 'en-US'
      speechSynthesis.speak(utterance)
    }
  }

  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Your Rights</h1>
        <p className="text-gray-400">State-specific rights and scripts for {selectedState}</p>
      </div>

      {/* Language Selector */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white flex items-center">
            <Languages className="h-5 w-5 mr-2" />
            Language
          </h2>
          <div className="flex bg-dark-bg rounded-lg p-1">
            <button
              onClick={() => setLanguage('english')}
              className={`px-4 py-2 rounded-md text-sm transition-colors ${
                language === 'english' 
                  ? 'bg-purple-primary text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              English
            </button>
            <button
              onClick={() => setLanguage('spanish')}
              className={`px-4 py-2 rounded-md text-sm transition-colors ${
                language === 'spanish' 
                  ? 'bg-purple-primary text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Español
            </button>
          </div>
        </div>
      </Card>

      {/* Scenario Selector */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Select Scenario</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {Object.entries(scenarios).map(([key, scenario]) => (
            <Card
              key={key}
              variant="interactive"
              onClick={() => setSelectedScenario(key)}
              className={`text-center ${selectedScenario === key ? 'ring-2 ring-purple-primary' : ''}`}
            >
              <scenario.icon className="h-8 w-8 text-purple-primary mx-auto mb-2" />
              <h3 className="font-medium text-white">{scenario.title}</h3>
            </Card>
          ))}
        </div>
      </div>

      {/* Your Rights */}
      <Card>
        <h2 className="text-lg font-semibold text-white mb-4">Your Rights - {currentScenario.title}</h2>
        <div className="space-y-3">
          {currentScenario.rights.map((right, index) => (
            <div key={index} className="flex items-start">
              <Shield className="h-5 w-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
              <span className="text-gray-300">{right}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* What to Say */}
      <Card>
        <h2 className="text-lg font-semibold text-white mb-4">What TO Say</h2>
        <div className="space-y-3">
          {currentScripts.whatToSay.map((script, index) => (
            <div key={index} className="bg-green-900/20 border border-green-700 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <p className="text-green-300 flex-1">{script}</p>
                <div className="flex space-x-2 ml-4">
                  <button
                    onClick={() => copyToClipboard(script)}
                    className="p-2 text-gray-400 hover:text-white transition-colors"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => speakText(script)}
                    className="p-2 text-gray-400 hover:text-white transition-colors"
                  >
                    <Volume2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* What NOT to Say */}
      <Card>
        <h2 className="text-lg font-semibold text-white mb-4">What NOT to Say/Do</h2>
        <div className="space-y-3">
          {currentScripts.whatNotToSay.map((item, index) => (
            <div key={index} className="bg-red-900/20 border border-red-700 rounded-lg p-4">
              <p className="text-red-300">{item}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Emergency Contact */}
      <Card className="bg-red-900/20 border border-red-700">
        <div className="flex items-center">
          <Phone className="h-6 w-6 text-red-400 mr-3" />
          <div>
            <h3 className="font-semibold text-red-300">Emergency Legal Assistance</h3>
            <p className="text-gray-300 text-sm mt-1">If you need immediate legal help, call the ACLU hotline</p>
            <Button variant="destructive" className="mt-3" onClick={() => window.open('tel:+18773287272')}>
              Call ACLU: (877) 328-7272
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default Rights