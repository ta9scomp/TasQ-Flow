import React from 'react';
import { Button } from '@mui/material';

interface ButtonPatternThirtyProps {
  onClick?: () => void;
}

const ButtonPatternThirty: React.FC<ButtonPatternThirtyProps> = ({ onClick }) => {
  const handleClick = () => {
    console.log('Pattern 30 ボタンがクリックされました！');
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
        
        // ベルエポック・エレガンス
        background: `
          linear-gradient(135deg, 
            #7c2d12 0%, 
            #a3341a 25%, 
            #c2410c 50%, 
            #a3341a 75%, 
            #7c2d12 100%
          ),
          radial-gradient(circle at 60% 30%, rgba(251, 146, 60, 0.2) 0%, transparent 50%)
        `,
        color: '#fbbf24',
        border: '3px solid #a3341a',
        fontWeight: 700,
        letterSpacing: '1.8px',
        borderRadius: '50%',
        width: '150px',
        height: '150px',
        minWidth: '150px',
        textTransform: 'uppercase',
        fontSize: '11px',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: `
          0 8px 25px rgba(124, 45, 18, 0.5),
          inset 0 2px 4px rgba(251, 146, 60, 0.3),
          inset 0 -2px 4px rgba(124, 45, 18, 0.5)
        `,
        textShadow: '0 2px 4px rgba(124, 45, 18, 0.8)',
        fontFamily: 'serif',

        '&::before': {
          content: '""',
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '70%',
          height: '70%',
          border: '2px solid rgba(251, 146, 60, 0.4)',
          borderRadius: '50%',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
        },

        '&::after': {
          content: '"✦"',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: '20px',
          color: 'rgba(251, 146, 60, 0.7)',
          pointerEvents: 'none',
        },


        '&:hover': {
          transform: 'translateY(-5px) scale(1.05)',
          background: `
            linear-gradient(135deg, 
              #a3341a 0%, 
              #c2410c 25%, 
              #ea580c 50%, 
              #c2410c 75%, 
              #a3341a 100%
            ),
            radial-gradient(circle at 65% 35%, rgba(251, 191, 36, 0.3) 0%, transparent 55%)
          `,
          color: '#fef3c7',
          borderColor: '#ea580c',
          boxShadow: `
            0 12px 35px rgba(124, 45, 18, 0.6),
            inset 0 3px 6px rgba(251, 146, 60, 0.4),
            inset 0 -3px 6px rgba(124, 45, 18, 0.6),
            0 0 30px rgba(251, 146, 60, 0.3)
          `,
          textShadow: '0 3px 6px rgba(124, 45, 18, 0.9)',

          '&::before': {
            borderColor: 'rgba(251, 191, 36, 0.6)',
          },

          '&::after': {
            color: 'rgba(251, 191, 36, 0.9)',
          },
        },

        '&:active': {
          transform: 'translateY(-2px) scale(1.01)',
          transition: 'all 0.1s ease',
        },

        '&:focus': {
          outline: 'none',
        },
      }}
    >
      Pattern 30
    </Button>
  );
};

export default ButtonPatternThirty;