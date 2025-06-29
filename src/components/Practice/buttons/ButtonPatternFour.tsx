import React from 'react';
import { Button } from '@mui/material';


interface ButtonPatternFourProps {
  onClick?: () => void;
}

const ButtonPatternFour: React.FC<ButtonPatternFourProps> = ({ onClick }) => {
  const handleClick = () => {
    console.log('Pattern 4ボタンがクリックされました！');
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
        
        
        
        // データ・マトリックス
        background: `
          linear-gradient(135deg, 
            rgba(0, 10, 20, 0.95) 0%, 
            rgba(5, 20, 35, 0.9) 50%, 
            rgba(10, 30, 50, 0.85) 100%
          ),
          repeating-linear-gradient(
            90deg,
            transparent 0px,
            rgba(0, 255, 127, 0.05) 1px,
            transparent 2px,
            rgba(0, 255, 127, 0.1) 3px,
            transparent 20px
          ),
          repeating-linear-gradient(
            0deg,
            transparent 0px,
            rgba(0, 255, 127, 0.03) 1px,
            transparent 2px,
            rgba(0, 255, 127, 0.08) 3px,
            transparent 20px
          )
        `,
        color: '#00ff7f',
        border: '1px solid rgba(0, 255, 127, 0.4)',
        fontWeight: 600,
        letterSpacing: '2px',
        borderRadius: '4px',
        width: '150px',
        height: '150px',
        minWidth: '150px',
        textTransform: 'none',
        fontSize: '12px',
        transition: 'all 0.3s ease',
        backdropFilter: 'blur(5px)',
        boxShadow: `
          0 0 20px rgba(0, 255, 127, 0.2),
          inset 0 0 10px rgba(0, 255, 127, 0.1)
        `,
        textShadow: '0 0 10px rgba(0, 255, 127, 1)',
        fontFamily: 'monospace',

        '&::before': {
          content: '""',
          position: 'absolute',
          top: '0',
          left: '0',
          right: '0',
          bottom: '0',
          background: `
            repeating-linear-gradient(
              45deg,
              transparent 0px,
              rgba(0, 255, 127, 0.02) 1px,
              transparent 2px
            )
          `,
          animation: 'data-flow 4s linear infinite',
        },

        '&::after': {
          content: '"< />"',
          position: 'absolute',
          bottom: '10px',
          right: '10px',
          fontSize: '8px',
          color: 'rgba(0, 255, 127, 0.6)',
          fontFamily: 'monospace',
          pointerEvents: 'none',
        },

        '@keyframes data-flow': {
          '0%': { 
            transform: 'translateX(-100%)',
            opacity: 0.3,
          },
          '100%': { 
            transform: 'translateX(100%)',
            opacity: 0.8,
          },
        },

        '@keyframes digital-pulse': {
          '0%, 100%': { 
            boxShadow: `
              0 0 20px rgba(0, 255, 127, 0.3),
              inset 0 0 10px rgba(0, 255, 127, 0.15),
              0 0 40px rgba(0, 255, 127, 0.1)
            `,
            borderColor: 'rgba(0, 255, 127, 0.5)',
          },
          '50%': { 
            boxShadow: `
              0 0 30px rgba(0, 255, 127, 0.5),
              inset 0 0 15px rgba(0, 255, 127, 0.2),
              0 0 60px rgba(0, 255, 127, 0.2)
            `,
            borderColor: 'rgba(0, 255, 127, 0.8)',
          },
        },

        '&:hover': {
          transform: 'translateY(-1px) scale(1.01)',
          animation: 'digital-pulse 1.5s ease-in-out infinite',
          background: `
            linear-gradient(135deg, 
              rgba(0, 15, 25, 0.98) 0%, 
              rgba(5, 25, 40, 0.93) 50%, 
              rgba(10, 35, 55, 0.88) 100%
            ),
            repeating-linear-gradient(
              90deg,
              transparent 0px,
              rgba(0, 255, 127, 0.08) 1px,
              transparent 2px,
              rgba(0, 255, 127, 0.15) 3px,
              transparent 18px
            ),
            repeating-linear-gradient(
              0deg,
              transparent 0px,
              rgba(0, 255, 127, 0.05) 1px,
              transparent 2px,
              rgba(0, 255, 127, 0.12) 3px,
              transparent 18px
            )
          `,
          color: '#ffffff',
          textShadow: '0 0 15px rgba(0, 255, 127, 1), 0 0 5px rgba(255, 255, 255, 0.8)',

          '&::before': {
            animation: 'data-flow 2s linear infinite',
          },

          '&::after': {
            color: 'rgba(0, 255, 127, 1)',
          },
        },
        '&:active': {
          transform: 'translateY(-3px) scale(1.02)',
          transition: 'all 0.1s ease',
        },
        '&:focus': {
          outline: 'none',
        },
      }}
    >
      Pattern 4
    </Button>
  );
};

export default ButtonPatternFour;