import React from 'react'

type IconButtonProps = {
  icon: React.ReactNode
  selectedIcon: React.ReactNode
  isSelected: boolean
  onClick: () => void
  ariaLabel: string
}

const IconButton = React.memo(({ icon, selectedIcon, isSelected, onClick, ariaLabel }: IconButtonProps) => {
  return (
    <button 
      onClick={onClick} 
      className="text-white cursor-pointer transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 rounded"
      aria-label={ariaLabel}
    >
      {isSelected ? selectedIcon : icon}
    </button>
  )
})

IconButton.displayName = 'IconButton'

export default IconButton
