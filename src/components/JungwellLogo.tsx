import React from 'react'

interface JungwellLogoProps {
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
  className?: string
}

export const JungwellLogo: React.FC<JungwellLogoProps> = ({ 
  size = 'md', 
  showText = true, 
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  }
  
  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl'
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Stylized J Flame Icon */}
      <div className={`${sizeClasses[size]} gradient-jungwell rounded-xl flex items-center justify-center shadow-lg`}>
        <svg 
          viewBox="0 0 24 24" 
          className="w-2/3 h-2/3 text-white"
          fill="currentColor"
        >
          <path d="M12 2C8.5 2 6 4.5 6 8c0 2.5 1.5 4.5 3 6l3 6 3-6c1.5-1.5 3-3.5 3-6 0-3.5-2.5-6-6-6zm0 8c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>
          <path d="M9 8c0-1.66 1.34-3 3-3s3 1.34 3 3c0 .5-.13.97-.36 1.37L12 12l-2.64-2.63C9.13 8.97 9 8.5 9 8z" opacity="0.7"/>
        </svg>
      </div>
      
      {/* Wordmark */}
      {showText && (
        <div className="flex flex-col">
          <h1 className={`font-poppins font-semibold text-foreground ${textSizeClasses[size]} leading-none`}>
            Jungwell<span className="text-jungwell-orange">.ai</span>
          </h1>
          {size !== 'sm' && (
            <p className="text-xs text-muted-foreground font-medium tracking-wide">
              AI-POWERED CS WORKBENCH
            </p>
          )}
        </div>
      )}
    </div>
  )
}