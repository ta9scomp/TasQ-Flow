import React from 'react';
import { Button } from '@mui/material';

interface ButtonPatternElevenProps {
  onClick?: () => void;
}

const ButtonPatternEleven: React.FC<ButtonPatternElevenProps> = ({ onClick }) => {
  const handleClick = () => {
    console.log('Pattern 11ボタンがクリックされました！');
    if (onClick) {
      onClick();
    }
  };

  return (
    <Button
      variant="contained"
      onClick={handleClick}
      sx={{
        position: 'relative',
        // グリッチ・ハッカー
        background: 'linear-gradient(45deg, #0f0f0f 0%, #1a1a1a 50%, #0f0f0f 100%)',
        color: '#00ff41',
        fontWeight: 700,
        fontFamily: 'monospace',
        borderRadius: '4px',
        border: '1px solid #00ff41',
        boxShadow: '0 0 20px rgba(0, 255, 65, 0.3), inset 0 0 20px rgba(0, 255, 65, 0.1)',
        width: '150px',
        height: '150px',
        minWidth: '150px',
        textTransform: 'uppercase',
        letterSpacing: '2px',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: '-100%',
          width: '100%',
          height: '100%',
          background: 'linear-gradient(90deg, transparent, rgba(0, 255, 65, 0.4), transparent)',
          animation: 'glitch-scan 3s infinite',
        },
        '@keyframes glitch-scan': {
          '0%': { left: '-100%' },
          '100%': { left: '100%' },
        },
        '@keyframes glitch-text': {
          '0%, 90%, 100%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(-2px, -2px)' },
          '60%': { transform: 'translate(2px, 2px)' },
          '80%': { transform: 'translate(2px, -2px)' },
        },
        '&:hover': {
          animation: 'glitch-text 0.3s ease-in-out',
          boxShadow: '0 0 30px rgba(0, 255, 65, 0.6), inset 0 0 30px rgba(0, 255, 65, 0.2)',
          textShadow: '2px 0 #ff0080, -2px 0 #00ffff',
        },
        '&:active': {
          transform: 'scale(0.95)',
        },
        '&:focus': {
          outline: 'none',
        },
      }}
    >
      Pattern 11
    </Button>
  );
};

export default ButtonPatternEleven;