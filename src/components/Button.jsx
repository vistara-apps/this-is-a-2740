import React from 'react'

const Button = ({ children, variant = 'primary', className = '', onClick, disabled = false, ...props }) => {
  const baseClasses = 'font-medium px-6 py-3 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
  
  const variantClasses = {
    primary: 'bg-purple-primary hover:bg-purple-light text-white',
    secondary: 'bg-dark-card hover:bg-dark-surface text-white border border-gray-600',
    outline: 'border border-purple-primary text-purple-primary hover:bg-purple-primary hover:text-white',
    destructive: 'bg-red-600 hover:bg-red-700 text-white'
  }

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button