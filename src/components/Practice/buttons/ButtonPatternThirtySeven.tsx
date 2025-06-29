import React from 'react';
import { Button } from '@mui/material';

interface ButtonPatternThirtySevenProps {
  onClick?: () => void;
}

const ButtonPatternThirtySeven: React.FC<ButtonPatternThirtySevenProps> = ({ onClick }) => {
  const handleClick = () => {
    console.log('Pattern 37 ボタンがクリックされました！');
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
        
        // 回折格子スペクトラム
        background: `
          repeating-linear-gradient(
            0deg,
            rgba(255, 0, 128, 0.15) 0px,
            rgba(255, 127, 0, 0.15) 8px,
            rgba(255, 255, 0, 0.15) 16px,
            rgba(128, 255, 0, 0.15) 24px,
            rgba(0, 255, 128, 0.15) 32px,
            rgba(0, 128, 255, 0.15) 40px,
            rgba(128, 0, 255, 0.15) 48px,
            rgba(255, 0, 128, 0.15) 56px
          ),
          linear-gradient(135deg, 
            rgba(248, 250, 252, 0.9) 0%, 
            rgba(241, 245, 249, 0.8) 100%
          )
        `,
        color: '#1e293b',
        border: '2px solid #64748b',
        fontWeight: 700,
        letterSpacing: '0.8px',
        borderRadius: '8px',
        width: '150px',
        height: '150px',
        minWidth: '150px',
        textTransform: 'none',
        fontSize: '13px',
        transition: 'all 0.4s ease',
        backgroundSize: '100% 100%, 100% 100%',
        boxShadow: `
          0 8px 25px rgba(100, 116, 139, 0.3),
          inset 0 1px 3px rgba(255, 255, 255, 0.8)
        `,

        '&::before': {
          content: '""',
          position: 'absolute',
          top: '0',
          left: '0',
          right: '0',
          bottom: '0',
          background: `
            repeating-linear-gradient(
              90deg,
              transparent 0px,
              rgba(255, 255, 255, 0.2) 1px,
              transparent 2px,
              rgba(255, 255, 255, 0.1) 3px,
              transparent 4px
            )
          `,
          animation: 'grating-interference 5s linear infinite',
        },

        '&::after': {
          content: '""',
          position: 'absolute',
          top: '30%',
          left: '10%',
          right: '10%',
          height: '40%',
          background: `
            linear-gradient(90deg,
              transparent 0%,
              rgba(255, 0, 128, 0.4) 14%,
              rgba(255, 127, 0, 0.4) 28%,
              rgba(255, 255, 0, 0.4) 42%,
              rgba(128, 255, 0, 0.4) 56%,
              rgba(0, 255, 128, 0.4) 70%,
              rgba(0, 128, 255, 0.4) 84%,
              transparent 100%
            )
          `,
          borderRadius: '2px',
          animation: 'spectrum-diffraction 6s ease-in-out infinite',
          filter: 'blur(1px)',
        },

        '@keyframes grating-interference': {
          '0%': { 
            transform: 'translateY(0)',
            opacity: 0.5,
          },
          '50%': { 
            transform: 'translateY(-2px)',
            opacity: 0.8,
          },
          '100%': { 
            transform: 'translateY(0)',
            opacity: 0.5,
          },
        },

        '@keyframes spectrum-diffraction': {
          '0%, 100%': { 
            opacity: 0.6,
            transform: 'scaleX(1) scaleY(1)',
          },
          '33%': { 
            opacity: 0.9,
            transform: 'scaleX(1.1) scaleY(0.8)',
          },
          '66%': { 
            opacity: 0.7,
            transform: 'scaleX(0.9) scaleY(1.2)',
          },
        },

        '@keyframes diffraction-wave': {
          '0%': { 
            backgroundPosition: '0% 0%, 0% 0%',
          },
          '100%': { 
            backgroundPosition: '100% 100%, 0% 0%',
          },
        },

        '@keyframes spectral-expansion': {
          '0%, 100%': { 
            background: `
              repeating-linear-gradient(
                0deg,
                rgba(255, 0, 128, 0.2) 0px,
                rgba(255, 127, 0, 0.2) 8px,
                rgba(255, 255, 0, 0.2) 16px,
                rgba(128, 255, 0, 0.2) 24px,
                rgba(0, 255, 128, 0.2) 32px,
                rgba(0, 128, 255, 0.2) 40px,
                rgba(128, 0, 255, 0.2) 48px,
                rgba(255, 0, 128, 0.2) 56px
              ),
              linear-gradient(135deg, 
                rgba(255, 255, 255, 0.95) 0%, 
                rgba(248, 250, 252, 0.9) 100%
              )
            ` 
          },
          '50%': { 
            background: `
              repeating-linear-gradient(
                45deg,
                rgba(255, 0, 128, 0.25) 0px,
                rgba(255, 127, 0, 0.25) 6px,
                rgba(255, 255, 0, 0.25) 12px,
                rgba(128, 255, 0, 0.25) 18px,
                rgba(0, 255, 128, 0.25) 24px,
                rgba(0, 128, 255, 0.25) 30px,
                rgba(128, 0, 255, 0.25) 36px,
                rgba(255, 0, 128, 0.25) 42px
              ),
              linear-gradient(135deg, 
                rgba(255, 255, 255, 0.95) 0%, 
                rgba(248, 250, 252, 0.9) 100%
              )
            ` 
          },
        },

        '@keyframes rainbow-shimmer': {
          '0%, 100%': { 
            boxShadow: `
              0 8px 25px rgba(100, 116, 139, 0.4),
              inset 0 2px 4px rgba(255, 255, 255, 0.9),
              0 0 20px rgba(255, 0, 128, 0.1)
            ` 
          },
          '16%': { 
            boxShadow: `
              0 10px 30px rgba(100, 116, 139, 0.4),
              inset 0 2px 4px rgba(255, 255, 255, 0.9),
              0 0 25px rgba(255, 127, 0, 0.2)
            ` 
          },
          '33%': { 
            boxShadow: `
              0 10px 30px rgba(100, 116, 139, 0.4),
              inset 0 2px 4px rgba(255, 255, 255, 0.9),
              0 0 25px rgba(255, 255, 0, 0.2)
            ` 
          },
          '50%': { 
            boxShadow: `
              0 10px 30px rgba(100, 116, 139, 0.4),
              inset 0 2px 4px rgba(255, 255, 255, 0.9),
              0 0 25px rgba(128, 255, 0, 0.2)
            ` 
          },
          '66%': { 
            boxShadow: `
              0 10px 30px rgba(100, 116, 139, 0.4),
              inset 0 2px 4px rgba(255, 255, 255, 0.9),
              0 0 25px rgba(0, 255, 128, 0.2)
            ` 
          },
          '83%': { 
            boxShadow: `
              0 10px 30px rgba(100, 116, 139, 0.4),
              inset 0 2px 4px rgba(255, 255, 255, 0.9),
              0 0 25px rgba(0, 128, 255, 0.2)
            ` 
          },
        },

        '&:hover': {
          transform: 'translateY(-4px) scale(1.03)',
          animation: 'diffraction-wave 4s linear infinite, spectral-expansion 5s ease-in-out infinite, rainbow-shimmer 6s linear infinite',
          color: '#0f172a',
          borderColor: '#475569',

          '&::before': {
            animation: 'grating-interference 3s linear infinite',
            background: `
              repeating-linear-gradient(
                90deg,
                transparent 0px,
                rgba(255, 255, 255, 0.3) 1px,
                transparent 2px,
                rgba(255, 255, 255, 0.2) 3px,
                transparent 4px
              )
            `,
          },

          '&::after': {
            animation: 'spectrum-diffraction 3s ease-in-out infinite',
            background: `
              linear-gradient(90deg,
                transparent 0%,
                rgba(255, 0, 128, 0.6) 14%,
                rgba(255, 127, 0, 0.6) 28%,
                rgba(255, 255, 0, 0.6) 42%,
                rgba(128, 255, 0, 0.6) 56%,
                rgba(0, 255, 128, 0.6) 70%,
                rgba(0, 128, 255, 0.6) 84%,
                transparent 100%
              )
            `,
            filter: 'blur(0.5px)',
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
      Pattern 37
    </Button>
  );
};

export default ButtonPatternThirtySeven;