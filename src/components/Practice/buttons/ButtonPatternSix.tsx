import React from 'react';
import { Button } from '@mui/material';


interface ButtonPatternSixProps {
  onClick?: () => void;
}

const ButtonPatternSix: React.FC<ButtonPatternSixProps> = ({ onClick }) => {
  const handleClick = () => {
    console.log('Pattern 6ボタンがクリックされました！');
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
        
        
        
        // ラグジュアリー・ゴールド
        color: '#d4af37',
        borderColor: '#d4af37',
        backgroundColor: 'rgba(212, 175, 55, 0.05)',
        fontWeight: 600,
        borderRadius: '12px',
        border: '2px solid #d4af37',
        boxShadow: '0 4px 20px rgba(212, 175, 55, 0.2)',
        width: '150px',
        height: '150px',
        minWidth: '150px',
        textTransform: 'none',
        letterSpacing: '1px',
        '&:hover': {
          backgroundColor: '#d4af37',
          color: '#ffffff',
          borderColor: '#d4af37',
          boxShadow: '0 8px 32px rgba(212, 175, 55, 0.4)',
          transform: 'translateY(-3px) scale(1.02)',
        },
        '&:active': {
          transform: 'translateY(-1px) scale(1.0)',
        },
        '&:focus': {
          outline: 'none',
        },
      }}
    >
      Pattern 6
    </Button>
  );
};

export default ButtonPatternSix;