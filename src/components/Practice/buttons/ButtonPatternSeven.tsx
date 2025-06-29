import React from 'react';
import { Button } from '@mui/material';


interface ButtonPatternSevenProps {
  onClick?: () => void;
}

const ButtonPatternSeven: React.FC<ButtonPatternSevenProps> = ({ onClick }) => {
  const handleClick = () => {
    console.log('Pattern 7ボタンがクリックされました！');
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
        
        
        
        // モダン・ダーク
        background: 'linear-gradient(135deg, #232526 0%, #414345 100%)',
        color: '#ffffff',
        fontWeight: 500,
        borderRadius: '6px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        width: '150px',
        height: '150px',
        minWidth: '150px',
        textTransform: 'none',
        '&:hover': {
          background: 'linear-gradient(135deg, #414345 0%, #232526 100%)',
          borderColor: 'rgba(255, 255, 255, 0.2)',
          transform: 'translateY(-2px)',
          boxShadow: '0 12px 48px rgba(0, 0, 0, 0.4)',
        },
        '&:active': {
          transform: 'translateY(0)',
        },
        '&:focus': {
          outline: 'none',
        },
      }}
    >
      Pattern 7
    </Button>
  );
};

export default ButtonPatternSeven;