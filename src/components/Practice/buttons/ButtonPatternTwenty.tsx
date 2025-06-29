import React from 'react';
import { Button } from '@mui/material';

interface ButtonPatternTwentyProps {
  onClick?: () => void;
}

const ButtonPatternTwenty: React.FC<ButtonPatternTwentyProps> = ({ onClick }) => {
  const handleClick = () => {
    console.log('Pattern 20 ボタンがクリックされました！');
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
        
        // ソフト・パステル・クリーム
        background: `
          linear-gradient(135deg, #fffef7 0%, #fef9c3 25%, #fff7ed 50%, #fef3c7 75%, #fffef7 100%),
          radial-gradient(circle at 70% 30%, rgba(251, 191, 36, 0.1) 0%, transparent 40%)
        `,
        color: '#92400e',
        border: '2px solid #f59e0b',
        fontWeight: 600,
        letterSpacing: '0.8px',
        borderRadius: '32px',
        width: '150px',
        height: '150px',
        minWidth: '150px',
        textTransform: 'none',
        fontSize: '14px',
        transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: `
          0 4px 15px rgba(251, 191, 36, 0.2),
          inset 0 2px 4px rgba(255, 255, 255, 0.8)
        `,
        textShadow: '0 1px 2px rgba(255, 255, 255, 0.8)',

        '&::before': {
          content: '""',
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '80px',
          height: '80px',
          background: 'conic-gradient(from 0deg, rgba(251, 191, 36, 0.1), rgba(245, 158, 11, 0.2), rgba(251, 191, 36, 0.1))',
          borderRadius: '50%',
          transform: 'translate(-50%, -50%)',
          animation: 'soft-rotate 8s linear infinite',
          opacity: 0.6,
        },

        '&::after': {
          content: '""',
          position: 'absolute',
          top: '25px',
          left: '50%',
          width: '20px',
          height: '20px',
          background: 'radial-gradient(circle, rgba(251, 191, 36, 0.6) 0%, rgba(251, 191, 36, 0.2) 70%, transparent 100%)',
          borderRadius: '50%',
          transform: 'translateX(-50%)',
          filter: 'blur(1px)',
        },

        '@keyframes soft-rotate': {
          '0%': { transform: 'translate(-50%, -50%) rotate(0deg)' },
          '100%': { transform: 'translate(-50%, -50%) rotate(360deg)' },
        },

        '@keyframes gentle-float': {
          '0%, 100%': { transform: 'translateY(0) scale(1)' },
          '50%': { transform: 'translateY(-2px) scale(1.05)' },
        },

        '&:hover': {
          transform: 'translateY(-6px) scale(1.04)',
          background: `
            linear-gradient(135deg, #ffffff 0%, #fef9c3 25%, #fffbeb 50%, #fef3c7 75%, #ffffff 100%),
            radial-gradient(circle at 65% 35%, rgba(251, 191, 36, 0.15) 0%, transparent 45%)
          `,
          color: '#78350f',
          borderColor: '#d97706',
          boxShadow: `
            0 8px 25px rgba(251, 191, 36, 0.3),
            inset 0 3px 6px rgba(255, 255, 255, 0.9),
            0 0 20px rgba(251, 191, 36, 0.2)
          `,
          textShadow: '0 2px 4px rgba(255, 255, 255, 0.9)',
          animation: 'gentle-float 2s ease-in-out infinite',

          '&::before': {
            animation: 'soft-rotate 4s linear infinite',
            opacity: 0.8,
          },

          '&::after': {
            background: 'radial-gradient(circle, rgba(251, 191, 36, 0.8) 0%, rgba(251, 191, 36, 0.3) 70%, transparent 100%)',
          },
        },

        '&:active': {
          transform: 'translateY(-3px) scale(1.02)',
          transition: 'all 0.1s ease',
          animation: 'none',
        },

        '&:focus': {
          outline: 'none',
        },
      }}
    >
      Pattern 20
    </Button>
  );
};

export default ButtonPatternTwenty;