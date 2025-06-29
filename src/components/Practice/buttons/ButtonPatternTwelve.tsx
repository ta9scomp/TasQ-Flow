import React from 'react';
import { Button } from '@mui/material';

interface ButtonPatternTwelveProps {
  onClick?: () => void;
}

const ButtonPatternTwelve: React.FC<ButtonPatternTwelveProps> = ({ onClick }) => {
  const handleClick = () => {
    console.log('Pattern 12ボタンがクリックされました！');
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
        // ネオンパルス・リング
        background: 'radial-gradient(circle, rgba(255, 0, 150, 0.1) 0%, rgba(0, 255, 255, 0.1) 100%)',
        color: '#ffffff',
        fontWeight: 600,
        borderRadius: '50%',
        border: '3px solid transparent',
        width: '150px',
        height: '150px',
        minWidth: '150px',
        textTransform: 'none',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: '-3px',
          left: '-3px',
          right: '-3px',
          bottom: '-3px',
          borderRadius: '50%',
          background: 'conic-gradient(from 0deg, #ff0096, #00ffff, #ff0096)',
          zIndex: -1,
          animation: 'rotate-border 2s linear infinite',
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          top: '10px',
          left: '10px',
          right: '10px',
          bottom: '10px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(20, 20, 20, 0.9) 0%, rgba(40, 40, 40, 0.9) 100%)',
          zIndex: -1,
        },
        '@keyframes rotate-border': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        '@keyframes pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(255, 0, 150, 0.5)' },
          '50%': { boxShadow: '0 0 40px rgba(0, 255, 255, 0.8), 0 0 60px rgba(255, 0, 150, 0.3)' },
        },
        '&:hover': {
          animation: 'pulse-glow 1s ease-in-out infinite',
          transform: 'scale(1.05)',
        },
        '&:active': {
          transform: 'scale(0.95)',
        },
        '&:focus': {
          outline: 'none',
        },
      }}
    >
      Pattern 12
    </Button>
  );
};

export default ButtonPatternTwelve;