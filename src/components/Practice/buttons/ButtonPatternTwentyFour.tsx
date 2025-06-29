import React from 'react';
import { Button } from '@mui/material';

interface ButtonPatternTwentyFourProps {
  onClick?: () => void;
}

const ButtonPatternTwentyFour: React.FC<ButtonPatternTwentyFourProps> = ({ onClick }) => {
  const handleClick = () => {
    console.log('Pattern 24 ボタンがクリックされました！');
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
        
        // コメット・トレイル
        background: `
          linear-gradient(135deg, #0c0a1a 0%, #1e1b4b 30%, #312e81 60%, #1e1b4b 100%),
          radial-gradient(ellipse 40% 20% at 80% 20%, rgba(34, 197, 94, 0.6) 0%, transparent 60%)
        `,
        color: '#a5f3fc',
        border: '2px solid #0891b2',
        fontWeight: 600,
        letterSpacing: '1px',
        borderRadius: '25px',
        width: '150px',
        height: '150px',
        minWidth: '150px',
        textTransform: 'none',
        fontSize: '13px',
        transition: 'all 0.4s ease',
        boxShadow: `
          0 6px 20px rgba(8, 145, 178, 0.3),
          inset 0 1px 3px rgba(165, 243, 252, 0.2)
        `,
        textShadow: '0 2px 6px rgba(8, 145, 178, 0.8), 0 0 12px rgba(165, 243, 252, 0.4)',

        '&::before': {
          content: '""',
          position: 'absolute',
          top: '20px',
          right: '15px',
          width: '80px',
          height: '4px',
          background: 'linear-gradient(90deg, rgba(34, 197, 94, 0.9) 0%, rgba(56, 178, 172, 0.7) 30%, rgba(14, 165, 233, 0.5) 60%, transparent 100%)',
          borderRadius: '2px',
          transform: 'rotate(-25deg)',
          animation: 'comet-trail 3s ease-in-out infinite',
        },

        '&::after': {
          content: '""',
          position: 'absolute',
          top: '18px',
          right: '10px',
          width: '8px',
          height: '8px',
          background: 'radial-gradient(circle, #22c55e 0%, #0ea5e9 70%, transparent 100%)',
          borderRadius: '50%',
          boxShadow: '0 0 12px #22c55e',
          animation: 'comet-head 3s ease-in-out infinite',
        },

        '@keyframes comet-trail': {
          '0%, 100%': { 
            opacity: 0.6,
            transform: 'rotate(-25deg) translateX(0) scaleX(1)',
          },
          '50%': { 
            opacity: 1,
            transform: 'rotate(-25deg) translateX(-10px) scaleX(1.3)',
          },
        },

        '@keyframes comet-head': {
          '0%, 100%': { 
            opacity: 0.8,
            transform: 'scale(1)',
            boxShadow: '0 0 12px #22c55e',
          },
          '50%': { 
            opacity: 1,
            transform: 'scale(1.4)',
            boxShadow: '0 0 20px #22c55e, 0 0 30px #0ea5e9',
          },
        },

        '@keyframes stellar-drift': {
          '0%, 100%': { 
            boxShadow: `
              0 6px 20px rgba(8, 145, 178, 0.4),
              inset 0 1px 3px rgba(165, 243, 252, 0.3),
              0 0 25px rgba(34, 197, 94, 0.2)
            ` 
          },
          '33%': { 
            boxShadow: `
              0 8px 25px rgba(34, 197, 94, 0.4),
              inset 0 2px 5px rgba(165, 243, 252, 0.4),
              0 0 30px rgba(14, 165, 233, 0.3)
            ` 
          },
          '66%': { 
            boxShadow: `
              0 10px 30px rgba(14, 165, 233, 0.4),
              inset 0 2px 5px rgba(165, 243, 252, 0.4),
              0 0 35px rgba(56, 178, 172, 0.3)
            ` 
          },
        },

        '&:hover': {
          transform: 'translateY(-5px) scale(1.04)',
          background: `
            linear-gradient(135deg, #1e1b4b 0%, #312e81 30%, #4338ca 60%, #312e81 100%),
            radial-gradient(ellipse 45% 25% at 75% 25%, rgba(34, 197, 94, 0.8) 0%, transparent 65%)
          `,
          color: '#ecfeff',
          borderColor: '#06b6d4',
          animation: 'stellar-drift 2s ease-in-out infinite',
          textShadow: '0 3px 8px rgba(6, 182, 212, 1), 0 0 18px rgba(236, 254, 255, 0.6)',

          '&::before': {
            animation: 'comet-trail 1.5s ease-in-out infinite',
            background: 'linear-gradient(90deg, rgba(34, 197, 94, 1) 0%, rgba(56, 178, 172, 0.9) 30%, rgba(14, 165, 233, 0.7) 60%, transparent 100%)',
          },

          '&::after': {
            animation: 'comet-head 1.5s ease-in-out infinite',
            boxShadow: '0 0 20px #22c55e, 0 0 30px #0ea5e9, 0 0 40px #38b2ac',
          },
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
      Pattern 24
    </Button>
  );
};

export default ButtonPatternTwentyFour;