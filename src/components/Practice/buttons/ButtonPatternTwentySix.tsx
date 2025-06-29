import React from 'react';
import { Button } from '@mui/material';

interface ButtonPatternTwentySixProps {
  onClick?: () => void;
}

const ButtonPatternTwentySix: React.FC<ButtonPatternTwentySixProps> = ({ onClick }) => {
  const handleClick = () => {
    console.log('Pattern 26 ボタンがクリックされました！');
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
        
        // ロイヤル・ネイビー
        background: `
          linear-gradient(135deg, 
            #1e3a8a 0%, 
            #1e40af 25%, 
            #2563eb 50%, 
            #1e40af 75%, 
            #1e3a8a 100%
          ),
          radial-gradient(ellipse at 40% 30%, rgba(59, 130, 246, 0.3) 0%, transparent 60%)
        `,
        color: '#dbeafe',
        border: '2px solid #1e3a8a',
        fontWeight: 600,
        letterSpacing: '0.8px',
        borderRadius: '12px',
        width: '150px',
        height: '150px',
        minWidth: '150px',
        textTransform: 'none',
        fontSize: '13px',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: `
          0 6px 20px rgba(30, 58, 138, 0.4),
          inset 0 2px 4px rgba(219, 234, 254, 0.2),
          inset 0 -2px 4px rgba(30, 58, 138, 0.3)
        `,
        textShadow: '0 1px 3px rgba(30, 58, 138, 0.8)',

        '&::before': {
          content: '""',
          position: 'absolute',
          top: '8px',
          left: '8px',
          right: '8px',
          bottom: '8px',
          border: '1px solid rgba(219, 234, 254, 0.2)',
          borderRadius: '6px',
          pointerEvents: 'none',
        },

        '&::after': {
          content: '""',
          position: 'absolute',
          top: '20px',
          right: '20px',
          width: '15px',
          height: '15px',
          background: 'radial-gradient(circle, rgba(219, 234, 254, 0.8) 0%, rgba(219, 234, 254, 0.3) 60%, transparent 100%)',
          borderRadius: '50%',
          pointerEvents: 'none',
        },

        '&:hover': {
          transform: 'translateY(-4px) scale(1.03)',
          background: `
            linear-gradient(135deg, 
              #1e40af 0%, 
              #2563eb 25%, 
              #3b82f6 50%, 
              #2563eb 75%, 
              #1e40af 100%
            ),
            radial-gradient(ellipse at 45% 35%, rgba(96, 165, 250, 0.4) 0%, transparent 65%)
          `,
          color: '#eff6ff',
          borderColor: '#1e40af',
          boxShadow: `
            0 10px 30px rgba(30, 58, 138, 0.5),
            inset 0 3px 6px rgba(219, 234, 254, 0.3),
            inset 0 -3px 6px rgba(30, 58, 138, 0.4)
          `,
          textShadow: '0 2px 4px rgba(30, 58, 138, 0.9)',

          '&::before': {
            borderColor: 'rgba(219, 234, 254, 0.3)',
          },

          '&::after': {
            background: 'radial-gradient(circle, rgba(239, 246, 255, 0.9) 0%, rgba(219, 234, 254, 0.4) 60%, transparent 100%)',
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
      Pattern 26
    </Button>
  );
};

export default ButtonPatternTwentySix;