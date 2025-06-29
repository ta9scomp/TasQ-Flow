import React from 'react';
import { Button } from '@mui/material';

interface ButtonPatternThirtyNineProps {
  onClick?: () => void;
}

const ButtonPatternThirtyNine: React.FC<ButtonPatternThirtyNineProps> = ({ onClick }) => {
  const handleClick = () => {
    console.log('Pattern 39 ボタンがクリックされました！');
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
        
        // インターフェレンス・パターン
        background: `
          radial-gradient(circle at 25% 25%, rgba(79, 70, 229, 0.2) 0%, transparent 40%),
          radial-gradient(circle at 75% 25%, rgba(168, 85, 247, 0.2) 0%, transparent 40%),
          radial-gradient(circle at 25% 75%, rgba(236, 72, 153, 0.2) 0%, transparent 40%),
          radial-gradient(circle at 75% 75%, rgba(251, 146, 60, 0.2) 0%, transparent 40%),
          repeating-conic-gradient(from 0deg at 50% 50%,
            transparent 0deg,
            rgba(255, 255, 255, 0.05) 3deg,
            transparent 6deg,
            rgba(255, 255, 255, 0.1) 9deg,
            transparent 12deg
          )
        `,
        backgroundColor: 'rgba(241, 245, 249, 0.95)',
        color: '#475569',
        border: '2px solid #94a3b8',
        fontWeight: 600,
        letterSpacing: '0.6px',
        borderRadius: '50%',
        width: '150px',
        height: '150px',
        minWidth: '150px',
        textTransform: 'none',
        fontSize: '13px',
        transition: 'all 0.4s ease',
        backgroundSize: '100% 100%, 100% 100%, 100% 100%, 100% 100%, 400% 400%',
        boxShadow: `
          0 6px 20px rgba(148, 163, 184, 0.3),
          inset 0 1px 3px rgba(255, 255, 255, 0.8)
        `,

        '&::before': {
          content: '""',
          position: 'absolute',
          top: '10%',
          left: '10%',
          right: '10%',
          bottom: '10%',
          background: `
            repeating-radial-gradient(
              circle at 50% 50%,
              transparent 0px,
              rgba(79, 70, 229, 0.1) 8px,
              transparent 16px,
              rgba(168, 85, 247, 0.1) 24px,
              transparent 32px,
              rgba(236, 72, 153, 0.1) 40px,
              transparent 48px
            )
          `,
          borderRadius: '50%',
          animation: 'interference-wave 8s linear infinite',
        },

        '&::after': {
          content: '""',
          position: 'absolute',
          top: '20%',
          left: '20%',
          right: '20%',
          bottom: '20%',
          background: `
            repeating-radial-gradient(
              circle at 50% 50%,
              transparent 0px,
              rgba(251, 146, 60, 0.15) 6px,
              transparent 12px,
              rgba(250, 204, 21, 0.15) 18px,
              transparent 24px,
              rgba(34, 197, 94, 0.15) 30px,
              transparent 36px
            )
          `,
          borderRadius: '50%',
          animation: 'interference-wave 8s linear infinite reverse 2s',
        },

        '@keyframes interference-wave': {
          '0%': { 
            transform: 'scale(1) rotate(0deg)',
            opacity: 0.6,
          },
          '50%': { 
            transform: 'scale(1.1) rotate(180deg)',
            opacity: 0.9,
          },
          '100%': { 
            transform: 'scale(1) rotate(360deg)',
            opacity: 0.6,
          },
        },

        '@keyframes wave-interference': {
          '0%': { 
            backgroundPosition: '0% 50%, 0% 50%, 0% 50%, 0% 50%, 0% 50%',
          },
          '100%': { 
            backgroundPosition: '100% 50%, 100% 50%, 100% 50%, 100% 50%, 400% 50%',
          },
        },

        '@keyframes constructive-destructive': {
          '0%, 100%': { 
            background: `
              radial-gradient(circle at 25% 25%, rgba(79, 70, 229, 0.3) 0%, transparent 45%),
              radial-gradient(circle at 75% 25%, rgba(168, 85, 247, 0.3) 0%, transparent 45%),
              radial-gradient(circle at 25% 75%, rgba(236, 72, 153, 0.3) 0%, transparent 45%),
              radial-gradient(circle at 75% 75%, rgba(251, 146, 60, 0.3) 0%, transparent 45%),
              repeating-conic-gradient(from 0deg at 50% 50%,
                transparent 0deg,
                rgba(255, 255, 255, 0.1) 3deg,
                transparent 6deg,
                rgba(255, 255, 255, 0.2) 9deg,
                transparent 12deg
              )
            ` 
          },
          '25%': { 
            background: `
              radial-gradient(circle at 75% 25%, rgba(79, 70, 229, 0.3) 0%, transparent 45%),
              radial-gradient(circle at 25% 75%, rgba(168, 85, 247, 0.3) 0%, transparent 45%),
              radial-gradient(circle at 75% 75%, rgba(236, 72, 153, 0.3) 0%, transparent 45%),
              radial-gradient(circle at 25% 25%, rgba(251, 146, 60, 0.3) 0%, transparent 45%),
              repeating-conic-gradient(from 90deg at 50% 50%,
                transparent 0deg,
                rgba(255, 255, 255, 0.1) 3deg,
                transparent 6deg,
                rgba(255, 255, 255, 0.2) 9deg,
                transparent 12deg
              )
            ` 
          },
          '50%': { 
            background: `
              radial-gradient(circle at 75% 75%, rgba(79, 70, 229, 0.3) 0%, transparent 45%),
              radial-gradient(circle at 25% 75%, rgba(168, 85, 247, 0.3) 0%, transparent 45%),
              radial-gradient(circle at 25% 25%, rgba(236, 72, 153, 0.3) 0%, transparent 45%),
              radial-gradient(circle at 75% 25%, rgba(251, 146, 60, 0.3) 0%, transparent 45%),
              repeating-conic-gradient(from 180deg at 50% 50%,
                transparent 0deg,
                rgba(255, 255, 255, 0.1) 3deg,
                transparent 6deg,
                rgba(255, 255, 255, 0.2) 9deg,
                transparent 12deg
              )
            ` 
          },
          '75%': { 
            background: `
              radial-gradient(circle at 25% 75%, rgba(79, 70, 229, 0.3) 0%, transparent 45%),
              radial-gradient(circle at 75% 75%, rgba(168, 85, 247, 0.3) 0%, transparent 45%),
              radial-gradient(circle at 75% 25%, rgba(236, 72, 153, 0.3) 0%, transparent 45%),
              radial-gradient(circle at 25% 25%, rgba(251, 146, 60, 0.3) 0%, transparent 45%),
              repeating-conic-gradient(from 270deg at 50% 50%,
                transparent 0deg,
                rgba(255, 255, 255, 0.1) 3deg,
                transparent 6deg,
                rgba(255, 255, 255, 0.2) 9deg,
                transparent 12deg
              )
            ` 
          },
        },

        '@keyframes interference-glow': {
          '0%, 100%': { 
            boxShadow: `
              0 6px 20px rgba(148, 163, 184, 0.4),
              inset 0 2px 4px rgba(255, 255, 255, 0.9),
              0 0 15px rgba(79, 70, 229, 0.1),
              0 0 15px rgba(168, 85, 247, 0.1)
            ` 
          },
          '25%': { 
            boxShadow: `
              0 8px 25px rgba(148, 163, 184, 0.4),
              inset 0 2px 4px rgba(255, 255, 255, 0.9),
              0 0 20px rgba(168, 85, 247, 0.2),
              0 0 20px rgba(236, 72, 153, 0.2)
            ` 
          },
          '50%': { 
            boxShadow: `
              0 8px 25px rgba(148, 163, 184, 0.4),
              inset 0 2px 4px rgba(255, 255, 255, 0.9),
              0 0 20px rgba(236, 72, 153, 0.2),
              0 0 20px rgba(251, 146, 60, 0.2)
            ` 
          },
          '75%': { 
            boxShadow: `
              0 8px 25px rgba(148, 163, 184, 0.4),
              inset 0 2px 4px rgba(255, 255, 255, 0.9),
              0 0 20px rgba(251, 146, 60, 0.2),
              0 0 20px rgba(79, 70, 229, 0.2)
            ` 
          },
        },

        '&:hover': {
          transform: 'scale(1.05)',
          animation: 'wave-interference 5s linear infinite, constructive-destructive 6s ease-in-out infinite, interference-glow 4s ease-in-out infinite',
          backgroundColor: 'rgba(255, 255, 255, 0.98)',
          color: '#334155',
          borderColor: '#64748b',

          '&::before': {
            animation: 'interference-wave 4s linear infinite',
            background: `
              repeating-radial-gradient(
                circle at 50% 50%,
                transparent 0px,
                rgba(79, 70, 229, 0.2) 8px,
                transparent 16px,
                rgba(168, 85, 247, 0.2) 24px,
                transparent 32px,
                rgba(236, 72, 153, 0.2) 40px,
                transparent 48px
              )
            `,
          },

          '&::after': {
            animation: 'interference-wave 4s linear infinite reverse 1s',
            background: `
              repeating-radial-gradient(
                circle at 50% 50%,
                transparent 0px,
                rgba(251, 146, 60, 0.25) 6px,
                transparent 12px,
                rgba(250, 204, 21, 0.25) 18px,
                transparent 24px,
                rgba(34, 197, 94, 0.25) 30px,
                transparent 36px
              )
            `,
          },
        },

        '&:active': {
          transform: 'scale(1.02)',
          transition: 'all 0.1s ease',
        },

        '&:focus': {
          outline: 'none',
        },
      }}
    >
      Pattern 39
    </Button>
  );
};

export default ButtonPatternThirtyNine;