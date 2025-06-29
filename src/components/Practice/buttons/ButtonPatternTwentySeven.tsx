import React from 'react';
import { Button } from '@mui/material';

interface ButtonPatternTwentySevenProps {
  onClick?: () => void;
}

const ButtonPatternTwentySeven: React.FC<ButtonPatternTwentySevenProps> = ({ onClick }) => {
  const handleClick = () => {
    console.log('Pattern 27 ボタンがクリックされました！');
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
        
        // アール・デコ
        background: `
          linear-gradient(135deg, 
            #262626 0%, 
            #404040 25%, 
            #525252 50%, 
            #404040 75%, 
            #262626 100%
          ),
          radial-gradient(circle at 50% 0%, rgba(255, 215, 0, 0.2) 0%, transparent 50%)
        `,
        color: '#ffd700',
        border: '2px solid #ffd700',
        fontWeight: 700,
        letterSpacing: '2px',
        borderRadius: '0',
        width: '150px',
        height: '150px',
        minWidth: '150px',
        textTransform: 'uppercase',
        fontSize: '12px',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: `
          0 4px 15px rgba(0, 0, 0, 0.5),
          inset 0 1px 2px rgba(255, 215, 0, 0.3),
          inset 0 -1px 2px rgba(0, 0, 0, 0.5)
        `,
        textShadow: '0 2px 4px rgba(0, 0, 0, 0.8)',
        fontFamily: 'serif',

        '&::before': {
          content: '""',
          position: 'absolute',
          top: '10px',
          left: '10px',
          right: '10px',
          bottom: '10px',
          border: '1px solid rgba(255, 215, 0, 0.5)',
          pointerEvents: 'none',
        },

        '&::after': {
          content: '"◈"',
          position: 'absolute',
          top: '50%',
          left: '15px',
          transform: 'translateY(-50%)',
          fontSize: '16px',
          color: 'rgba(255, 215, 0, 0.6)',
          pointerEvents: 'none',
        },


        '&:hover': {
          transform: 'translateY(-4px) scale(1.02)',
          background: `
            linear-gradient(135deg, 
              #404040 0%, 
              #525252 25%, 
              #737373 50%, 
              #525252 75%, 
              #404040 100%
            ),
            radial-gradient(circle at 50% 0%, rgba(255, 215, 0, 0.3) 0%, transparent 60%)
          `,
          color: '#ffed4e',
          borderColor: '#ffed4e',
          boxShadow: `
            0 8px 25px rgba(0, 0, 0, 0.6),
            inset 0 2px 4px rgba(255, 215, 0, 0.4),
            inset 0 -2px 4px rgba(0, 0, 0, 0.6),
            0 0 20px rgba(255, 215, 0, 0.2)
          `,
          textShadow: '0 3px 6px rgba(0, 0, 0, 0.9)',

          '&::before': {
            borderColor: 'rgba(255, 237, 78, 0.7)',
          },

          '&::after': {
            color: 'rgba(255, 237, 78, 0.8)',
          },
        },

        '&:active': {
          transform: 'translateY(-1px) scale(1.01)',
          transition: 'all 0.1s ease',
        },

        '&:focus': {
          outline: 'none',
        },
      }}
    >
      Pattern 27
    </Button>
  );
};

export default ButtonPatternTwentySeven;