import React from 'react';
import { Button } from '@mui/material';

interface ButtonPatternTwentyFiveProps {
  onClick?: () => void;
}

const ButtonPatternTwentyFive: React.FC<ButtonPatternTwentyFiveProps> = ({ onClick }) => {
  const handleClick = () => {
    console.log('Pattern 25 ボタンがクリックされました！');
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
        overflow: 'hidden',
        
        // ヴィンテージ・ゴールド
        background: `
          linear-gradient(135deg, 
            #d4a574 0%, 
            #e7bc91 25%, 
            #f3d5ae 50%, 
            #e7bc91 75%, 
            #d4a574 100%
          ),
          radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.3) 0%, transparent 50%)
        `,
        color: '#7c2d12',
        border: '2px solid #92400e',
        fontWeight: 600,
        letterSpacing: '1px',
        borderRadius: '20px',
        width: '150px',
        height: '150px',
        minWidth: '150px',
        textTransform: 'none',
        fontSize: '13px',
        transition: 'all 0.4s ease',
        backgroundSize: '200% 100%',
        boxShadow: `
          0 6px 20px rgba(146, 64, 14, 0.3),
          inset 0 2px 4px rgba(255, 255, 255, 0.4),
          inset 0 -2px 4px rgba(124, 45, 18, 0.3)
        `,
        textShadow: '0 1px 2px rgba(124, 45, 18, 0.5)',

        '&::before': {
          content: '""',
          position: 'absolute',
          top: '50%',
          left: '10%',
          right: '10%',
          height: '1px',
          background: 'linear-gradient(90deg, transparent 0%, rgba(124, 45, 18, 0.4) 50%, transparent 100%)',
          transform: 'translateY(-50%)',
          pointerEvents: 'none',
        },

        '&::after': {
          content: '""',
          position: 'absolute',
          top: '15px',
          left: '20px',
          width: '20px',
          height: '20px',
          background: 'radial-gradient(circle, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0.2) 60%, transparent 100%)',
          borderRadius: '50%',
          pointerEvents: 'none',
        },

        '&:hover': {
          transform: 'translateY(-3px) scale(1.02)',
          background: `
            linear-gradient(135deg, 
              #e7bc91 0%, 
              #f3d5ae 25%, 
              #fef3c7 50%, 
              #f3d5ae 75%, 
              #e7bc91 100%
            ),
            radial-gradient(circle at 35% 35%, rgba(255, 255, 255, 0.4) 0%, transparent 55%)
          `,
          color: '#78350f',
          borderColor: '#78350f',
          boxShadow: `
            0 8px 25px rgba(146, 64, 14, 0.4),
            inset 0 3px 6px rgba(255, 255, 255, 0.5),
            inset 0 -3px 6px rgba(124, 45, 18, 0.4)
          `,
          textShadow: '0 2px 3px rgba(124, 45, 18, 0.6)',
        },

        '&:active': {
          transform: 'translateY(-2px) scale(1.02)',
          transition: 'all 0.1s ease',
        },

        '&:focus': {
          outline: 'none',
        },
      }}
    >
      Pattern 25
    </Button>
  );
};

export default ButtonPatternTwentyFive;