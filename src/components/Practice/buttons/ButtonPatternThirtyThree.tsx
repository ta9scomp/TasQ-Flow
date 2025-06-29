import React from 'react';
import { Button } from '@mui/material';

interface ButtonPatternThirtyThreeProps {
  onClick?: () => void;
}

const ButtonPatternThirtyThree: React.FC<ButtonPatternThirtyThreeProps> = ({ onClick }) => {
  const handleClick = () => {
    console.log('Pattern 33 ボタンがクリックされました！');
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
        
        // フラクタル・プリズム
        background: `
          conic-gradient(
            from 45deg at 50% 50%,
            rgba(79, 70, 229, 0.2) 0deg,
            rgba(168, 85, 247, 0.2) 60deg,
            rgba(236, 72, 153, 0.2) 120deg,
            rgba(251, 146, 60, 0.2) 180deg,
            rgba(250, 204, 21, 0.2) 240deg,
            rgba(34, 197, 94, 0.2) 300deg,
            rgba(79, 70, 229, 0.2) 360deg
          ),
          radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.3) 0%, transparent 70%)
        `,
        backgroundColor: '#f8fafc',
        color: '#475569',
        border: '2px solid #94a3b8',
        fontWeight: 600,
        letterSpacing: '0.6px',
        borderRadius: '14px',
        width: '150px',
        height: '150px',
        minWidth: '150px',
        textTransform: 'none',
        fontSize: '13px',
        transition: 'all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        backgroundSize: '200% 200%',
        boxShadow: `
          0 6px 20px rgba(100, 116, 139, 0.3),
          inset 0 1px 3px rgba(255, 255, 255, 0.7)
        `,

        '&::before': {
          content: '""',
          position: 'absolute',
          top: '25%',
          left: '25%',
          width: '50%',
          height: '50%',
          background: `
            conic-gradient(
              from 0deg at 50% 50%,
              rgba(79, 70, 229, 0.4) 0deg,
              rgba(168, 85, 247, 0.4) 72deg,
              rgba(236, 72, 153, 0.4) 144deg,
              rgba(251, 146, 60, 0.4) 216deg,
              rgba(250, 204, 21, 0.4) 288deg,
              rgba(79, 70, 229, 0.4) 360deg
            )
          `,
          borderRadius: '50%',
          animation: 'fractal-spin 8s linear infinite',
        },

        '&::after': {
          content: '""',
          position: 'absolute',
          top: '37.5%',
          left: '37.5%',
          width: '25%',
          height: '25%',
          background: `
            conic-gradient(
              from 180deg at 50% 50%,
              rgba(255, 255, 255, 0.6) 0deg,
              rgba(79, 70, 229, 0.6) 120deg,
              rgba(236, 72, 153, 0.6) 240deg,
              rgba(255, 255, 255, 0.6) 360deg
            )
          `,
          borderRadius: '50%',
          animation: 'fractal-spin 6s linear infinite reverse',
        },

        '@keyframes fractal-spin': {
          '0%': { transform: 'rotate(0deg) scale(1)' },
          '50%': { transform: 'rotate(180deg) scale(1.1)' },
          '100%': { transform: 'rotate(360deg) scale(1)' },
        },

        '@keyframes fractal-pulse': {
          '0%, 100%': { 
            backgroundPosition: '0% 50%',
            transform: 'scale(1)',
          },
          '25%': { 
            backgroundPosition: '25% 25%',
            transform: 'scale(1.02)',
          },
          '50%': { 
            backgroundPosition: '50% 0%',
            transform: 'scale(1.05)',
          },
          '75%': { 
            backgroundPosition: '75% 75%',
            transform: 'scale(1.02)',
          },
        },

        '@keyframes prismatic-shift': {
          '0%, 100%': { 
            boxShadow: `
              0 6px 20px rgba(79, 70, 229, 0.3),
              inset 0 2px 4px rgba(255, 255, 255, 0.8),
              0 0 20px rgba(79, 70, 229, 0.1)
            ` 
          },
          '16%': { 
            boxShadow: `
              0 8px 25px rgba(168, 85, 247, 0.3),
              inset 0 2px 4px rgba(255, 255, 255, 0.8),
              0 0 25px rgba(168, 85, 247, 0.2)
            ` 
          },
          '33%': { 
            boxShadow: `
              0 8px 25px rgba(236, 72, 153, 0.3),
              inset 0 2px 4px rgba(255, 255, 255, 0.8),
              0 0 25px rgba(236, 72, 153, 0.2)
            ` 
          },
          '50%': { 
            boxShadow: `
              0 8px 25px rgba(251, 146, 60, 0.3),
              inset 0 2px 4px rgba(255, 255, 255, 0.8),
              0 0 25px rgba(251, 146, 60, 0.2)
            ` 
          },
          '66%': { 
            boxShadow: `
              0 8px 25px rgba(250, 204, 21, 0.3),
              inset 0 2px 4px rgba(255, 255, 255, 0.8),
              0 0 25px rgba(250, 204, 21, 0.2)
            ` 
          },
          '83%': { 
            boxShadow: `
              0 8px 25px rgba(34, 197, 94, 0.3),
              inset 0 2px 4px rgba(255, 255, 255, 0.8),
              0 0 25px rgba(34, 197, 94, 0.2)
            ` 
          },
        },

        '&:hover': {
          animation: 'fractal-pulse 3s ease-in-out infinite, prismatic-shift 6s linear infinite',
          background: `
            conic-gradient(
              from 45deg at 50% 50%,
              rgba(79, 70, 229, 0.3) 0deg,
              rgba(168, 85, 247, 0.3) 60deg,
              rgba(236, 72, 153, 0.3) 120deg,
              rgba(251, 146, 60, 0.3) 180deg,
              rgba(250, 204, 21, 0.3) 240deg,
              rgba(34, 197, 94, 0.3) 300deg,
              rgba(79, 70, 229, 0.3) 360deg
            ),
            radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.4) 0%, transparent 70%)
          `,
          backgroundColor: '#ffffff',
          color: '#334155',
          borderColor: '#64748b',

          '&::before': {
            animation: 'fractal-spin 4s linear infinite',
            background: `
              conic-gradient(
                from 0deg at 50% 50%,
                rgba(79, 70, 229, 0.6) 0deg,
                rgba(168, 85, 247, 0.6) 72deg,
                rgba(236, 72, 153, 0.6) 144deg,
                rgba(251, 146, 60, 0.6) 216deg,
                rgba(250, 204, 21, 0.6) 288deg,
                rgba(79, 70, 229, 0.6) 360deg
              )
            `,
          },

          '&::after': {
            animation: 'fractal-spin 3s linear infinite reverse',
            background: `
              conic-gradient(
                from 180deg at 50% 50%,
                rgba(255, 255, 255, 0.8) 0deg,
                rgba(79, 70, 229, 0.8) 120deg,
                rgba(236, 72, 153, 0.8) 240deg,
                rgba(255, 255, 255, 0.8) 360deg
              )
            `,
          },
        },

        '&:active': {
          transform: 'scale(0.98)',
          transition: 'all 0.1s ease',
        },

        '&:focus': {
          outline: 'none',
        },
      }}
    >
      Pattern 33
    </Button>
  );
};

export default ButtonPatternThirtyThree;