import React from 'react';
import { Button } from '@mui/material';

interface ButtonPatternTwentyOneProps {
  onClick?: () => void;
}

const ButtonPatternTwentyOne: React.FC<ButtonPatternTwentyOneProps> = ({ onClick }) => {
  const handleClick = () => {
    console.log('Pattern 21 ボタンがクリックされました！');
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
        
        // スターライト・ギャラクシー
        background: `
          radial-gradient(circle at 20% 30%, #1e1b4b 0%, #0f0f23 40%, #000000 100%),
          radial-gradient(circle at 80% 70%, #312e81 0%, transparent 30%),
          radial-gradient(circle at 60% 20%, #581c87 0%, transparent 25%)
        `,
        color: '#e0e7ff',
        border: '2px solid #4f46e5',
        fontWeight: 600,
        letterSpacing: '1px',
        borderRadius: '50%',
        width: '150px',
        height: '150px',
        minWidth: '150px',
        textTransform: 'none',
        fontSize: '13px',
        transition: 'all 0.4s ease',
        boxShadow: `
          0 8px 25px rgba(79, 70, 229, 0.3),
          inset 0 2px 6px rgba(224, 231, 255, 0.1)
        `,
        textShadow: '0 2px 6px rgba(79, 70, 229, 0.8), 0 0 12px rgba(224, 231, 255, 0.5)',

        '&::before': {
          content: '""',
          position: 'absolute',
          top: '15px',
          left: '20px',
          width: '3px',
          height: '3px',
          background: '#ffffff',
          borderRadius: '50%',
          boxShadow: `
            10px 15px 0 0 rgba(255, 255, 255, 0.8),
            25px 5px 0 0 rgba(255, 255, 255, 0.6),
            35px 25px 0 0 rgba(255, 255, 255, 0.7),
            50px 10px 0 0 rgba(255, 255, 255, 0.5),
            60px 30px 0 0 rgba(255, 255, 255, 0.9),
            15px 40px 0 0 rgba(255, 255, 255, 0.4),
            45px 45px 0 0 rgba(255, 255, 255, 0.6),
            70px 20px 0 0 rgba(255, 255, 255, 0.3)
          `,
          animation: 'starlight-twinkle 3s ease-in-out infinite',
        },

        '&::after': {
          content: '""',
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '60px',
          height: '60px',
          background: 'conic-gradient(from 0deg, transparent, rgba(79, 70, 229, 0.3), transparent, rgba(139, 92, 246, 0.2), transparent)',
          borderRadius: '50%',
          transform: 'translate(-50%, -50%)',
          animation: 'galaxy-rotation 8s linear infinite',
          opacity: 0.6,
        },

        '@keyframes starlight-twinkle': {
          '0%, 100%': { opacity: 0.8 },
          '25%': { opacity: 0.4 },
          '50%': { opacity: 1 },
          '75%': { opacity: 0.6 },
        },

        '@keyframes galaxy-rotation': {
          '0%': { transform: 'translate(-50%, -50%) rotate(0deg)' },
          '100%': { transform: 'translate(-50%, -50%) rotate(360deg)' },
        },

        '@keyframes cosmic-glow': {
          '0%, 100%': { 
            boxShadow: `
              0 8px 25px rgba(79, 70, 229, 0.4),
              inset 0 2px 6px rgba(224, 231, 255, 0.2),
              0 0 30px rgba(79, 70, 229, 0.3)
            ` 
          },
          '50%': { 
            boxShadow: `
              0 12px 35px rgba(139, 92, 246, 0.5),
              inset 0 3px 8px rgba(224, 231, 255, 0.3),
              0 0 40px rgba(139, 92, 246, 0.4)
            ` 
          },
        },

        '&:hover': {
          transform: 'translateY(-6px) scale(1.05)',
          background: `
            radial-gradient(circle at 25% 35%, #312e81 0%, #1e1b4b 40%, #0c0a1a 100%),
            radial-gradient(circle at 75% 65%, #4338ca 0%, transparent 35%),
            radial-gradient(circle at 55% 25%, #7c3aed 0%, transparent 30%)
          `,
          color: '#f3f4f6',
          borderColor: '#6366f1',
          animation: 'cosmic-glow 2s ease-in-out infinite',
          textShadow: '0 3px 8px rgba(79, 70, 229, 1), 0 0 18px rgba(243, 244, 246, 0.7)',

          '&::before': {
            animation: 'starlight-twinkle 1.5s ease-in-out infinite',
            boxShadow: `
              10px 15px 0 0 rgba(255, 255, 255, 1),
              25px 5px 0 0 rgba(255, 255, 255, 0.8),
              35px 25px 0 0 rgba(255, 255, 255, 0.9),
              50px 10px 0 0 rgba(255, 255, 255, 0.7),
              60px 30px 0 0 rgba(255, 255, 255, 1),
              15px 40px 0 0 rgba(255, 255, 255, 0.6),
              45px 45px 0 0 rgba(255, 255, 255, 0.8),
              70px 20px 0 0 rgba(255, 255, 255, 0.5)
            `,
          },

          '&::after': {
            animation: 'galaxy-rotation 4s linear infinite',
            opacity: 0.8,
          },
        },

        '&:active': {
          transform: 'translateY(-3px) scale(1.02)',
          transition: 'all 0.1s ease',
        },

        '&:focus': {
          outline: 'none',
        },
      }}
    >
      Pattern 21
    </Button>
  );
};

export default ButtonPatternTwentyOne;