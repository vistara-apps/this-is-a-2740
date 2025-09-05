import React, { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

const AccordionItem = ({ 
  title, 
  children, 
  isOpen, 
  onToggle, 
  className = '' 
}) => {
  return (
    <div className={`border border-gray-200 rounded-lg ${className}`}>
      <button
        onClick={onToggle}
        className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-gray-50 transition-colors rounded-lg"
      >
        <span className="font-medium text-gray-900">{title}</span>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-gray-500" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-500" />
        )}
      </button>
      
      {isOpen && (
        <div className="px-4 pb-4 text-gray-700">
          {children}
        </div>
      )}
    </div>
  )
}

const Accordion = ({ 
  items = [], 
  allowMultiple = false, 
  className = '' 
}) => {
  const [openItems, setOpenItems] = useState(new Set())

  const toggleItem = (index) => {
    const newOpenItems = new Set(openItems)
    
    if (allowMultiple) {
      if (newOpenItems.has(index)) {
        newOpenItems.delete(index)
      } else {
        newOpenItems.add(index)
      }
    } else {
      // Single item mode
      if (newOpenItems.has(index)) {
        newOpenItems.clear()
      } else {
        newOpenItems.clear()
        newOpenItems.add(index)
      }
    }
    
    setOpenItems(newOpenItems)
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {items.map((item, index) => (
        <AccordionItem
          key={index}
          title={item.title}
          isOpen={openItems.has(index)}
          onToggle={() => toggleItem(index)}
        >
          {item.content}
        </AccordionItem>
      ))}
    </div>
  )
}

export default Accordion
