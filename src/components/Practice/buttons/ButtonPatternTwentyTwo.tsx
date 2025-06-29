import React from 'react';
import { Button } from '@mui/material';

interface ButtonPatternTwentyTwoProps {
  onClick?: () => void;
}

const ButtonPatternTwentyTwo: React.FC<ButtonPatternTwentyTwoProps> = ({ onClick }) => {
  const handleClick = () => {
    console.log('Pattern 22 ボタンがクリックされました！');
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
        
        // ムーンライト・セレニティ
        background: `
          radial-gradient(circle at 40% 30%, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%),
          radial-gradient(circle at 70% 70%, rgba(148, 163, 184, 0.3) 0%, transparent 40%)
        `,
        color: '#475569',
        border: '3px solid #cbd5e1',
        fontWeight: 600,
        letterSpacing: '0.8px',
        borderRadius: '50%',
        width: '150px',
        height: '150px',
        minWidth: '150px',
        textTransform: 'none',
        fontSize: '13px',
        transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: `
          0 8px 25px rgba(148, 163, 184, 0.4),
          inset 0 3px 8px rgba(255, 255, 255, 0.8),
          inset 0 -3px 8px rgba(148, 163, 184, 0.3)
        `,
        textShadow: '0 1px 3px rgba(255, 255, 255, 0.8)',

        '&::before': {
          content: '""',
          position: 'absolute',
          top: '30px',
          left: '30px',
          width: '90px',
          height: '90px',
          background: `
            radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.6) 40%, rgba(203, 213, 225, 0.3) 70%, transparent 100%),
            radial-gradient(circle at 65% 40%, rgba(148, 163, 184, 0.2) 0%, transparent 30%)
          `,
          borderRadius: '50%',
          animation: 'moon-phase 6s ease-in-out infinite',
        },

        '&::after': {
          content: '""',
          position: 'absolute',
          top: '20px',
          left: '25px',
          width: '2px',
          height: '2px',
          background: '#64748b',
          borderRadius: '50%',
          boxShadow: `
            15px 25px 0 0 rgba(100, 116, 139, 0.6),
            35px 15px 0 0 rgba(100, 116, 139, 0.4),
            50px 35px 0 0 rgba(100, 116, 139, 0.7),
            70px 20px 0 0 rgba(100, 116, 139, 0.5),
            25px 50px 0 0 rgba(100, 116, 139, 0.3),
            60px 55px 0 0 rgba(100, 116, 139, 0.6)
          `,
          animation: 'stars-shimmer 4s ease-in-out infinite',
        },

        '@keyframes moon-phase': {
          '0%, 100%': { 
            opacity: 0.8,
            transform: 'scale(1)',
          },
          '50%': { 
            opacity: 1,
            transform: 'scale(1.1)',
          },
        },

        '@keyframes stars-shimmer': {
          '0%, 100%': { opacity: 0.5 },
          '25%': { opacity: 0.8 },
          '50%': { opacity: 0.3 },
          '75%': { opacity: 0.9 },
        },

        '@keyframes lunar-glow': {
          '0%, 100%': { 
            boxShadow: `
              0 8px 25px rgba(148, 163, 184, 0.5),
              inset 0 3px 8px rgba(255, 255, 255, 0.9),
              inset 0 -3px 8px rgba(148, 163, 184, 0.4),
              0 0 40px rgba(255, 255, 255, 0.3)
            ` 
          },
          '50%': { 
            boxShadow: `
              0 12px 35px rgba(148, 163, 184, 0.6),
              inset 0 4px 10px rgba(255, 255, 255, 1),
              inset 0 -4px 10px rgba(148, 163, 184, 0.5),
              0 0 50px rgba(255, 255, 255, 0.5)
            ` 
          },
        },

        '&:hover': {
          transform: 'translateY(-8px) scale(1.06)',
          background: `
            radial-gradient(circle at 45% 35%, #ffffff 0%, #f1f5f9 50%, #e2e8f0 100%),
            radial-gradient(circle at 65% 65%, rgba(156, 163, 175, 0.4) 0%, transparent 45%)
          `,
          color: '#334155',
          borderColor: '#94a3b8',
          animation: 'lunar-glow 3s ease-in-out infinite',
          textShadow: '0 2px 5px rgba(255, 255, 255, 1)',

          '&::before': {
            animation: 'moon-phase 3s ease-in-out infinite',
            background: `
              radial-gradient(circle at 35% 35%, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0.8) 40%, rgba(226, 232, 240, 0.4) 70%, transparent 100%),
              radial-gradient(circle at 60% 35%, rgba(156, 163, 175, 0.3) 0%, transparent 35%)
            `,
          },

          '&::after': {
            animation: 'stars-shimmer 2s ease-in-out infinite',
            boxShadow: `
              15px 25px 0 0 rgba(100, 116, 139, 0.8),
              35px 15px 0 0 rgba(100, 116, 139, 0.6),
              50px 35px 0 0 rgba(100, 116, 139, 0.9),
              70px 20px 0 0 rgba(100, 116, 139, 0.7),
              25px 50px 0 0 rgba(100, 116, 139, 0.5),
              60px 55px 0 0 rgba(100, 116, 139, 0.8)
            `,
          },
        },

        '&:active': {
          transform: 'translateY(-4px) scale(1.03)',
          transition: 'all 0.1s ease',
        },

        '&:focus': {
          outline: 'none',
        },
      }}
    >
      Pattern 22
    </Button>
  );
};

export default ButtonPatternTwentyTwo;