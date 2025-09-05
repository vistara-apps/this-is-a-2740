import React from 'react'

const InputWithLabel = ({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  error,
  helperText,
  className = '',
  inputClassName = '',
  ...props
}) => {
  const inputId = `input-${Math.random().toString(36).substr(2, 9)}`

  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label 
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <input
        id={inputId}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`
          w-full px-3 py-2 border rounded-md shadow-sm
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          disabled:bg-gray-50 disabled:text-gray-500
          ${error 
            ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
            : 'border-gray-300'
          }
          ${inputClassName}
        `}
        {...props}
      />
      
      {error && (
        <p className="text-sm text-red-600">
          {error}
        </p>
      )}
      
      {helperText && !error && (
        <p className="text-sm text-gray-500">
          {helperText}
        </p>
      )}
    </div>
  )
}

export default InputWithLabel
