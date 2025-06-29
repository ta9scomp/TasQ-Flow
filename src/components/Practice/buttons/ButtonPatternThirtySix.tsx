import React from 'react';
import { Button } from '@mui/material';

interface ButtonPatternThirtySixProps {
  onClick?: () => void;
}

const ButtonPatternThirtySix: React.FC<ButtonPatternThirtySixProps> = ({ onClick }) => {
  const handleClick = () => {
    console.log('Pattern 36 ボタンがクリックされました！');
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
        
        // 偏光フィルター・エフェクト
        background: `
          linear-gradient(45deg, 
            rgba(99, 102, 241, 0.2) 0%,
            rgba(139, 92, 246, 0.2) 25%,
            rgba(168, 85, 247, 0.2) 50%,
            rgba(139, 92, 246, 0.2) 75%,
            rgba(99, 102, 241, 0.2) 100%
          ),
          repeating-linear-gradient(
            45deg,
            transparent 0px,
            rgba(255, 255, 255, 0.1) 2px,
            transparent 4px
          ),
          repeating-linear-gradient(
            -45deg,
            transparent 0px,
            rgba(0, 0, 0, 0.05) 2px,
            transparent 4px
          )
        `,
        backgroundColor: 'rgba(249, 250, 251, 0.9)',
        color: '#4338ca',
        border: '2px solid #8b5cf6',
        fontWeight: 600,
        letterSpacing: '0.5px',
        borderRadius: '16px',
        width: '150px',
        height: '150px',
        minWidth: '150px',
        textTransform: 'none',
        fontSize: '13px',
        transition: 'all 0.3s ease',
        boxShadow: `
          0 6px 20px rgba(139, 92, 246, 0.25),
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
              rgba(99, 102, 241, 0.1) 1px,
              transparent 2px,
              rgba(139, 92, 246, 0.1) 3px,
              transparent 4px,
              rgba(168, 85, 247, 0.1) 5px,
              transparent 6px
            )
          `,
          animation: 'polarize-horizontal 8s linear infinite',
        },

        '&::after': {
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
              rgba(168, 85, 247, 0.1) 1px,
              transparent 2px,
              rgba(139, 92, 246, 0.1) 3px,
              transparent 4px,
              rgba(99, 102, 241, 0.1) 5px,
              transparent 6px
            )
          `,
          animation: 'polarize-vertical 8s linear infinite 4s',
        },

        '@keyframes polarize-horizontal': {
          '0%': { 
            opacity: 1,
            transform: 'translateX(0)',
          },
          '50%': { 
            opacity: 0.3,
            transform: 'translateX(2px)',
          },
          '100%': { 
            opacity: 1,
            transform: 'translateX(0)',
          },
        },

        '@keyframes polarize-vertical': {
          '0%': { 
            opacity: 0.3,
            transform: 'translateY(0)',
          },
          '50%': { 
            opacity: 1,
            transform: 'translateY(2px)',
          },
          '100%': { 
            opacity: 0.3,
            transform: 'translateY(0)',
          },
        },

        '@keyframes polarization-shift': {
          '0%': { 
            background: `
              linear-gradient(45deg, 
                rgba(99, 102, 241, 0.3) 0%,
                rgba(139, 92, 246, 0.3) 25%,
                rgba(168, 85, 247, 0.3) 50%,
                rgba(139, 92, 246, 0.3) 75%,
                rgba(99, 102, 241, 0.3) 100%
              ),
              repeating-linear-gradient(
                45deg,
                transparent 0px,
                rgba(255, 255, 255, 0.2) 2px,
                transparent 4px
              ),
              repeating-linear-gradient(
                -45deg,
                transparent 0px,
                rgba(0, 0, 0, 0.1) 2px,
                transparent 4px
              )
            `,
            transform: 'rotate(0deg)',
          },
          '25%': { 
            background: `
              linear-gradient(90deg, 
                rgba(99, 102, 241, 0.3) 0%,
                rgba(139, 92, 246, 0.3) 25%,
                rgba(168, 85, 247, 0.3) 50%,
                rgba(139, 92, 246, 0.3) 75%,
                rgba(99, 102, 241, 0.3) 100%
              ),
              repeating-linear-gradient(
                90deg,
                transparent 0px,
                rgba(255, 255, 255, 0.2) 2px,
                transparent 4px
              ),
              repeating-linear-gradient(
                0deg,
                transparent 0px,
                rgba(0, 0, 0, 0.1) 2px,
                transparent 4px
              )
            `,
            transform: 'rotate(1deg)',
          },
          '50%': { 
            background: `
              linear-gradient(135deg, 
                rgba(99, 102, 241, 0.3) 0%,
                rgba(139, 92, 246, 0.3) 25%,
                rgba(168, 85, 247, 0.3) 50%,
                rgba(139, 92, 246, 0.3) 75%,
                rgba(99, 102, 241, 0.3) 100%
              ),
              repeating-linear-gradient(
                135deg,
                transparent 0px,
                rgba(255, 255, 255, 0.2) 2px,
                transparent 4px
              ),
              repeating-linear-gradient(
                45deg,
                transparent 0px,
                rgba(0, 0, 0, 0.1) 2px,
                transparent 4px
              )
            `,
            transform: 'rotate(0deg)',
          },
          '75%': { 
            background: `
              linear-gradient(180deg, 
                rgba(99, 102, 241, 0.3) 0%,
                rgba(139, 92, 246, 0.3) 25%,
                rgba(168, 85, 247, 0.3) 50%,
                rgba(139, 92, 246, 0.3) 75%,
                rgba(99, 102, 241, 0.3) 100%
              ),
              repeating-linear-gradient(
                180deg,
                transparent 0px,
                rgba(255, 255, 255, 0.2) 2px,
                transparent 4px
              ),
              repeating-linear-gradient(
                90deg,
                transparent 0px,
                rgba(0, 0, 0, 0.1) 2px,
                transparent 4px
              )
            `,
            transform: 'rotate(-1deg)',
          },
          '100%': { 
            background: `
              linear-gradient(45deg, 
                rgba(99, 102, 241, 0.3) 0%,
                rgba(139, 92, 246, 0.3) 25%,
                rgba(168, 85, 247, 0.3) 50%,
                rgba(139, 92, 246, 0.3) 75%,
                rgba(99, 102, 241, 0.3) 100%
              ),
              repeating-linear-gradient(
                45deg,
                transparent 0px,
                rgba(255, 255, 255, 0.2) 2px,
                transparent 4px
              ),
              repeating-linear-gradient(
                -45deg,
                transparent 0px,
                rgba(0, 0, 0, 0.1) 2px,
                transparent 4px
              )
            `,
            transform: 'rotate(0deg)',
          },
        },

        '@keyframes filter-glow': {
          '0%, 100%': { 
            boxShadow: `
              0 6px 20px rgba(139, 92, 246, 0.3),
              inset 0 2px 4px rgba(255, 255, 255, 0.9),
              0 0 15px rgba(99, 102, 241, 0.2)
            ` 
          },
          '50%': { 
            boxShadow: `
              0 8px 25px rgba(168, 85, 247, 0.4),
              inset 0 3px 6px rgba(255, 255, 255, 1),
              0 0 25px rgba(139, 92, 246, 0.3)
            ` 
          },
        },

        '&:hover': {
          transform: 'translateY(-3px) scale(1.02)',
          animation: 'polarization-shift 6s ease-in-out infinite, filter-glow 3s ease-in-out infinite',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          color: '#3730a3',
          borderColor: '#7c3aed',

          '&::before': {
            animation: 'polarize-horizontal 4s linear infinite',
            background: `
              repeating-linear-gradient(
                90deg,
                transparent 0px,
                rgba(99, 102, 241, 0.2) 1px,
                transparent 2px,
                rgba(139, 92, 246, 0.2) 3px,
                transparent 4px,
                rgba(168, 85, 247, 0.2) 5px,
                transparent 6px
              )
            `,
          },

          '&::after': {
            animation: 'polarize-vertical 4s linear infinite 2s',
            background: `
              repeating-linear-gradient(
                0deg,
                transparent 0px,
                rgba(168, 85, 247, 0.2) 1px,
                transparent 2px,
                rgba(139, 92, 246, 0.2) 3px,
                transparent 4px,
                rgba(99, 102, 241, 0.2) 5px,
                transparent 6px
              )
            `,
          },
        },

        '&:active': {
          transform: 'translateY(-1px) scale(1)',
          transition: 'all 0.1s ease',
        },

        '&:focus': {
          outline: 'none',
        },
      }}
    >
      Pattern 36
    </Button>
  );
};

export default ButtonPatternThirtySix;