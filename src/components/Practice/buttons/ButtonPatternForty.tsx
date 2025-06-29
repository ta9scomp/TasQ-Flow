import React from 'react';
import { Button } from '@mui/material';

interface ButtonPatternFortyProps {
  onClick?: () => void;
}

const ButtonPatternForty: React.FC<ButtonPatternFortyProps> = ({ onClick }) => {
  const handleClick = () => {
    console.log('Pattern 40 ボタンがクリックされました！');
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
        
        // アルティメット・プリズマティック
        background: `
          conic-gradient(from 0deg at 30% 30%,
            rgba(239, 68, 68, 0.3) 0deg,
            rgba(251, 146, 60, 0.3) 45deg,
            rgba(250, 204, 21, 0.3) 90deg,
            rgba(34, 197, 94, 0.3) 135deg,
            rgba(59, 130, 246, 0.3) 180deg,
            rgba(147, 51, 234, 0.3) 225deg,
            rgba(168, 85, 247, 0.3) 270deg,
            rgba(236, 72, 153, 0.3) 315deg,
            rgba(239, 68, 68, 0.3) 360deg
          ),
          conic-gradient(from 180deg at 70% 70%,
            rgba(147, 51, 234, 0.2) 0deg,
            rgba(59, 130, 246, 0.2) 51deg,
            rgba(34, 197, 94, 0.2) 102deg,
            rgba(250, 204, 21, 0.2) 153deg,
            rgba(251, 146, 60, 0.2) 204deg,
            rgba(239, 68, 68, 0.2) 255deg,
            rgba(236, 72, 153, 0.2) 306deg,
            rgba(168, 85, 247, 0.2) 357deg,
            rgba(147, 51, 234, 0.2) 360deg
          ),
          radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.1) 30%, transparent 70%),
          linear-gradient(45deg, 
            rgba(248, 250, 252, 0.8) 0%, 
            rgba(241, 245, 249, 0.9) 50%, 
            rgba(248, 250, 252, 0.8) 100%
          )
        `,
        color: '#1e293b',
        border: '3px solid transparent',
        backgroundClip: 'padding-box',
        fontWeight: 700,
        letterSpacing: '1px',
        borderRadius: '24px',
        width: '150px',
        height: '150px',
        minWidth: '150px',
        textTransform: 'none',
        fontSize: '13px',
        transition: 'all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        backgroundSize: '300% 300%, 300% 300%, 100% 100%, 100% 100%',
        boxShadow: `
          0 10px 30px rgba(148, 163, 184, 0.4),
          inset 0 2px 4px rgba(255, 255, 255, 0.9),
          0 0 20px rgba(239, 68, 68, 0.1),
          0 0 20px rgba(59, 130, 246, 0.1),
          0 0 20px rgba(34, 197, 94, 0.1)
        `,
        textShadow: '0 1px 3px rgba(255, 255, 255, 0.8)',

        '&::before': {
          content: '""',
          position: 'absolute',
          top: '-3px',
          left: '-3px',
          right: '-3px',
          bottom: '-3px',
          background: `
            conic-gradient(from 0deg at 50% 50%,
              #ef4444 0deg,
              #fb923c 51deg,
              #facc15 102deg,
              #22c55e 153deg,
              #3b82f6 204deg,
              #9333ea 255deg,
              #a855f7 306deg,
              #ec4899 357deg,
              #ef4444 360deg
            )
          `,
          borderRadius: '26px',
          animation: 'prismatic-border 10s linear infinite',
          zIndex: -1,
        },

        '&::after': {
          content: '""',
          position: 'absolute',
          top: '15%',
          left: '15%',
          right: '15%',
          bottom: '15%',
          background: `
            repeating-conic-gradient(from 0deg at 50% 50%,
              transparent 0deg,
              rgba(255, 255, 255, 0.3) 12deg,
              transparent 24deg,
              rgba(255, 255, 255, 0.2) 36deg,
              transparent 48deg
            )
          `,
          borderRadius: '50%',
          animation: 'inner-spectrum 8s ease-in-out infinite',
        },

        '@keyframes prismatic-border': {
          '0%': { 
            transform: 'rotate(0deg) scale(1)',
            filter: 'hue-rotate(0deg)',
          },
          '50%': { 
            transform: 'rotate(180deg) scale(1.02)',
            filter: 'hue-rotate(180deg)',
          },
          '100%': { 
            transform: 'rotate(360deg) scale(1)',
            filter: 'hue-rotate(360deg)',
          },
        },

        '@keyframes inner-spectrum': {
          '0%, 100%': { 
            opacity: 0.6,
            transform: 'rotate(0deg) scale(1)',
          },
          '25%': { 
            opacity: 0.9,
            transform: 'rotate(90deg) scale(1.1)',
          },
          '50%': { 
            opacity: 0.7,
            transform: 'rotate(180deg) scale(1.05)',
          },
          '75%': { 
            opacity: 0.9,
            transform: 'rotate(270deg) scale(1.1)',
          },
        },

        '@keyframes ultimate-prism': {
          '0%': { 
            backgroundPosition: '0% 50%, 0% 50%, 50% 50%, 50% 50%',
            transform: 'scale(1) rotate(0deg)',
          },
          '25%': { 
            backgroundPosition: '50% 25%, 50% 75%, 50% 50%, 50% 50%',
            transform: 'scale(1.02) rotate(90deg)',
          },
          '50%': { 
            backgroundPosition: '100% 50%, 100% 50%, 50% 50%, 50% 50%',
            transform: 'scale(1.05) rotate(180deg)',
          },
          '75%': { 
            backgroundPosition: '50% 75%, 50% 25%, 50% 50%, 50% 50%',
            transform: 'scale(1.02) rotate(270deg)',
          },
          '100%': { 
            backgroundPosition: '0% 50%, 0% 50%, 50% 50%, 50% 50%',
            transform: 'scale(1) rotate(360deg)',
          },
        },

        '@keyframes spectrum-symphony': {
          '0%, 100%': { 
            boxShadow: `
              0 10px 30px rgba(148, 163, 184, 0.5),
              inset 0 3px 6px rgba(255, 255, 255, 1),
              0 0 25px rgba(239, 68, 68, 0.2),
              0 0 25px rgba(59, 130, 246, 0.2),
              0 0 25px rgba(34, 197, 94, 0.2)
            ` 
          },
          '12%': { 
            boxShadow: `
              0 12px 35px rgba(148, 163, 184, 0.5),
              inset 0 3px 6px rgba(255, 255, 255, 1),
              0 0 30px rgba(251, 146, 60, 0.3),
              0 0 30px rgba(250, 204, 21, 0.3),
              0 0 30px rgba(239, 68, 68, 0.2)
            ` 
          },
          '25%': { 
            boxShadow: `
              0 12px 35px rgba(148, 163, 184, 0.5),
              inset 0 3px 6px rgba(255, 255, 255, 1),
              0 0 30px rgba(250, 204, 21, 0.3),
              0 0 30px rgba(34, 197, 94, 0.3),
              0 0 30px rgba(251, 146, 60, 0.2)
            ` 
          },
          '37%': { 
            boxShadow: `
              0 12px 35px rgba(148, 163, 184, 0.5),
              inset 0 3px 6px rgba(255, 255, 255, 1),
              0 0 30px rgba(34, 197, 94, 0.3),
              0 0 30px rgba(59, 130, 246, 0.3),
              0 0 30px rgba(250, 204, 21, 0.2)
            ` 
          },
          '50%': { 
            boxShadow: `
              0 12px 35px rgba(148, 163, 184, 0.5),
              inset 0 3px 6px rgba(255, 255, 255, 1),
              0 0 30px rgba(59, 130, 246, 0.3),
              0 0 30px rgba(147, 51, 234, 0.3),
              0 0 30px rgba(34, 197, 94, 0.2)
            ` 
          },
          '62%': { 
            boxShadow: `
              0 12px 35px rgba(148, 163, 184, 0.5),
              inset 0 3px 6px rgba(255, 255, 255, 1),
              0 0 30px rgba(147, 51, 234, 0.3),
              0 0 30px rgba(168, 85, 247, 0.3),
              0 0 30px rgba(59, 130, 246, 0.2)
            ` 
          },
          '75%': { 
            boxShadow: `
              0 12px 35px rgba(148, 163, 184, 0.5),
              inset 0 3px 6px rgba(255, 255, 255, 1),
              0 0 30px rgba(168, 85, 247, 0.3),
              0 0 30px rgba(236, 72, 153, 0.3),
              0 0 30px rgba(147, 51, 234, 0.2)
            ` 
          },
          '87%': { 
            boxShadow: `
              0 12px 35px rgba(148, 163, 184, 0.5),
              inset 0 3px 6px rgba(255, 255, 255, 1),
              0 0 30px rgba(236, 72, 153, 0.3),
              0 0 30px rgba(239, 68, 68, 0.3),
              0 0 30px rgba(168, 85, 247, 0.2)
            ` 
          },
        },

        '&:hover': {
          animation: 'ultimate-prism 8s ease-in-out infinite, spectrum-symphony 10s linear infinite',
          color: '#0f172a',
          textShadow: '0 2px 4px rgba(255, 255, 255, 1)',

          '&::before': {
            animation: 'prismatic-border 5s linear infinite',
            background: `
              conic-gradient(from 0deg at 50% 50%,
                #ef4444 0deg,
                #fb923c 40deg,
                #facc15 80deg,
                #22c55e 120deg,
                #3b82f6 160deg,
                #9333ea 200deg,
                #a855f7 240deg,
                #ec4899 280deg,
                #ef4444 320deg,
                #fb923c 360deg
              )
            `,
          },

          '&::after': {
            animation: 'inner-spectrum 4s ease-in-out infinite',
            background: `
              repeating-conic-gradient(from 0deg at 50% 50%,
                transparent 0deg,
                rgba(255, 255, 255, 0.5) 8deg,
                transparent 16deg,
                rgba(255, 255, 255, 0.3) 24deg,
                transparent 32deg
              )
            `,
          },
        },

        '&:active': {
          transform: 'scale(0.95)',
          transition: 'all 0.1s ease',
        },

        '&:focus': {
          outline: 'none',
        },
      }}
    >
      Pattern 40
    </Button>
  );
};

export default ButtonPatternForty;