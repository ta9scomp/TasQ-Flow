import React from 'react';
import { Button } from '@mui/material';


interface ButtonPatternTwoProps {
  onClick?: () => void;
}

const ButtonPatternTwo: React.FC<ButtonPatternTwoProps> = ({ onClick }) => {
  const handleClick = () => {
    console.log('Pattern 2ボタンがクリックされました！');
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
        
        
        
        // ミニマリスト・モノクローム
        color: '#2c2c2c',
        borderColor: '#2c2c2c',
        backgroundColor: 'transparent',
        fontWeight: 400,
        letterSpacing: '0.5px',
        borderRadius: '0px',
        borderWidth: '1px',
        width: '150px',
        height: '150px',
        minWidth: '150px',
        textTransform: 'none',
        transition: 'all 0.3s ease-in-out', // ここでアニメーション時間とイージングを指定
        '&:hover': {
          backgroundColor: '#2c2c2c',
          color: '#ffffff',
          borderColor: '#2c2c2c',
          transform: 'scale(1.2)',
        },
        '&:active': {
          transform: 'scale(1.0)',
        },
        '&:focus': {
          outline: 'none',
        },
      }}
    >
      Pattern 2
    </Button>
  );
};

export default ButtonPatternTwo;