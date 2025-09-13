import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
  linkTo?: string;
}

const Logo: React.FC<LogoProps> = ({ 
  size = 'md', 
  showText = true, 
  className = '',
  linkTo = '/'
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20'
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg'
  };

  const innerSizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-16 h-16'
  };

  const letterSizes = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl',
    xl: 'text-2xl'
  };

  const logoElement = (
    <div className={`flex items-center space-x-2 ${className}`}>
      {/* Logo Icon */}
      <div className={`${sizeClasses[size]} bg-gradient-to-br from-blue-500 via-pink-500 to-yellow-500 rounded-full flex items-center justify-center shadow-lg`}>
        <div className={`${innerSizeClasses[size]} bg-white rounded-full flex items-center justify-center`}>
          <div className={`${letterSizes[size]} font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-pink-600 to-yellow-600`}>
            J
          </div>
        </div>
      </div>
      
      {/* Logo Text */}
      {showText && (
        <div className="hidden sm:block">
          <div className={`${textSizes[size]} font-bold text-gray-900`}>JANU</div>
          <div className={`${textSizes[size]} text-xs text-gray-600 -mt-1`}>COLLECTION</div>
        </div>
      )}
    </div>
  );

  if (linkTo) {
    return (
      <Link to={linkTo} className="hover:opacity-80 transition-opacity">
        {logoElement}
      </Link>
    );
  }

  return logoElement;
};

export default Logo;  
