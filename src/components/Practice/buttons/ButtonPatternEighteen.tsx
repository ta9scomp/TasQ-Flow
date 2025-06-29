import React from 'react';
import { Button } from '@mui/material';

interface ButtonPatternEighteenProps {
  onClick?: () => void;
}

const ButtonPatternEighteen: React.FC<ButtonPatternEighteenProps> = ({ onClick }) => {
  const handleClick = () => {
    console.log('Pattern 18 ボタンがクリックされました！');
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
        
        // モダン・アーキテクチャー
        background: `
          linear-gradient(90deg, #f8fafc 0%, #e2e8f0 50%, #f8fafc 100%),
          linear-gradient(0deg, transparent 48%, rgba(148, 163, 184, 0.1) 50%, transparent 52%)
        `,
        color: '#1e293b',
        border: '3px solid #94a3b8',
        fontWeight: 700,
        letterSpacing: '1px',
        borderRadius: '4px',
        width: '150px',
        height: '150px',
        minWidth: '150px',
        textTransform: 'none',
        fontSize: '13px',
        transition: 'all 0.3s ease',
        boxShadow: `
          0 4px 12px rgba(148, 163, 184, 0.3),
          inset 0 2px 4px rgba(255, 255, 255, 0.8),
          inset 0 -2px 4px rgba(148, 163, 184, 0.2)
        `,
        textShadow: '0 1px 2px rgba(255, 255, 255, 0.8)',

        '&::before': {
          content: '""',
          position: 'absolute',
          top: '10px',
          left: '10px',
          right: '10px',
          height: '3px',
          background: 'linear-gradient(90deg, #0ea5e9 0%, #06b6d4 50%, #0ea5e9 100%)',
          borderRadius: '2px',
        },

        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: '10px',
          left: '50%',
          width: '60px',
          height: '3px',
          background: 'linear-gradient(90deg, transparent 0%, #94a3b8 50%, transparent 100%)',
          transform: 'translateX(-50%)',
          borderRadius: '2px',
        },

        '&:hover': {
          transform: 'translateY(-3px)',
          background: `
            linear-gradient(90deg, #ffffff 0%, #f1f5f9 50%, #ffffff 100%),
            linear-gradient(0deg, transparent 48%, rgba(14, 165, 233, 0.1) 50%, transparent 52%)
          `,
          color: '#0f172a',
          borderColor: '#0ea5e9',
          boxShadow: `
            0 8px 25px rgba(14, 165, 233, 0.2),
            inset 0 3px 6px rgba(255, 255, 255, 0.9),
            inset 0 -3px 6px rgba(14, 165, 233, 0.1),
            0 0 20px rgba(6, 182, 212, 0.1)
          `,

          '&::before': {
            background: 'linear-gradient(90deg, #0284c7 0%, #0891b2 50%, #0284c7 100%)',
            boxShadow: '0 0 8px rgba(14, 165, 233, 0.4)',
          },
        },

        '&:active': {
          transform: 'translateY(-1px)',
          transition: 'all 0.1s ease',
        },

        '&:focus': {
          outline: 'none',
        },
      }}
    >
      Pattern 18
    </Button>
  );
};

export default ButtonPatternEighteen;