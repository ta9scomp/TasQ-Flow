import React from 'react';
import { Button } from '@mui/material';

interface ButtonPatternTwentyNineProps {
  onClick?: () => void;
}

const ButtonPatternTwentyNine: React.FC<ButtonPatternTwentyNineProps> = ({ onClick }) => {
  const handleClick = () => {
    console.log('Pattern 29 ボタンがクリックされました！');
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
        
        // エドワーディアン・チーク
        background: `
          linear-gradient(135deg, 
            #92400e 0%, 
            #b45309 25%, 
            #d97706 50%, 
            #b45309 75%, 
            #92400e 100%
          ),
          radial-gradient(circle at 40% 40%, rgba(251, 146, 60, 0.3) 0%, transparent 50%)
        `,
        color: '#fed7aa',
        border: '2px solid #d97706',
        fontWeight: 600,
        letterSpacing: '1.2px',
        borderRadius: '8px',
        width: '150px',
        height: '150px',
        minWidth: '150px',
        textTransform: 'none',
        fontSize: '12px',
        transition: 'all 0.4s ease',
        boxShadow: `
          0 6px 20px rgba(146, 64, 14, 0.4),
          inset 0 2px 4px rgba(251, 146, 60, 0.3),
          inset 0 -2px 4px rgba(146, 64, 14, 0.4)
        `,
        textShadow: '0 2px 4px rgba(146, 64, 14, 0.7)',
        fontFamily: 'serif',

        '&::before': {
          content: '""',
          position: 'absolute',
          top: '50%',
          left: '20px',
          right: '20px',
          height: '1px',
          background: 'linear-gradient(90deg, transparent 0%, rgba(251, 146, 60, 0.6) 50%, transparent 100%)',
          transform: 'translateY(-50%)',
          pointerEvents: 'none',
        },

        '&::after': {
          content: '"⚙"',
          position: 'absolute',
          top: '15px',
          left: '15px',
          fontSize: '14px',
          color: 'rgba(251, 146, 60, 0.6)',
          pointerEvents: 'none',
        },


        '&:hover': {
          transform: 'translateY(-3px) scale(1.02)',
          background: `
            linear-gradient(135deg, 
              #b45309 0%, 
              #d97706 25%, 
              #f59e0b 50%, 
              #d97706 75%, 
              #b45309 100%
            ),
            radial-gradient(circle at 45% 45%, rgba(251, 191, 36, 0.4) 0%, transparent 55%)
          `,
          color: '#fef3c7',
          borderColor: '#f59e0b',
          boxShadow: `
            0 10px 30px rgba(146, 64, 14, 0.5),
            inset 0 3px 6px rgba(251, 146, 60, 0.4),
            inset 0 -3px 6px rgba(146, 64, 14, 0.5)
          `,
          textShadow: '0 3px 6px rgba(146, 64, 14, 0.8)',

          '&::before': {
            background: 'linear-gradient(90deg, transparent 0%, rgba(251, 191, 36, 0.8) 50%, transparent 100%)',
          },

          '&::after': {
            color: 'rgba(251, 191, 36, 0.8)',
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
      Pattern 29
    </Button>
  );
};

export default ButtonPatternTwentyNine;