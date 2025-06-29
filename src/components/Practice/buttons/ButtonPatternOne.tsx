import React from 'react';
import { Button } from '@mui/material';

interface ButtonPatternOneProps {
  onClick?: () => void;
}

const ButtonPatternOne: React.FC<ButtonPatternOneProps> = ({ onClick }) => {
  const handleClick = () => {
    console.log('Pattern 1ボタンがクリックされました！');
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
        backgroundColor: 'rgba(237, 227, 255, 0.2)',
        backdropFilter: 'blur(10px)',
        border: '0.1px solid rgba(103, 58, 183, 0.3)',
        color: '#673ab7',
        fontWeight: 600,
        boxShadow: '0 4px 15px rgba(103, 58, 183, 0.2)',
        // 明示的なサイズ指定
        width: '150px',
        height: '150px',
        minWidth: '150px',
        '&:hover': {
          backgroundColor: 'rgba(103, 58, 183, 0.3)',
          transform: 'translateY(-2px)',
          boxShadow: '0 6px 20px rgba(103, 58, 183, 0.3)',
        },
        '&:active': {
          transform: 'translateY(0)',
        },
        '&:focus': {
          outline: 'none',
          boxShadow: '0 4px 15px rgba(103, 58, 183, 0.3)',
        },
      }}
    >
      Pattern 1
    </Button>
  );
};

export default ButtonPatternOne;