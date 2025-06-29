import React from 'react';
import { Button } from '@mui/material';

interface ButtonPatternTenProps {
  onClick?: () => void;
}

const ButtonPatternTen: React.FC<ButtonPatternTenProps> = ({ onClick }) => {
  const handleClick = () => {
    console.log('Pattern 10 ボタンがクリックされました！');
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
        
        // サイバー・メッシュ
        background: `
          linear-gradient(90deg, 
            rgba(245, 101, 101, 0.1) 0%, 
            rgba(251, 146, 60, 0.15) 25%, 
            rgba(252, 211, 77, 0.2) 50%, 
            rgba(251, 146, 60, 0.15) 75%, 
            rgba(245, 101, 101, 0.1) 100%
          ),
          linear-gradient(0deg, 
            rgba(6, 20, 30, 0.95) 0%, 
            rgba(15, 35, 50, 0.9) 50%, 
            rgba(6, 20, 30, 0.95) 100%
          ),
          repeating-linear-gradient(
            45deg,
            transparent 0px,
            rgba(245, 101, 101, 0.02) 1px,
            transparent 2px,
            rgba(251, 146, 60, 0.02) 3px,
            transparent 30px
          )
        `,
        color: '#f59e0b',
        border: '1px solid rgba(245, 101, 101, 0.3)',
        fontWeight: 600,
        letterSpacing: '1.5px',
        borderRadius: '2px',
        width: '150px',
        height: '150px',
        minWidth: '150px',
        textTransform: 'none',
        fontSize: '12px',
        transition: 'all 0.3s ease',
        backdropFilter: 'blur(8px)',
        boxShadow: `
          0 0 20px rgba(245, 101, 101, 0.2),
          inset 0 0 15px rgba(251, 146, 60, 0.1)
        `,
        textShadow: '0 0 8px rgba(245, 158, 11, 0.8)',
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
              0deg,
              transparent 0px,
              rgba(245, 101, 101, 0.08) 1px,
              transparent 2px,
              rgba(245, 101, 101, 0.04) 3px,
              transparent 25px
            ),
            repeating-linear-gradient(
              90deg,
              transparent 0px,
              rgba(251, 146, 60, 0.05) 1px,
              transparent 2px,
              rgba(251, 146, 60, 0.03) 3px,
              transparent 25px
            )
          `,
          animation: 'cyber-mesh 6s linear infinite',
        },

        '&::after': {
          content: '"◆"',
          position: 'absolute',
          top: '10px',
          right: '10px',
          fontSize: '8px',
          color: 'rgba(245, 101, 101, 0.6)',
          animation: 'mesh-blink 3s ease-in-out infinite',
          pointerEvents: 'none',
        },

        '@keyframes cyber-mesh': {
          '0%': { 
            transform: 'translate(0, 0)',
            opacity: 0.7,
          },
          '25%': { 
            transform: 'translate(1px, 0)',
            opacity: 0.9,
          },
          '50%': { 
            transform: 'translate(1px, 1px)',
            opacity: 0.8,
          },
          '75%': { 
            transform: 'translate(0, 1px)',
            opacity: 0.9,
          },
          '100%': { 
            transform: 'translate(0, 0)',
            opacity: 0.7,
          },
        },

        '@keyframes mesh-blink': {
          '0%, 70%, 100%': { 
            opacity: 0.4,
          },
          '85%': { 
            opacity: 1,
          },
        },

        '@keyframes data-surge': {
          '0%, 100%': { 
            boxShadow: `
              0 0 20px rgba(245, 101, 101, 0.3),
              inset 0 0 15px rgba(251, 146, 60, 0.15),
              0 0 40px rgba(245, 158, 11, 0.1)
            `,
            borderColor: 'rgba(245, 101, 101, 0.4)',
          },
          '50%': { 
            boxShadow: `
              0 0 30px rgba(251, 146, 60, 0.4),
              inset 0 0 20px rgba(252, 211, 77, 0.2),
              0 0 60px rgba(245, 101, 101, 0.2)
            `,
            borderColor: 'rgba(251, 146, 60, 0.6)',
          },
        },

        '&:hover': {
          transform: 'translateY(-1px) scale(1.01)',
          animation: 'data-surge 2s ease-in-out infinite',
          background: `
            linear-gradient(90deg, 
              rgba(245, 101, 101, 0.15) 0%, 
              rgba(251, 146, 60, 0.2) 25%, 
              rgba(252, 211, 77, 0.25) 50%, 
              rgba(251, 146, 60, 0.2) 75%, 
              rgba(245, 101, 101, 0.15) 100%
            ),
            linear-gradient(0deg, 
              rgba(6, 20, 30, 0.98) 0%, 
              rgba(15, 35, 50, 0.93) 50%, 
              rgba(6, 20, 30, 0.98) 100%
            ),
            repeating-linear-gradient(
              45deg,
              transparent 0px,
              rgba(245, 101, 101, 0.04) 1px,
              transparent 2px,
              rgba(251, 146, 60, 0.04) 3px,
              transparent 28px
            )
          `,
          color: '#fbbf24',
          textShadow: '0 0 12px rgba(251, 191, 36, 1)',

          '&::before': {
            animation: 'cyber-mesh 3s linear infinite',
            background: `
              repeating-linear-gradient(
                0deg,
                transparent 0px,
                rgba(245, 101, 101, 0.12) 1px,
                transparent 2px,
                rgba(245, 101, 101, 0.06) 3px,
                transparent 23px
              ),
              repeating-linear-gradient(
                90deg,
                transparent 0px,
                rgba(251, 146, 60, 0.08) 1px,
                transparent 2px,
                rgba(251, 146, 60, 0.05) 3px,
                transparent 23px
              )
            `,
          },

          '&::after': {
            animation: 'mesh-blink 1.5s ease-in-out infinite',
            color: 'rgba(251, 146, 60, 1)',
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
      Pattern 10
    </Button>
  );
};

export default ButtonPatternTen;