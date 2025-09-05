import React from 'react'

const Card = ({ children, className = '', variant = 'default', onClick }) => {
  const baseClasses = 'card animate-fade-in'
  const variantClasses = {
    default: '',
    interactive: 'hover:shadow-modal cursor-pointer transition-shadow duration-200'
  }

  return (
    <div 
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

export default Card