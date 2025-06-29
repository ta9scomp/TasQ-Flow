import React from 'react';
import { Button } from '@mui/material';

interface ButtonPatternThirtyOneProps {
  onClick?: () => void;
}

const ButtonPatternThirtyOne: React.FC<ButtonPatternThirtyOneProps> = ({ onClick }) => {
  const handleClick = () => {
    console.log('Pattern 11 ボタンがクリックされました！');
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
        
        // クリスタルガラス風デザイン
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.1) 50%, rgba(255, 255, 255, 0.2) 100%)',
        backdropFilter: 'blur(15px) saturate(180%)',
        border: '2px solid transparent',
        backgroundImage: 'linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.05)), linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
        backgroundOrigin: 'border-box',
        backgroundClip: 'padding-box, border-box',
        color: '#4a5568',
        fontWeight: 600,
        letterSpacing: '1px',
        borderRadius: '20px',
        width: '150px',
        height: '150px',
        minWidth: '150px',
        textTransform: 'none',
        fontSize: '14px',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: `
          0 8px 32px rgba(31, 38, 135, 0.37),
          inset 0 2px 4px rgba(255, 255, 255, 0.6),
          inset 0 -2px 4px rgba(255, 255, 255, 0.2)
        `,

        '&::before': {
          content: '""',
          position: 'absolute',
          top: '10px',
          left: '10px',
          right: '10px',
          height: '20px',
          background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.6), transparent)',
          borderRadius: '20px',
          opacity: 0.8,
          transform: 'translateX(-100%)',
          transition: 'transform 0.6s ease',
        },

        '&::after': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.1) 40%, transparent 70%)',
          borderRadius: '20px',
          pointerEvents: 'none',
        },

        '&:hover': {
          transform: 'translateY(-8px) scale(1.05)',
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.2) 50%, rgba(255, 255, 255, 0.3) 100%)',
          backdropFilter: 'blur(20px) saturate(200%)',
          color: '#2d3748',
          boxShadow: `
            0 20px 40px rgba(31, 38, 135, 0.5),
            inset 0 2px 6px rgba(255, 255, 255, 0.8),
            inset 0 -2px 6px rgba(255, 255, 255, 0.3),
            0 0 30px rgba(168, 237, 234, 0.3)
          `,

          '&::before': {
            transform: 'translateX(100%)',
          },
        },

        '&:active': {
          transform: 'translateY(-4px) scale(1.02)',
          transition: 'all 0.1s ease',
          boxShadow: `
            0 10px 20px rgba(31, 38, 135, 0.4),
            inset 0 2px 4px rgba(255, 255, 255, 0.7),
            inset 0 -2px 4px rgba(255, 255, 255, 0.2)
          `,
        },

        '&:focus': {
          outline: 'none',
          boxShadow: `
            0 8px 32px rgba(31, 38, 135, 0.37),
            inset 0 2px 4px rgba(255, 255, 255, 0.6),
            inset 0 -2px 4px rgba(255, 255, 255, 0.2),
            0 0 0 3px rgba(168, 237, 234, 0.4)
          `,
        },
      }}
    >
      Pattern 11
    </Button>
  );
};

export default ButtonPatternThirtyOne;