import React from 'react';
import { Button } from '@mui/material';

interface ButtonPatternThirteenProps {
  onClick?: () => void;
}

const ButtonPatternThirteen: React.FC<ButtonPatternThirteenProps> = ({ onClick }) => {
  const handleClick = () => {
    console.log('Pattern 13ボタンがクリックされました！');
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
        // ホログラフィック・クリスタル
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
        color: '#ffffff',
        fontWeight: 500,
        borderRadius: '20px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        backdropFilter: 'blur(20px)',
        width: '150px',
        height: '150px',
        minWidth: '150px',
        textTransform: 'none',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.1) 50%, transparent 70%)',
          transform: 'translateX(-100%)',
          animation: 'hologram-sweep 3s ease-in-out infinite',
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '80%',
          height: '80%',
          transform: 'translate(-50%, -50%)',
          background: 'conic-gradient(from 0deg, rgba(255, 0, 255, 0.3), rgba(0, 255, 255, 0.3), rgba(255, 255, 0, 0.3), rgba(255, 0, 255, 0.3))',
          borderRadius: '50%',
          filter: 'blur(20px)',
          animation: 'hologram-rotate 4s linear infinite',
          zIndex: -1,
        },
        '@keyframes hologram-sweep': {
          '0%': { transform: 'translateX(-100%)' },
          '50%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        '@keyframes hologram-rotate': {
          '0%': { transform: 'translate(-50%, -50%) rotate(0deg)' },
          '100%': { transform: 'translate(-50%, -50%) rotate(360deg)' },
        },
        '&:hover': {
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.1) 100%)',
          boxShadow: '0 8px 32px rgba(255, 255, 255, 0.2)',
          transform: 'translateY(-5px)',
        },
        '&:active': {
          transform: 'translateY(-2px) scale(0.98)',
        },
        '&:focus': {
          outline: 'none',
        },
      }}
    >
      Pattern 13
    </Button>
  );
};

export default ButtonPatternThirteen;