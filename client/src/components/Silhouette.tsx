/**
 * Silhouette Component
 * 
 * Renders scalable SVG silhouettes for representing people in the conversation.
 * Can be solid or semi-transparent (ghosted) for personas.
 */

import React from 'react';

interface SilhouetteProps {
  variant?: 'solid' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeMap = {
  sm: 60,
  md: 100,
  lg: 140,
};

export const Silhouette: React.FC<SilhouetteProps> = ({ 
  variant = 'solid', 
  size = 'md',
  className = '' 
}) => {
  const dimension = sizeMap[size];
  const opacity = variant === 'ghost' ? 0.3 : 1;
  const fill = variant === 'ghost' ? 'oklch(0.3 0.01 65)' : 'oklch(0.2 0.01 65)';

  return (
    <svg
      width={dimension}
      height={dimension}
      viewBox="0 0 100 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ opacity }}
    >
      {/* Head */}
      <circle cx="50" cy="25" r="18" fill={fill} />
      
      {/* Shoulders and torso */}
      <path
        d="M 32 43 Q 32 50 35 65 L 35 100 Q 35 110 45 115 L 45 140 L 55 140 L 55 115 Q 65 110 65 100 L 65 65 Q 68 50 68 43 Q 68 40 65 38 L 35 38 Q 32 40 32 43 Z"
        fill={fill}
      />
      
      {/* Arms */}
      <path
        d="M 35 50 L 20 75 Q 18 80 20 85 L 25 90"
        stroke={fill}
        strokeWidth="8"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M 65 50 L 80 75 Q 82 80 80 85 L 75 90"
        stroke={fill}
        strokeWidth="8"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
};

export default Silhouette;
