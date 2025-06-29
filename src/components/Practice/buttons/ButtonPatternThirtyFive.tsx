import React from 'react';
import { Button } from '@mui/material';

interface ButtonPatternThirtyFiveProps {
  onClick?: () => void;
}

const ButtonPatternThirtyFive: React.FC<ButtonPatternThirtyFiveProps> = ({ onClick }) => {
  const handleClick = () => {
    console.log('Pattern 35 ボタンがクリックされました！');
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
        
        // 光ファイバー・ディスパージョン
        background: `
          linear-gradient(0deg, 
            rgba(15, 23, 42, 0.8) 0%,
            rgba(30, 41, 59, 0.6) 25%,
            rgba(51, 65, 85, 0.4) 50%,
            rgba(30, 41, 59, 0.6) 75%,
            rgba(15, 23, 42, 0.8) 100%
          ),
          repeating-linear-gradient(
            90deg,
            transparent 0px,
            rgba(59, 130, 246, 0.3) 2px,
            rgba(168, 85, 247, 0.3) 4px,
            rgba(236, 72, 153, 0.3) 6px,
            rgba(251, 146, 60, 0.3) 8px,
            rgba(34, 197, 94, 0.3) 10px,
            transparent 12px
          )
        `,
        color: '#e2e8f0',
        border: '2px solid #475569',
        fontWeight: 600,
        letterSpacing: '1px',
        borderRadius: '25px',
        width: '150px',
        height: '150px',
        minWidth: '150px',
        textTransform: 'none',
        fontSize: '13px',
        transition: 'all 0.4s ease',
        backgroundSize: '100% 100%, 200% 100%',
        boxShadow: `
          0 8px 25px rgba(15, 23, 42, 0.5),
          inset 0 1px 3px rgba(255, 255, 255, 0.1)
        `,
        textShadow: '0 0 10px rgba(229, 231, 235, 0.8)',

        '&::before': {
          content: '""',
          position: 'absolute',
          top: '10px',
          left: '10px',
          right: '10px',
          bottom: '10px',
          background: `
            repeating-linear-gradient(
              0deg,
              transparent 0px,
              rgba(59, 130, 246, 0.2) 5px,
              transparent 10px,
              rgba(168, 85, 247, 0.2) 15px,
              transparent 20px,
              rgba(236, 72, 153, 0.2) 25px,
              transparent 30px
            )
          `,
          borderRadius: '20px',
          animation: 'fiber-flow 6s linear infinite',
        },

        '&::after': {
          content: '""',
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '80%',
          height: '2px',
          background: `
            linear-gradient(90deg, 
              transparent 0%,
              rgba(59, 130, 246, 0.8) 20%,
              rgba(168, 85, 247, 0.8) 40%,
              rgba(236, 72, 153, 0.8) 60%,
              rgba(251, 146, 60, 0.8) 80%,
              transparent 100%
            )
          `,
          transform: 'translate(-50%, -50%)',
          animation: 'light-pulse 3s ease-in-out infinite',
          borderRadius: '1px',
          boxShadow: '0 0 10px currentColor',
        },

        '@keyframes fiber-flow': {
          '0%': { 
            backgroundPosition: '0% 0%',
            opacity: 0.6,
          },
          '100%': { 
            backgroundPosition: '0% 100%',
            opacity: 0.8,
          },
        },

        '@keyframes light-pulse': {
          '0%, 100%': { 
            opacity: 0.3,
            transform: 'translate(-50%, -50%) scaleX(0.8)',
          },
          '50%': { 
            opacity: 1,
            transform: 'translate(-50%, -50%) scaleX(1.2)',
          },
        },

        '@keyframes dispersion-wave': {
          '0%': { 
            backgroundPosition: '0% 50%, 0% 50%',
          },
          '100%': { 
            backgroundPosition: '100% 50%, 200% 50%',
          },
        },

        '@keyframes chromatic-shift': {
          '0%, 100%': { 
            boxShadow: `
              0 8px 25px rgba(15, 23, 42, 0.6),
              inset 0 2px 4px rgba(255, 255, 255, 0.2),
              0 0 20px rgba(59, 130, 246, 0.3)
            ` 
          },
          '20%': { 
            boxShadow: `
              0 10px 30px rgba(15, 23, 42, 0.6),
              inset 0 2px 4px rgba(255, 255, 255, 0.2),
              0 0 25px rgba(168, 85, 247, 0.4)
            ` 
          },
          '40%': { 
            boxShadow: `
              0 10px 30px rgba(15, 23, 42, 0.6),
              inset 0 2px 4px rgba(255, 255, 255, 0.2),
              0 0 25px rgba(236, 72, 153, 0.4)
            ` 
          },
          '60%': { 
            boxShadow: `
              0 10px 30px rgba(15, 23, 42, 0.6),
              inset 0 2px 4px rgba(255, 255, 255, 0.2),
              0 0 25px rgba(251, 146, 60, 0.4)
            ` 
          },
          '80%': { 
            boxShadow: `
              0 10px 30px rgba(15, 23, 42, 0.6),
              inset 0 2px 4px rgba(255, 255, 255, 0.2),
              0 0 25px rgba(34, 197, 94, 0.4)
            ` 
          },
        },

        '&:hover': {
          transform: 'translateY(-5px)',
          animation: 'dispersion-wave 4s linear infinite, chromatic-shift 5s ease-in-out infinite',
          background: `
            linear-gradient(0deg, 
              rgba(15, 23, 42, 0.9) 0%,
              rgba(30, 41, 59, 0.7) 25%,
              rgba(51, 65, 85, 0.5) 50%,
              rgba(30, 41, 59, 0.7) 75%,
              rgba(15, 23, 42, 0.9) 100%
            ),
            repeating-linear-gradient(
              90deg,
              transparent 0px,
              rgba(59, 130, 246, 0.5) 2px,
              rgba(168, 85, 247, 0.5) 4px,
              rgba(236, 72, 153, 0.5) 6px,
              rgba(251, 146, 60, 0.5) 8px,
              rgba(34, 197, 94, 0.5) 10px,
              transparent 12px
            )
          `,
          color: '#f1f5f9',
          borderColor: '#64748b',
          textShadow: '0 0 15px rgba(229, 231, 235, 1)',

          '&::before': {
            animation: 'fiber-flow 3s linear infinite',
            background: `
              repeating-linear-gradient(
                0deg,
                transparent 0px,
                rgba(59, 130, 246, 0.4) 5px,
                transparent 10px,
                rgba(168, 85, 247, 0.4) 15px,
                transparent 20px,
                rgba(236, 72, 153, 0.4) 25px,
                transparent 30px
              )
            `,
          },

          '&::after': {
            animation: 'light-pulse 1.5s ease-in-out infinite',
            background: `
              linear-gradient(90deg, 
                transparent 0%,
                rgba(59, 130, 246, 1) 20%,
                rgba(168, 85, 247, 1) 40%,
                rgba(236, 72, 153, 1) 60%,
                rgba(251, 146, 60, 1) 80%,
                transparent 100%
              )
            `,
            boxShadow: '0 0 20px currentColor',
          },
        },

        '&:active': {
          transform: 'translateY(-3px) scale(0.98)',
          transition: 'all 0.1s ease',
        },

        '&:focus': {
          outline: 'none',
        },
      }}
    >
      Pattern 35
    </Button>
  );
};

export default ButtonPatternThirtyFive;