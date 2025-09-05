import React from 'react'
import { AlertTriangle, Info, CheckCircle, X } from 'lucide-react'

const AlertBanner = ({ 
  variant = 'info', 
  title, 
  message, 
  onClose, 
  className = '' 
}) => {
  const variants = {
    info: {
      container: 'bg-blue-50 border-blue-200 text-blue-800',
      icon: Info,
      iconColor: 'text-blue-600'
    },
    warning: {
      container: 'bg-yellow-50 border-yellow-200 text-yellow-800',
      icon: AlertTriangle,
      iconColor: 'text-yellow-600'
    },
    error: {
      container: 'bg-red-50 border-red-200 text-red-800',
      icon: AlertTriangle,
      iconColor: 'text-red-600'
    },
    success: {
      container: 'bg-green-50 border-green-200 text-green-800',
      icon: CheckCircle,
      iconColor: 'text-green-600'
    }
  }

  const config = variants[variant]
  const Icon = config.icon

  return (
    <div className={`
      border rounded-lg p-4 flex items-start space-x-3
      ${config.container}
      ${className}
    `}>
      <Icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${config.iconColor}`} />
      
      <div className="flex-1 min-w-0">
        {title && (
          <h3 className="text-sm font-medium mb-1">
            {title}
          </h3>
        )}
        
        {message && (
          <p className="text-sm opacity-90">
            {message}
          </p>
        )}
      </div>

      {onClose && (
        <button
          onClick={onClose}
          className={`
            flex-shrink-0 p-1 rounded-md hover:bg-black/10 transition-colors
            ${config.iconColor}
          `}
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}

export default AlertBanner
