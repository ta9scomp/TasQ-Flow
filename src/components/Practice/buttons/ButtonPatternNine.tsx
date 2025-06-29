import React from 'react';
import { Button } from '@mui/material';
import './ButtonPatternNine.css';

interface ButtonPatternNineProps {
  onClick?: () => void;
}

const ButtonPatternNine: React.FC<ButtonPatternNineProps> = ({ onClick }) => {
  const handleClick = () => {
    console.log('Pattern 9 ボタンがクリックされました！');
    if (onClick) {
      onClick();
    }
  };

  return (
    <Button
      variant="outlined"
      onClick={handleClick}
      className="pattern-nine-button"
    >
      <span style={{ position: 'relative', zIndex: 30 }}>Pattern 9</span>
    </Button>
  );
};

export default ButtonPatternNine;