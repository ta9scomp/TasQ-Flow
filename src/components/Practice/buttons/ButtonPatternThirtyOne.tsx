import React from 'react';
import { Button } from '@mui/material';

interface ButtonPatternThirtyOneProps {
  onClick?: () => void;
}

const ButtonPatternThirtyOne: React.FC<ButtonPatternThirtyOneProps> = ({ onClick }) => {
  const handleClick = () => {
    console.log('Pattern 31 ボタンがクリックされました！');
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
        
        // オパール・クリスタル
        background: `
          linear-gradient(160deg, 
            rgba(255, 255, 255, 0.96) 0%, 
            rgba(255, 247, 237, 0.9) 20%, 
            rgba(254, 235, 200, 0.85) 40%, 
            rgba(253, 224, 71, 0.3) 60%, 
            rgba(255, 247, 237, 0.9) 80%, 
            rgba(255, 255, 255, 0.96) 100%
          )
        `,
        color: '#d97706',
        border: '1px solid rgba(251, 191, 36, 0.2)',
        fontWeight: 500,
        letterSpacing: '0.3px',
        borderRadius: '24px',
        width: '150px',
        height: '150px',
        minWidth: '150px',
        textTransform: 'none',
        fontSize: '13px',
        transition: 'all 0.4s ease',
        backdropFilter: 'blur(20px)',
        boxShadow: `
          0 8px 30px rgba(245, 158, 11, 0.08),
          inset 0 2px 4px rgba(255, 255, 255, 0.9),
          inset 0 -1px 2px rgba(251, 191, 36, 0.1)
        `,

        '&::before': {
          content: '""',
          position: 'absolute',
          top: '30%',
          left: '20%',
          width: '60%',
          height: '40%',
          background: `
            radial-gradient(ellipse at 30% 40%, 
              rgba(255, 255, 255, 0.6) 0%, 
              rgba(254, 240, 138, 0.4) 40%, 
              rgba(245, 158, 11, 0.2) 80%, 
              transparent 100%
            )
          `,
          borderRadius: '50%',
          animation: 'opal-shimmer 6s ease-in-out infinite',
        },

        '&::after': {
          content: '""',
          position: 'absolute',
          top: '20%',
          right: '30%',
          width: '20%',
          height: '20%',
          background: `
            radial-gradient(circle, 
              rgba(255, 255, 255, 0.9) 0%, 
              rgba(255, 255, 255, 0.4) 50%, 
              transparent 100%
            )
          `,
          borderRadius: '50%',
          animation: 'golden-twinkle 4s ease-in-out infinite 1s',
        },

        '@keyframes opal-shimmer': {
          '0%, 100%': { 
            opacity: 0.5,
            transform: 'scale(1) rotate(0deg)',
          },
          '33%': { 
            opacity: 0.8,
            transform: 'scale(1.1) rotate(120deg)',
          },
          '66%': { 
            opacity: 0.6,
            transform: 'scale(1.05) rotate(240deg)',
          },
        },

        '@keyframes golden-twinkle': {
          '0%, 100%': { 
            opacity: 0.3,
            transform: 'scale(0.9)',
          },
          '50%': { 
            opacity: 1,
            transform: 'scale(1.4)',
          },
        },

        '@keyframes warm-glow': {
          '0%, 100%': { 
            background: `
              linear-gradient(160deg, 
                rgba(255, 255, 255, 0.98) 0%, 
                rgba(255, 247, 237, 0.93) 20%, 
                rgba(254, 235, 200, 0.9) 40%, 
                rgba(253, 224, 71, 0.4) 60%, 
                rgba(255, 247, 237, 0.93) 80%, 
                rgba(255, 255, 255, 0.98) 100%
              )
            ` 
          },
          '50%': { 
            background: `
              linear-gradient(160deg, 
                rgba(255, 255, 255, 0.9) 0%, 
                rgba(254, 240, 138, 0.8) 20%, 
                rgba(245, 158, 11, 0.6) 40%, 
                rgba(217, 119, 6, 0.5) 60%, 
                rgba(254, 240, 138, 0.8) 80%, 
                rgba(255, 255, 255, 0.9) 100%
              )
            ` 
          },
        },

        '&:hover': {
          transform: 'translateY(-3px) scale(1.02)',
          animation: 'warm-glow 3s ease-in-out infinite',
          color: '#b45309',
          borderColor: 'rgba(245, 158, 11, 0.3)',
          boxShadow: `
            0 12px 40px rgba(245, 158, 11, 0.12),
            inset 0 3px 6px rgba(255, 255, 255, 0.95),
            inset 0 -2px 4px rgba(251, 191, 36, 0.15)
          `,

          '&::before': {
            animation: 'opal-shimmer 3s ease-in-out infinite',
          },

          '&::after': {
            animation: 'golden-twinkle 2s ease-in-out infinite 0.5s',
          },
        },

        '&:active': {
          transform: 'translateY(-1px) scale(1.01)',
          transition: 'all 0.1s ease',
        },

        '&:focus': {
          outline: 'none',
        },
      }}
    >
      Pattern 31
    </Button>
  );
};

export default ButtonPatternThirtyOne;