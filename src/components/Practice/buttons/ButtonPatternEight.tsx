import React from 'react';
import { Button } from '@mui/material';


interface ButtonPatternEightProps {
  onClick?: () => void;
}

const ButtonPatternEight: React.FC<ButtonPatternEightProps> = ({ onClick }) => {
  const handleClick = () => {
    console.log('Pattern 8ボタンがクリックされました！');
    if (onClick) {
      onClick();
    }
  };

  return (
    <Button
      variant="outlined"
      
      onClick={handleClick}
      sx={{
        position: 'relative',
        
        
        
        // クォンタム・インターフェース
        background: `
          linear-gradient(45deg, 
            rgba(6, 78, 59, 0.9) 0%, 
            rgba(5, 150, 105, 0.8) 25%, 
            rgba(6, 78, 59, 0.9) 50%, 
            rgba(5, 150, 105, 0.8) 75%, 
            rgba(6, 78, 59, 0.9) 100%
          ),
          radial-gradient(circle at 30% 30%, rgba(16, 185, 129, 0.2) 0%, transparent 50%),
          radial-gradient(circle at 70% 70%, rgba(52, 211, 153, 0.2) 0%, transparent 50%)
        `,
        color: '#10b981',
        border: '1px solid rgba(16, 185, 129, 0.4)',
        fontWeight: 600,
        letterSpacing: '1.5px',
        borderRadius: '6px',
        width: '150px',
        height: '150px',
        minWidth: '150px',
        textTransform: 'none',
        fontSize: '12px',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        backdropFilter: 'blur(12px)',
        boxShadow: `
          0 0 25px rgba(16, 185, 129, 0.2),
          inset 0 1px 3px rgba(52, 211, 153, 0.1)
        `,
        textShadow: '0 0 10px rgba(16, 185, 129, 0.8)',
        fontFamily: 'monospace',

        '&::before': {
          content: '""',
          position: 'absolute',
          top: '0',
          left: '0',
          right: '0',
          bottom: '0',
          background: `
            repeating-linear-gradient(
              0deg,
              transparent 0px,
              rgba(16, 185, 129, 0.05) 1px,
              transparent 2px,
              rgba(52, 211, 153, 0.05) 3px,
              transparent 15px
            ),
            repeating-linear-gradient(
              90deg,
              transparent 0px,
              rgba(16, 185, 129, 0.03) 1px,
              transparent 2px,
              rgba(52, 211, 153, 0.03) 3px,
              transparent 15px
            )
          `,
          animation: 'quantum-grid 5s linear infinite',
        },

        '&::after': {
          content: '"01"',
          position: 'absolute',
          top: '10px',
          left: '10px',
          fontSize: '8px',
          color: 'rgba(16, 185, 129, 0.6)',
          fontFamily: 'monospace',
          pointerEvents: 'none',
        },

        '@keyframes quantum-grid': {
          '0%': { 
            transform: 'translate(0, 0)',
            opacity: 0.6,
          },
          '50%': { 
            transform: 'translate(1px, 1px)',
            opacity: 0.9,
          },
          '100%': { 
            transform: 'translate(0, 0)',
            opacity: 0.6,
          },
        },

        '@keyframes quantum-field': {
          '0%, 100%': { 
            boxShadow: `
              0 0 25px rgba(16, 185, 129, 0.3),
              inset 0 1px 3px rgba(52, 211, 153, 0.15),
              0 0 50px rgba(5, 150, 105, 0.2)
            `,
            borderColor: 'rgba(16, 185, 129, 0.5)',
          },
          '50%': { 
            boxShadow: `
              0 0 35px rgba(52, 211, 153, 0.4),
              inset 0 2px 5px rgba(16, 185, 129, 0.2),
              0 0 70px rgba(6, 78, 59, 0.3)
            `,
            borderColor: 'rgba(52, 211, 153, 0.7)',
          },
        },

        '&:hover': {
          transform: 'translateY(-1px) scale(1.02)',
          animation: 'quantum-field 2s ease-in-out infinite',
          background: `
            linear-gradient(45deg, 
              rgba(6, 78, 59, 0.95) 0%, 
              rgba(5, 150, 105, 0.85) 25%, 
              rgba(6, 78, 59, 0.95) 50%, 
              rgba(5, 150, 105, 0.85) 75%, 
              rgba(6, 78, 59, 0.95) 100%
            ),
            radial-gradient(circle at 35% 35%, rgba(16, 185, 129, 0.3) 0%, transparent 55%),
            radial-gradient(circle at 65% 65%, rgba(52, 211, 153, 0.3) 0%, transparent 55%)
          `,
          color: '#34d399',
          textShadow: '0 0 15px rgba(52, 211, 153, 1)',

          '&::before': {
            animation: 'quantum-grid 2.5s linear infinite',
          },

          '&::after': {
            color: 'rgba(52, 211, 153, 1)',
          },
        },
        '&:active': {
          transform: 'translateY(-2px) scale(1.02)',
          transition: 'all 0.1s ease',
        },
        '&:focus': {
          outline: 'none',
        },
      }}
    >
      Pattern 8
    </Button>
  );
};

export default ButtonPatternEight;