import React from 'react';
import { Button } from '@mui/material';
import './ButtonPatternThree.css';


interface ButtonPatternThreeProps {
  onClick?: () => void;
}

const ButtonPatternThree: React.FC<ButtonPatternThreeProps> = ({ onClick }) => {
  const handleClick = () => {
    console.log('Pattern 3ボタンがクリックされました！');
    if (onClick) {
      onClick();
    }
  };

  return (
    <div className="pattern-three-container">
      <Button
        variant="outlined"
        onClick={handleClick}
        className="pattern-three-button"
      >
        {/* 星たち */}
        <div className="star" style={{ top: '20px', left: '30px' }}></div>
        <div className="star" style={{ top: '40px', left: '80px' }}></div>
        <div className="star" style={{ top: '60px', left: '120px' }}></div>
        <div className="star" style={{ top: '80px', left: '40px' }}></div>
        <div className="star" style={{ top: '100px', left: '100px' }}></div>
        <div className="star" style={{ top: '30px', left: '110px' }}></div>
        <div className="star" style={{ top: '70px', left: '20px' }}></div>
        <div className="star" style={{ top: '90px', left: '70px' }}></div>
        
        {/* 流れ星 */}
        <div className="shooting-star shooting-star-1"></div>
        <div className="shooting-star shooting-star-2"></div>
        <div className="shooting-star shooting-star-3"></div>
        <div className="shooting-star shooting-star-4"></div>
        
        <span>Pattern 3</span>
      </Button>
    </div>
  );
};

export default ButtonPatternThree;