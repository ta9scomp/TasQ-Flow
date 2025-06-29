import React from 'react';
import { Button } from '@mui/material';

interface ButtonPatternTwentyThreeProps {
  onClick?: () => void;
}

const ButtonPatternTwentyThree: React.FC<ButtonPatternTwentyThreeProps> = ({ onClick }) => {
  const handleClick = () => {
    console.log('Pattern 23 ボタンがクリックされました！');
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
        
        // ソーラー・フレア
        background: `
          radial-gradient(circle at 50% 50%, #fed7aa 0%, #fdba74 30%, #fb923c 60%, #ea580c 100%),
          radial-gradient(circle at 30% 20%, rgba(255, 255, 255, 0.4) 0%, transparent 25%),
          radial-gradient(circle at 70% 80%, rgba(234, 88, 12, 0.6) 0%, transparent 30%)
        `,
        color: '#7c2d12',
        border: '3px solid #ea580c',
        fontWeight: 700,
        letterSpacing: '1.2px',
        borderRadius: '50%',
        width: '150px',
        height: '150px',
        minWidth: '150px',
        textTransform: 'none',
        fontSize: '13px',
        transition: 'all 0.4s ease',
        boxShadow: `
          0 8px 25px rgba(234, 88, 12, 0.4),
          inset 0 2px 6px rgba(255, 255, 255, 0.3),
          inset 0 -2px 6px rgba(124, 45, 18, 0.4)
        `,
        textShadow: '0 2px 4px rgba(124, 45, 18, 0.8), 0 0 12px rgba(255, 255, 255, 0.3)',

        '&::before': {
          content: '""',
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '100px',
          height: '100px',
          background: 'conic-gradient(from 0deg, transparent 0%, rgba(255, 255, 255, 0.6) 10%, transparent 20%, rgba(251, 146, 60, 0.8) 30%, transparent 40%, rgba(255, 255, 255, 0.4) 50%, transparent 60%, rgba(253, 186, 116, 0.6) 70%, transparent 80%, rgba(255, 255, 255, 0.5) 90%, transparent 100%)',
          borderRadius: '50%',
          transform: 'translate(-50%, -50%)',
          animation: 'solar-flare 3s linear infinite',
          opacity: 0.8,
        },

        '&::after': {
          content: '""',
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '60px',
          height: '60px',
          background: 'radial-gradient(circle, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.6) 30%, rgba(251, 146, 60, 0.4) 60%, transparent 100%)',
          borderRadius: '50%',
          transform: 'translate(-50%, -50%)',
          animation: 'solar-core 4s ease-in-out infinite',
        },

        '@keyframes solar-flare': {
          '0%': { transform: 'translate(-50%, -50%) rotate(0deg)' },
          '100%': { transform: 'translate(-50%, -50%) rotate(360deg)' },
        },

        '@keyframes solar-core': {
          '0%, 100%': { 
            opacity: 0.8,
            transform: 'translate(-50%, -50%) scale(1)',
          },
          '50%': { 
            opacity: 1,
            transform: 'translate(-50%, -50%) scale(1.2)',
          },
        },

        '@keyframes solar-intensity': {
          '0%, 100%': { 
            boxShadow: `
              0 8px 25px rgba(234, 88, 12, 0.5),
              inset 0 2px 6px rgba(255, 255, 255, 0.4),
              inset 0 -2px 6px rgba(124, 45, 18, 0.5),
              0 0 30px rgba(234, 88, 12, 0.4)
            `,
            borderColor: '#ea580c',
          },
          '25%': { 
            boxShadow: `
              0 12px 35px rgba(251, 146, 60, 0.6),
              inset 0 3px 8px rgba(255, 255, 255, 0.5),
              inset 0 -3px 8px rgba(124, 45, 18, 0.6),
              0 0 40px rgba(251, 146, 60, 0.5)
            `,
            borderColor: '#fb923c',
          },
          '50%': { 
            boxShadow: `
              0 15px 45px rgba(255, 154, 0, 0.7),
              inset 0 4px 10px rgba(255, 255, 255, 0.6),
              inset 0 -4px 10px rgba(124, 45, 18, 0.7),
              0 0 50px rgba(255, 154, 0, 0.6)
            `,
            borderColor: '#ff9a00',
          },
          '75%': { 
            boxShadow: `
              0 12px 35px rgba(251, 146, 60, 0.6),
              inset 0 3px 8px rgba(255, 255, 255, 0.5),
              inset 0 -3px 8px rgba(124, 45, 18, 0.6),
              0 0 40px rgba(251, 146, 60, 0.5)
            `,
            borderColor: '#fb923c',
          },
        },

        '&:hover': {
          transform: 'translateY(-6px) scale(1.08)',
          background: `
            radial-gradient(circle at 50% 50%, #ffedd5 0%, #fed7aa 30%, #fdba74 60%, #f97316 100%),
            radial-gradient(circle at 35% 25%, rgba(255, 255, 255, 0.6) 0%, transparent 30%),
            radial-gradient(circle at 65% 75%, rgba(249, 115, 22, 0.8) 0%, transparent 35%)
          `,
          color: '#9a3412',
          animation: 'solar-intensity 2s ease-in-out infinite',
          textShadow: '0 3px 6px rgba(154, 52, 18, 1), 0 0 18px rgba(255, 255, 255, 0.5)',

          '&::before': {
            animation: 'solar-flare 1.5s linear infinite',
            opacity: 1,
          },

          '&::after': {
            animation: 'solar-core 2s ease-in-out infinite',
            background: 'radial-gradient(circle, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0.8) 30%, rgba(253, 186, 116, 0.6) 60%, transparent 100%)',
          },
        },

        '&:active': {
          transform: 'translateY(-3px) scale(1.05)',
          transition: 'all 0.1s ease',
        },

        '&:focus': {
          outline: 'none',
        },
      }}
    >
      Pattern 23
    </Button>
  );
};

export default ButtonPatternTwentyThree;