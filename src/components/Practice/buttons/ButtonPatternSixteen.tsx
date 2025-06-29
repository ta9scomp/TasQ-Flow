import React from 'react';
import { Button } from '@mui/material';

interface ButtonPatternSixteenProps {
  onClick?: () => void;
}

const ButtonPatternSixteen: React.FC<ButtonPatternSixteenProps> = ({ onClick }) => {
  const handleClick = () => {
    console.log('Pattern 16 ボタンがクリックされました！');
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
        // レトロ・ヴェイパーウェイブ
        background: 'linear-gradient(180deg, rgba(255, 20, 147, 0.2) 0%, rgba(138, 43, 226, 0.3) 25%, rgba(75, 0, 130, 0.4) 50%, rgba(25, 25, 112, 0.3) 75%, rgba(0, 0, 0, 0.8) 100%)',
        color: '#ff1493',
        fontWeight: 700,
        fontFamily: 'monospace',
        borderRadius: '0',
        border: '2px solid #ff1493',
        width: '150px',
        height: '150px',
        minWidth: '150px',
        textTransform: 'uppercase',
        letterSpacing: '2px',
        overflow: 'hidden',
        clipPath: 'polygon(0 0, 100% 0, 90% 100%, 10% 100%)',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            repeating-linear-gradient(
              90deg,
              transparent,
              transparent 2px,
              rgba(255, 20, 147, 0.1) 2px,
              rgba(255, 20, 147, 0.1) 4px
            ),
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 8px,
              rgba(138, 43, 226, 0.2) 8px,
              rgba(138, 43, 226, 0.2) 10px
            )
          `,
          animation: 'vaporwave-grid 4s linear infinite',
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: '20%',
          left: '50%',
          width: '80%',
          height: '30%',
          transform: 'translateX(-50%)',
          background: 'linear-gradient(0deg, rgba(255, 20, 147, 0.6), transparent)',
          clipPath: 'polygon(0 100%, 100% 100%, 90% 0%, 10% 0%)',
          animation: 'vaporwave-sun 3s ease-in-out infinite',
        },
        '@keyframes vaporwave-grid': {
          '0%': { 
            transform: 'translateY(0)',
            opacity: 0.7,
          },
          '100%': { 
            transform: 'translateY(-20px)',
            opacity: 0.3,
          },
        },
        '@keyframes vaporwave-sun': {
          '0%, 100%': { 
            opacity: 0.6,
            transform: 'translateX(-50%) scale(1)',
          },
          '50%': { 
            opacity: 1,
            transform: 'translateX(-50%) scale(1.1)',
          },
        },
        '@keyframes vaporwave-glow': {
          '0%, 100%': { 
            textShadow: '0 0 5px #ff1493, 0 0 10px #ff1493, 0 0 15px #ff1493',
            borderColor: '#ff1493',
          },
          '25%': { 
            textShadow: '0 0 5px #8a2be2, 0 0 10px #8a2be2, 0 0 15px #8a2be2',
            borderColor: '#8a2be2',
          },
          '50%': { 
            textShadow: '0 0 5px #4b0082, 0 0 10px #4b0082, 0 0 15px #4b0082',
            borderColor: '#4b0082',
          },
          '75%': { 
            textShadow: '0 0 5px #191970, 0 0 10px #191970, 0 0 15px #191970',
            borderColor: '#191970',
          },
        },
        '&:hover': {
          animation: 'vaporwave-glow 2s ease-in-out infinite',
          background: 'linear-gradient(180deg, rgba(255, 20, 147, 0.4) 0%, rgba(138, 43, 226, 0.5) 25%, rgba(75, 0, 130, 0.6) 50%, rgba(25, 25, 112, 0.5) 75%, rgba(0, 0, 0, 0.9) 100%)',
          transform: 'scale(1.05)',
        },
        '&:active': {
          transform: 'scale(1.0)',
          filter: 'brightness(1.3)',
        },
        '&:focus': {
          outline: 'none',
        },
      }}
    >
      Pattern 16
    </Button>
  );
};

export default ButtonPatternSixteen;