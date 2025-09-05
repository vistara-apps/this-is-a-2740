import React, { useState } from 'react'
import { MapPin, Search, Lock, ChevronDown, ChevronUp } from 'lucide-react'
import Card from '../components/Card'
import Button from '../components/Button'
import { useUser } from '../context/UserContext'

const StateLaws = () => {
  const { selectedState, setSelectedState, subscriptionStatus } = useUser()
  const [expandedSection, setExpandedSection] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  const states = [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut',
    'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
    'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan',
    'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
    'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio',
    'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
    'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia',
    'Wisconsin', 'Wyoming'
  ]

  const lawSections = {
    'search-and-seizure': {
      title: 'Search and Seizure Laws',
      free: {
        summary: 'Basic overview of Fourth Amendment protections against unreasonable searches.',
        content: 'In California, police generally need a warrant to search your person, vehicle, or home. However, there are several exceptions including consent, plain view, and exigent circumstances.'
      },
      premium: {
        details: 'Detailed analysis of California Penal Code Section 1525-1542 regarding search warrants, exceptions under Terry v. Ohio for stop-and-frisk, vehicle search exceptions under Carroll Doctrine, and recent case law updates including People v. Diaz (2019).'
      }
    },
    'traffic-stops': {
      title: 'Traffic Stop Procedures',
      free: {
        summary: 'Basic rights during traffic stops and required documents.',
        content: 'During a traffic stop in California, you must provide license, registration, and proof of insurance. You have the right to remain silent beyond providing these documents.'
      },
      premium: {
        details: 'Complete guide to California Vehicle Code Sections 12951, 16028, and 40302. Detailed breakdown of when police can extend a stop, passenger rights, vehicle impound procedures, and DUI checkpoint laws.'
      }
    },
    'recording-rights': {
      title: 'Right to Record Police',
      free: {
        summary: 'General right to record police in public spaces.',
        content: 'California is a two-party consent state, but you can record police in public spaces where there is no expectation of privacy.'
      },
      premium: {
        details: 'Comprehensive analysis of California Penal Code Section 632, Glik v. Cunniffe precedent, distance requirements, audio vs. video recording distinctions, and penalties for interference with recording.'
      }
    },
    'detention-arrest': {
      title: 'Detention vs. Arrest',
      free: {
        summary: 'Understanding the difference between being detained and arrested.',
        content: 'Police can briefly detain you if they have reasonable suspicion of criminal activity. An arrest requires probable cause.'
      },
      premium: {
        details: 'Detailed analysis of Terry stops, Miranda requirements, booking procedures, bail regulations under California Penal Code Section 1269b, and your rights during each phase.'
      }
    }
  }

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section)
  }

  const filteredSections = Object.entries(lawSections).filter(([key, section]) =>
    section.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    section.free.content.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">State Laws</h1>
        <p className="text-gray-400">Legal information specific to your state</p>
      </div>

      {/* State Selector */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white flex items-center">
            <MapPin className="h-5 w-5 mr-2" />
            Select Your State
          </h2>
        </div>
        <select
          value={selectedState}
          onChange={(e) => setSelectedState(e.target.value)}
          className="input-field"
        >
          {states.map(state => (
            <option key={state} value={state}>{state}</option>
          ))}
        </select>
      </Card>

      {/* Search */}
      <Card>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search laws and regulations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-10"
          />
        </div>
      </Card>

      {/* Current State Info */}
      <Card className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 border-blue-700">
        <h2 className="text-xl font-semibold text-white mb-2">Laws for {selectedState}</h2>
        <p className="text-blue-200">
          Legal information compiled from state statutes, case law, and regulations.
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </Card>

      {/* Law Sections */}
      <div className="space-y-4">
        {filteredSections.map(([key, section]) => (
          <Card key={key}>
            <div 
              className="flex items-center justify-between cursor-pointer"
              onClick={() => toggleSection(key)}
            >
              <h3 className="text-lg font-semibold text-white">{section.title}</h3>
              {expandedSection === key ? (
                <ChevronUp className="h-5 w-5 text-gray-400" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-400" />
              )}
            </div>
            
            <p className="text-gray-400 text-sm mt-2">{section.free.summary}</p>

            {expandedSection === key && (
              <div className="mt-4 space-y-4 animate-slide-up">
                {/* Free Content */}
                <div className="bg-dark-bg rounded-lg p-4">
                  <h4 className="font-medium text-white mb-2">Overview</h4>
                  <p className="text-gray-300">{section.free.content}</p>
                </div>

                {/* Premium Content */}
                {subscriptionStatus === 'premium' ? (
                  <div className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-4">
                    <h4 className="font-medium text-yellow-300 mb-2">Detailed Analysis (Premium)</h4>
                    <p className="text-gray-300">{section.premium.details}</p>
                  </div>
                ) : (
                  <div className="bg-gray-900/50 border border-gray-600 rounded-lg p-4 relative">
                    <div className="absolute inset-0 bg-gray-900/80 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <Lock className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-white font-medium mb-2">Premium Content</p>
                        <p className="text-gray-400 text-sm mb-4">Unlock detailed legal analysis and case law</p>
                        <Button variant="primary">Upgrade to Premium</Button>
                      </div>
                    </div>
                    <h4 className="font-medium text-yellow-300 mb-2">Detailed Analysis (Premium)</h4>
                    <p className="text-gray-300 blur-sm">{section.premium.details}</p>
                  </div>
                )}
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Legal Disclaimer */}
      <Card className="bg-orange-900/20 border border-orange-700">
        <h3 className="font-semibold text-orange-300 mb-2">Legal Disclaimer</h3>
        <p className="text-gray-300 text-sm">
          This information is for educational purposes only and does not constitute legal advice. 
          Laws can change frequently and vary by jurisdiction. For specific legal situations, 
          consult with a qualified attorney in your area.
        </p>
      </Card>
    </div>
  )
}

export default StateLaws