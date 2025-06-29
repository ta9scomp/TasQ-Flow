import React from 'react';
import { Button } from '@mui/material';

interface ButtonPatternThirtyFourProps {
  onClick?: () => void;
}

const ButtonPatternThirtyFour: React.FC<ButtonPatternThirtyFourProps> = ({ onClick }) => {
  const handleClick = () => {
    console.log('Pattern 12 ボタンがクリックされました！');
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
        
        // オーロラウェーブ
        background: 'linear-gradient(45deg, #0f3460 0%, #16537e 25%, #1e6091 50%, #266da3 75%, #0f3460 100%)',
        color: '#e0f7ff',
        border: '2px solid transparent',
        backgroundImage: 'linear-gradient(45deg, #0f3460, #266da3), linear-gradient(45deg, #00ffff, #7fffd4, #40e0d0, #00bfff)',
        backgroundOrigin: 'border-box',
        backgroundClip: 'padding-box, border-box',
        fontWeight: 500,
        letterSpacing: '1px',
        borderRadius: '30px',
        width: '150px',
        height: '150px',
        minWidth: '150px',
        textTransform: 'none',
        fontSize: '13px',
        transition: 'all 0.6s ease',
        boxShadow: `
          0 8px 30px rgba(15, 52, 96, 0.4),
          inset 0 2px 10px rgba(0, 255, 255, 0.1)
        `,
        textShadow: '0 2px 8px rgba(0, 191, 255, 0.5)',

        '&::before': {
          content: '""',
          position: 'absolute',
          top: '-50%',
          left: '-50%',
          width: '200%',
          height: '200%',
          background: 'conic-gradient(from 0deg, transparent, rgba(0, 255, 255, 0.1), transparent, rgba(127, 255, 212, 0.1), transparent)',
          animation: 'aurora-rotate 4s linear infinite',
          borderRadius: '50%',
        },

        '&::after': {
          content: '""',
          position: 'absolute',
          top: '10px',
          left: '10px',
          right: '10px',
          bottom: '10px',
          background: 'linear-gradient(135deg, rgba(0, 255, 255, 0.1) 0%, transparent 50%, rgba(64, 224, 208, 0.1) 100%)',
          borderRadius: '20px',
          pointerEvents: 'none',
        },

        '@keyframes aurora-rotate': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },

        '&:hover': {
          transform: 'translateY(-6px) scale(1.05)',
          background: 'linear-gradient(45deg, #1a4975 0%, #2b6899 25%, #3c75a6 50%, #4d82b8 75%, #1a4975 100%)',
          color: '#ffffff',
          boxShadow: `
            0 15px 45px rgba(15, 52, 96, 0.6),
            inset 0 3px 15px rgba(0, 255, 255, 0.2),
            0 0 40px rgba(0, 191, 255, 0.3)
          `,
          textShadow: '0 3px 12px rgba(0, 191, 255, 0.8)',

          '&::before': {
            animation: 'aurora-rotate 2s linear infinite',
          },
        },

        '&:active': {
          transform: 'translateY(-3px) scale(1.03)',
          transition: 'all 0.1s ease',
        },

        '&:focus': {
          outline: 'none',
          boxShadow: `
            0 8px 30px rgba(15, 52, 96, 0.4),
            inset 0 2px 10px rgba(0, 255, 255, 0.1),
            0 0 0 3px rgba(0, 191, 255, 0.4)
          `,
        },
      }}
    >
      Pattern 12
    </Button>
  );
};

export default ButtonPatternThirtyFour;