import React from 'react';
import { Button } from '@mui/material';

interface ButtonPatternThirtyEightProps {
  onClick?: () => void;
}

const ButtonPatternThirtyEight: React.FC<ButtonPatternThirtyEightProps> = ({ onClick }) => {
  const handleClick = () => {
    console.log('Pattern 38 ボタンがクリックされました！');
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
        overflow: 'hidden',
        
        // レーザー・プリズム分光
        background: `
          radial-gradient(ellipse at 20% 50%, rgba(239, 68, 68, 0.3) 0%, transparent 50%),
          radial-gradient(ellipse at 80% 50%, rgba(59, 130, 246, 0.3) 0%, transparent 50%),
          conic-gradient(from 0deg at 50% 50%,
            rgba(239, 68, 68, 0.1) 0deg,
            rgba(251, 146, 60, 0.1) 60deg,
            rgba(250, 204, 21, 0.1) 120deg,
            rgba(34, 197, 94, 0.1) 180deg,
            rgba(59, 130, 246, 0.1) 240deg,
            rgba(147, 51, 234, 0.1) 300deg,
            rgba(239, 68, 68, 0.1) 360deg
          ),
          linear-gradient(135deg, rgba(15, 23, 42, 0.05) 0%, rgba(30, 41, 59, 0.1) 100%)
        `,
        backgroundColor: 'rgba(2, 6, 23, 0.8)',
        color: '#e2e8f0',
        border: '2px solid #334155',
        fontWeight: 600,
        letterSpacing: '1px',
        borderRadius: '20px',
        width: '150px',
        height: '150px',
        minWidth: '150px',
        textTransform: 'none',
        fontSize: '13px',
        transition: 'all 0.4s ease',
        backgroundSize: '100% 100%, 100% 100%, 200% 200%, 100% 100%',
        boxShadow: `
          0 8px 25px rgba(15, 23, 42, 0.6),
          inset 0 1px 3px rgba(255, 255, 255, 0.1)
        `,
        textShadow: '0 0 8px rgba(226, 232, 240, 0.8)',

        '&::before': {
          content: '""',
          position: 'absolute',
          top: '48%',
          left: '10%',
          width: '80%',
          height: '4px',
          background: `
            linear-gradient(90deg,
              rgba(239, 68, 68, 0.9) 0%,
              rgba(251, 146, 60, 0.8) 16%,
              rgba(250, 204, 21, 0.8) 32%,
              rgba(34, 197, 94, 0.8) 48%,
              rgba(59, 130, 246, 0.8) 64%,
              rgba(147, 51, 234, 0.8) 80%,
              rgba(239, 68, 68, 0.9) 100%
            )
          `,
          borderRadius: '2px',
          animation: 'laser-beam 4s ease-in-out infinite',
          boxShadow: '0 0 10px currentColor',
        },

        '&::after': {
          content: '""',
          position: 'absolute',
          top: '20%',
          right: '20%',
          width: '60%',
          height: '60%',
          background: `
            conic-gradient(from 45deg at 50% 50%,
              rgba(239, 68, 68, 0.4) 0deg,
              rgba(251, 146, 60, 0.4) 51deg,
              rgba(250, 204, 21, 0.4) 102deg,
              rgba(34, 197, 94, 0.4) 153deg,
              rgba(59, 130, 246, 0.4) 204deg,
              rgba(147, 51, 234, 0.4) 255deg,
              rgba(168, 85, 247, 0.4) 306deg,
              rgba(239, 68, 68, 0.4) 360deg
            )
          `,
          borderRadius: '50%',
          animation: 'spectrum-prism 8s linear infinite',
          filter: 'blur(2px)',
        },

        '@keyframes laser-beam': {
          '0%, 100%': { 
            opacity: 0.7,
            transform: 'scaleX(1) scaleY(1)',
          },
          '50%': { 
            opacity: 1,
            transform: 'scaleX(1.2) scaleY(1.5)',
          },
        },

        '@keyframes spectrum-prism': {
          '0%': { 
            transform: 'rotate(0deg) scale(1)',
            opacity: 0.6,
          },
          '50%': { 
            transform: 'rotate(180deg) scale(1.1)',
            opacity: 0.9,
          },
          '100%': { 
            transform: 'rotate(360deg) scale(1)',
            opacity: 0.6,
          },
        },

        '@keyframes prism-dispersion': {
          '0%': { 
            backgroundPosition: '0% 50%, 0% 50%, 0% 50%, 0% 50%',
          },
          '100%': { 
            backgroundPosition: '100% 50%, 100% 50%, 200% 50%, 100% 50%',
          },
        },

        '@keyframes chromatic-pulse': {
          '0%, 100%': { 
            boxShadow: `
              0 8px 25px rgba(15, 23, 42, 0.7),
              inset 0 2px 4px rgba(255, 255, 255, 0.2),
              0 0 20px rgba(239, 68, 68, 0.2)
            ` 
          },
          '14%': { 
            boxShadow: `
              0 10px 30px rgba(15, 23, 42, 0.7),
              inset 0 2px 4px rgba(255, 255, 255, 0.2),
              0 0 25px rgba(251, 146, 60, 0.3)
            ` 
          },
          '28%': { 
            boxShadow: `
              0 10px 30px rgba(15, 23, 42, 0.7),
              inset 0 2px 4px rgba(255, 255, 255, 0.2),
              0 0 25px rgba(250, 204, 21, 0.3)
            ` 
          },
          '42%': { 
            boxShadow: `
              0 10px 30px rgba(15, 23, 42, 0.7),
              inset 0 2px 4px rgba(255, 255, 255, 0.2),
              0 0 25px rgba(34, 197, 94, 0.3)
            ` 
          },
          '56%': { 
            boxShadow: `
              0 10px 30px rgba(15, 23, 42, 0.7),
              inset 0 2px 4px rgba(255, 255, 255, 0.2),
              0 0 25px rgba(59, 130, 246, 0.3)
            ` 
          },
          '70%': { 
            boxShadow: `
              0 10px 30px rgba(15, 23, 42, 0.7),
              inset 0 2px 4px rgba(255, 255, 255, 0.2),
              0 0 25px rgba(147, 51, 234, 0.3)
            ` 
          },
          '84%': { 
            boxShadow: `
              0 10px 30px rgba(15, 23, 42, 0.7),
              inset 0 2px 4px rgba(255, 255, 255, 0.2),
              0 0 25px rgba(168, 85, 247, 0.3)
            ` 
          },
        },

        '&:hover': {
          transform: 'translateY(-6px) scale(1.05)',
          animation: 'prism-dispersion 5s linear infinite, chromatic-pulse 7s linear infinite',
          background: `
            radial-gradient(ellipse at 25% 50%, rgba(239, 68, 68, 0.5) 0%, transparent 60%),
            radial-gradient(ellipse at 75% 50%, rgba(59, 130, 246, 0.5) 0%, transparent 60%),
            conic-gradient(from 0deg at 50% 50%,
              rgba(239, 68, 68, 0.2) 0deg,
              rgba(251, 146, 60, 0.2) 60deg,
              rgba(250, 204, 21, 0.2) 120deg,
              rgba(34, 197, 94, 0.2) 180deg,
              rgba(59, 130, 246, 0.2) 240deg,
              rgba(147, 51, 234, 0.2) 300deg,
              rgba(239, 68, 68, 0.2) 360deg
            ),
            linear-gradient(135deg, rgba(15, 23, 42, 0.1) 0%, rgba(30, 41, 59, 0.2) 100%)
          `,
          backgroundColor: 'rgba(2, 6, 23, 0.9)',
          color: '#f1f5f9',
          borderColor: '#475569',
          textShadow: '0 0 12px rgba(241, 245, 249, 1)',

          '&::before': {
            animation: 'laser-beam 2s ease-in-out infinite',
            background: `
              linear-gradient(90deg,
                rgba(239, 68, 68, 1) 0%,
                rgba(251, 146, 60, 1) 16%,
                rgba(250, 204, 21, 1) 32%,
                rgba(34, 197, 94, 1) 48%,
                rgba(59, 130, 246, 1) 64%,
                rgba(147, 51, 234, 1) 80%,
                rgba(239, 68, 68, 1) 100%
              )
            `,
            boxShadow: '0 0 20px currentColor',
          },

          '&::after': {
            animation: 'spectrum-prism 4s linear infinite',
            background: `
              conic-gradient(from 45deg at 50% 50%,
                rgba(239, 68, 68, 0.7) 0deg,
                rgba(251, 146, 60, 0.7) 51deg,
                rgba(250, 204, 21, 0.7) 102deg,
                rgba(34, 197, 94, 0.7) 153deg,
                rgba(59, 130, 246, 0.7) 204deg,
                rgba(147, 51, 234, 0.7) 255deg,
                rgba(168, 85, 247, 0.7) 306deg,
                rgba(239, 68, 68, 0.7) 360deg
              )
            `,
            filter: 'blur(1px)',
          },
        },

        '&:active': {
          transform: 'translateY(-4px) scale(1.02)',
          transition: 'all 0.1s ease',
        },

        '&:focus': {
          outline: 'none',
        },
      }}
    >
      Pattern 38
    </Button>
  );
};

export default ButtonPatternThirtyEight;