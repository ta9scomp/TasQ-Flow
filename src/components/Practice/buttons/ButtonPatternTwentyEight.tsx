import React from 'react';
import { Button } from '@mui/material';

interface ButtonPatternTwentyEightProps {
  onClick?: () => void;
}

const ButtonPatternTwentyEight: React.FC<ButtonPatternTwentyEightProps> = ({ onClick }) => {
  const handleClick = () => {
    console.log('Pattern 28 ボタンがクリックされました！');
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
        
        // ヴィクトリアン・スチール
        background: `
          linear-gradient(135deg, 
            #1f2937 0%, 
            #374151 25%, 
            #4b5563 50%, 
            #374151 75%, 
            #1f2937 100%
          ),
          radial-gradient(circle at 30% 30%, rgba(156, 163, 175, 0.2) 0%, transparent 50%)
        `,
        color: '#d1d5db',
        border: '2px solid #6b7280',
        fontWeight: 600,
        letterSpacing: '1.5px',
        borderRadius: '4px',
        width: '150px',
        height: '150px',
        minWidth: '150px',
        textTransform: 'none',
        fontSize: '12px',
        transition: 'all 0.4s ease',
        boxShadow: `
          0 6px 20px rgba(0, 0, 0, 0.4),
          inset 0 2px 4px rgba(156, 163, 175, 0.2),
          inset 0 -2px 4px rgba(31, 41, 55, 0.5)
        `,
        textShadow: '0 2px 4px rgba(0, 0, 0, 0.7)',
        fontFamily: 'serif',

        '&::before': {
          content: '""',
          position: 'absolute',
          top: '15px',
          left: '15px',
          right: '15px',
          height: '1px',
          background: 'linear-gradient(90deg, transparent 0%, rgba(156, 163, 175, 0.6) 50%, transparent 100%)',
          pointerEvents: 'none',
        },

        '&::after': {
          content: '"✱"',
          position: 'absolute',
          bottom: '15px',
          right: '15px',
          fontSize: '12px',
          color: 'rgba(156, 163, 175, 0.7)',
          pointerEvents: 'none',
        },


        '&:hover': {
          transform: 'translateY(-3px) scale(1.02)',
          background: `
            linear-gradient(135deg, 
              #374151 0%, 
              #4b5563 25%, 
              #6b7280 50%, 
              #4b5563 75%, 
              #374151 100%
            ),
            radial-gradient(circle at 35% 35%, rgba(209, 213, 219, 0.3) 0%, transparent 55%)
          `,
          color: '#f3f4f6',
          borderColor: '#9ca3af',
          boxShadow: `
            0 10px 30px rgba(0, 0, 0, 0.5),
            inset 0 3px 6px rgba(156, 163, 175, 0.3),
            inset 0 -3px 6px rgba(31, 41, 55, 0.6)
          `,
          textShadow: '0 3px 6px rgba(0, 0, 0, 0.8)',

          '&::before': {
            background: 'linear-gradient(90deg, transparent 0%, rgba(209, 213, 219, 0.8) 50%, transparent 100%)',
          },

          '&::after': {
            color: 'rgba(209, 213, 219, 0.9)',
          },
        },

        '&:active': {
          transform: 'translateY(0) scale(1.01)',
          transition: 'all 0.1s ease',
        },

        '&:focus': {
          outline: 'none',
        },
      }}
    >
      Pattern 28
    </Button>
  );
};

export default ButtonPatternTwentyEight;