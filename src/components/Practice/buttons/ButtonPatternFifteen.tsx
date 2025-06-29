import React from 'react';
import { Button } from '@mui/material';

interface ButtonPatternFifteenProps {
  onClick?: () => void;
}

const ButtonPatternFifteen: React.FC<ButtonPatternFifteenProps> = ({ onClick }) => {
  const handleClick = () => {
    console.log('Pattern 15ボタンがクリックされました！');
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
        // サイバー・グリッド
        background: 'radial-gradient(circle, rgba(0, 0, 0, 0.8) 0%, rgba(20, 20, 20, 0.9) 100%)',
        color: '#ff6b00',
        fontWeight: 600,
        borderRadius: '10px',
        border: '2px solid #ff6b00',
        width: '150px',
        height: '150px',
        minWidth: '150px',
        textTransform: 'none',
        overflow: 'hidden',
        backgroundImage: `
          linear-gradient(rgba(255, 107, 0, 0.1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255, 107, 0, 0.1) 1px, transparent 1px)
        `,
        backgroundSize: '20px 20px',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            linear-gradient(rgba(255, 107, 0, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 107, 0, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px',
          animation: 'grid-move 3s linear infinite',
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '4px',
          height: '4px',
          transform: 'translate(-50%, -50%)',
          background: '#ff6b00',
          borderRadius: '50%',
          boxShadow: `
            0 0 10px #ff6b00,
            20px 0 4px #ff6b00,
            40px 0 4px #ff6b00,
            -20px 0 4px #ff6b00,
            -40px 0 4px #ff6b00,
            0 20px 4px #ff6b00,
            0 40px 4px #ff6b00,
            0 -20px 4px #ff6b00,
            0 -40px 4px #ff6b00
          `,
          animation: 'grid-pulse 2s ease-in-out infinite',
        },
        '@keyframes grid-move': {
          '0%': { transform: 'translate(0, 0)' },
          '100%': { transform: 'translate(20px, 20px)' },
        },
        '@keyframes grid-pulse': {
          '0%, 100%': { 
            opacity: 1,
            transform: 'translate(-50%, -50%) scale(1)',
          },
          '50%': { 
            opacity: 0.5,
            transform: 'translate(-50%, -50%) scale(1.2)',
          },
        },
        '&:hover': {
          borderColor: '#ffff00',
          color: '#ffff00',
          boxShadow: '0 0 30px rgba(255, 255, 0, 0.5)',
          backgroundImage: `
            linear-gradient(rgba(255, 255, 0, 0.2) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 0, 0.2) 1px, transparent 1px)
          `,
        },
        '&:active': {
          transform: 'scale(0.95)',
        },
        '&:focus': {
          outline: 'none',
        },
      }}
    >
      Pattern 15
    </Button>
  );
};

export default ButtonPatternFifteen;