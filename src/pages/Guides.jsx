import React, { useState } from 'react'
import { BookOpen, CheckCircle, AlertTriangle, Clock, Users, Scale } from 'lucide-react'
import Card from '../components/Card'
import { useUser } from '../context/UserContext'

const Guides = () => {
  const { selectedState, subscriptionStatus } = useUser()
  const [activeGuide, setActiveGuide] = useState('before-interaction')

  const guides = {
    'before-interaction': {
      title: 'Before Any Interaction',
      icon: Clock,
      sections: [
        {
          title: 'Mental Preparation',
          tips: [
            'Stay calm and remember your rights',
            'Keep your hands visible at all times',
            'Do not argue or resist, even if you believe the stop is unfair',
            'Remember that anything you say can be used against you'
          ]
        },
        {
          title: 'What to Have Ready',
          tips: [
            'Driver\'s license (if driving)',
            'Vehicle registration and insurance (if driving)',
            'Emergency contact information',
            'Know your rights scripts by heart'
          ]
        },
        {
          title: 'Document Preparation',
          tips: [
            'Keep documents easily accessible',
            'Consider using a clear document holder',
            'Ensure your phone is charged for recording',
            'Inform trusted contacts of your whereabouts'
          ]
        }
      ]
    },
    'during-interaction': {
      title: 'During the Interaction',
      icon: Users,
      sections: [
        {
          title: 'Body Language & Behavior',
          tips: [
            'Keep your hands visible and still',
            'Make slow, deliberate movements',
            'Maintain respectful but not submissive posture',
            'Avoid sudden movements or reaching for items'
          ]
        },
        {
          title: 'What to Say',
          tips: [
            '"Am I free to leave?" (if not under arrest)',
            '"I am exercising my right to remain silent"',
            '"I do not consent to any searches"',
            '"I would like to speak to an attorney"'
          ]
        },
        {
          title: 'What NOT to Do',
          tips: [
            'Do not argue about the legality of the stop',
            'Do not resist physically, even if you believe it\'s wrong',
            'Do not consent to searches',
            'Do not volunteer information beyond required documents'
          ]
        }
      ]
    },
    'after-interaction': {
      title: 'After the Interaction',
      icon: CheckCircle,
      sections: [
        {
          title: 'Immediate Actions',
          tips: [
            'Write down everything you remember',
            'Note officer badge numbers and patrol car numbers',
            'Document any injuries or property damage',
            'Save any recordings or photos taken'
          ]
        },
        {
          title: 'Legal Follow-up',
          tips: [
            'Contact an attorney if you believe your rights were violated',
            'File a complaint if necessary',
            'Keep all documentation organized',
            'Review what happened to learn for future interactions'
          ]
        },
        {
          title: 'Emotional Care',
          tips: [
            'Talk to trusted friends or family about the experience',
            'Consider counseling if the interaction was traumatic',
            'Remember that you handled the situation correctly',
            'Use the experience to educate others about rights'
          ]
        }
      ]
    },
    'common-mistakes': {
      title: 'Common Mistakes to Avoid',
      icon: AlertTriangle,
      sections: [
        {
          title: 'Communication Errors',
          tips: [
            'Talking too much or volunteering information',
            'Getting argumentative or confrontational',
            'Making jokes or sarcastic comments',
            'Assuming friendliness means the interaction is casual'
          ]
        },
        {
          title: 'Legal Missteps',
          tips: [
            'Consenting to searches "just to get it over with"',
            'Assuming you have to answer all questions',
            'Not invoking your right to remain silent clearly',
            'Believing you must explain yourself or prove innocence'
          ]
        },
        {
          title: 'Physical Mistakes',
          tips: [
            'Reaching for documents before being asked',
            'Making sudden or quick movements',
            'Turning away from officers or hiding hands',
            'Getting too close to officers or their equipment'
          ]
        }
      ]
    }
  }

  const scenarios = [
    {
      title: 'Traffic Stop Scenario',
      description: 'You\'re pulled over for speeding on your way to work.',
      steps: [
        'Pull over safely and turn off the engine',
        'Keep hands on steering wheel',
        'Wait for officer to approach',
        'Provide license, registration, and insurance when asked',
        'Exercise right to remain silent for other questions',
        'Do not consent to vehicle search'
      ],
      outcome: 'You receive a ticket but avoid escalation and protect your rights.',
      premium: true
    },
    {
      title: 'Home Visit Scenario',
      description: 'Police come to your door asking questions about a neighbor.',
      steps: [
        'Do not open the door fully',
        'Ask if they have a warrant',
        'State you do not consent to entry',
        'Exercise right to remain silent',
        'Ask for attorney if they persist',
        'Document the interaction'
      ],
      outcome: 'You protect your home and avoid self-incrimination.',
      premium: subscriptionStatus === 'free'
    },
    {
      title: 'Street Encounter Scenario',
      description: 'An officer approaches you while you\'re walking.',
      steps: [
        'Ask "Am I free to leave?"',
        'If detained, ask why',
        'Exercise right to remain silent',
        'Do not consent to searches',
        'Record if possible',
        'Comply with lawful orders only'
      ],
      outcome: 'You handle the encounter professionally while protecting your rights.',
      premium: subscriptionStatus === 'free'
    }
  ]

  const currentGuide = guides[activeGuide]

  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Best Practices & Guides</h1>
        <p className="text-gray-400">Learn how to handle police interactions safely and effectively</p>
      </div>

      {/* Guide Navigation */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {Object.entries(guides).map(([key, guide]) => (
          <Card
            key={key}
            variant="interactive"
            onClick={() => setActiveGuide(key)}
            className={`text-center ${activeGuide === key ? 'ring-2 ring-purple-primary' : ''}`}
          >
            <guide.icon className="h-6 w-6 text-purple-primary mx-auto mb-2" />
            <h3 className="font-medium text-white text-sm">{guide.title}</h3>
          </Card>
        ))}
      </div>

      {/* Current Guide Content */}
      <div>
        <div className="flex items-center mb-4">
          <currentGuide.icon className="h-6 w-6 text-purple-primary mr-3" />
          <h2 className="text-xl font-semibold text-white">{currentGuide.title}</h2>
        </div>

        <div className="space-y-6">
          {currentGuide.sections.map((section, index) => (
            <Card key={index}>
              <h3 className="text-lg font-semibold text-white mb-4">{section.title}</h3>
              <div className="space-y-3">
                {section.tips.map((tip, tipIndex) => (
                  <div key={tipIndex} className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300">{tip}</span>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Practical Scenarios */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
          <Scale className="h-6 w-6 mr-2" />
          Practical Scenarios
        </h2>
        <div className="space-y-4">
          {scenarios.map((scenario, index) => (
            <Card key={index} className={scenario.premium ? 'relative overflow-hidden' : ''}>
              {scenario.premium && (
                <div className="absolute top-4 right-4 bg-yellow-600 text-white text-xs px-2 py-1 rounded">
                  Premium
                </div>
              )}
              
              <h3 className="text-lg font-semibold text-white mb-2">{scenario.title}</h3>
              <p className="text-gray-400 mb-4">{scenario.description}</p>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-white mb-2">Steps to Take:</h4>
                  <ol className="space-y-2">
                    {scenario.steps.map((step, stepIndex) => (
                      <li key={stepIndex} className="flex items-start">
                        <span className="bg-purple-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                          {stepIndex + 1}
                        </span>
                        <span className="text-gray-300">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
                
                <div className="bg-green-900/20 border border-green-700 rounded-lg p-3">
                  <h4 className="font-medium text-green-300 mb-1">Expected Outcome:</h4>
                  <p className="text-gray-300 text-sm">{scenario.outcome}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Legal Disclaimer */}
      <Card className="bg-orange-900/20 border border-orange-700">
        <h3 className="font-semibold text-orange-300 mb-2">Important Reminder</h3>
        <p className="text-gray-300 text-sm">
          Every situation is unique, and these guidelines may not cover all circumstances. 
          When in doubt, prioritize your safety and comply with lawful orders. 
          You can address legal issues later with an attorney.
        </p>
      </Card>
    </div>
  )
}

export default Guides