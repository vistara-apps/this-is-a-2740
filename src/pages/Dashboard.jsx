import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Shield, FileText, Mic, BookOpen, AlertTriangle, MapPin, Clock } from 'lucide-react'
import Card from '../components/Card'
import Button from '../components/Button'
import { useUser } from '../context/UserContext'

const Dashboard = () => {
  const navigate = useNavigate()
  const { selectedState, subscriptionStatus } = useUser()

  const quickActions = [
    {
      title: 'Know Your Rights',
      description: 'Instant access to your rights during police interactions',
      icon: Shield,
      path: '/rights',
      color: 'bg-blue-600'
    },
    {
      title: 'Record Incident',
      description: 'Quickly document an interaction with law enforcement',
      icon: Mic,
      path: '/recording',
      color: 'bg-red-600'
    },
    {
      title: 'State Laws',
      description: 'State-specific legal information and summaries',
      icon: FileText,
      path: '/state-laws',
      color: 'bg-green-600'
    },
    {
      title: 'Best Practices',
      description: 'Learn how to handle interactions effectively',
      icon: BookOpen,
      path: '/guides',
      color: 'bg-purple-600'
    }
  ]

  const recentAlerts = [
    {
      title: 'New legislation in California',
      description: 'Updated rights regarding vehicle searches',
      time: '2 hours ago',
      type: 'info'
    },
    {
      title: 'Important reminder',
      description: 'Always ask "Am I free to leave?" during stops',
      time: '1 day ago',
      type: 'warning'
    }
  ]

  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-6 text-white">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Welcome to KnowYourRights AI</h1>
        <p className="text-purple-100 mb-4">Instant legal clarity for your safety and peace of mind</p>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-1" />
            <span>{selectedState}</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            <span>Last updated: Today</span>
          </div>
        </div>
      </div>

      {/* Emergency Alert */}
      <Card className="border-l-4 border-red-500 bg-red-900/20">
        <div className="flex items-start">
          <AlertTriangle className="h-6 w-6 text-red-400 mr-3 mt-0.5" />
          <div>
            <h3 className="font-semibold text-red-300">Emergency Recording</h3>
            <p className="text-gray-300 mt-1">If you're currently in an interaction with law enforcement, tap here to start recording immediately.</p>
            <Button 
              variant="destructive" 
              className="mt-3"
              onClick={() => navigate('/recording')}
            >
              Start Emergency Recording
            </Button>
          </div>
        </div>
      </Card>

      {/* Quick Actions Grid */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <Card
              key={index}
              variant="interactive"
              onClick={() => navigate(action.path)}
              className="text-center"
            >
              <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mx-auto mb-3`}>
                <action.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-white mb-2">{action.title}</h3>
              <p className="text-gray-400 text-sm">{action.description}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Alerts */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">Recent Alerts & Updates</h2>
        <div className="space-y-3">
          {recentAlerts.map((alert, index) => (
            <Card key={index} className="flex items-start space-x-3">
              <div className={`w-2 h-2 rounded-full mt-2 ${alert.type === 'warning' ? 'bg-yellow-400' : 'bg-blue-400'}`} />
              <div className="flex-1">
                <h4 className="font-medium text-white">{alert.title}</h4>
                <p className="text-gray-400 text-sm mt-1">{alert.description}</p>
                <span className="text-xs text-gray-500 mt-2 block">{alert.time}</span>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Subscription Upsell */}
      {subscriptionStatus === 'free' && (
        <Card className="bg-gradient-to-r from-yellow-600 to-orange-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-lg">Upgrade to Premium</h3>
              <p className="text-yellow-100 mt-1">Get access to detailed state laws, extended scripts, and incident reporting tools.</p>
            </div>
            <Button variant="secondary" className="bg-white text-yellow-600 hover:bg-gray-100">
              Upgrade Now
            </Button>
          </div>
        </Card>
      )}
    </div>
  )
}

export default Dashboard