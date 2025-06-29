import React from 'react';
import { Button } from '@mui/material';

interface ButtonPatternThirtyFourProps {
  onClick?: () => void;
}

const ButtonPatternThirtyFour: React.FC<ButtonPatternThirtyFourProps> = ({ onClick }) => {
  const handleClick = () => {
    console.log('Pattern 34 ボタンがクリックされました！');
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
        
        // クリスタル・ディフラクション
        background: `
          linear-gradient(135deg, 
            rgba(147, 197, 253, 0.3) 0%,
            rgba(196, 181, 253, 0.3) 25%,
            rgba(252, 165, 165, 0.3) 50%,
            rgba(254, 215, 170, 0.3) 75%,
            rgba(147, 197, 253, 0.3) 100%
          ),
          repeating-linear-gradient(
            45deg,
            transparent 0px,
            rgba(255, 255, 255, 0.1) 1px,
            transparent 2px,
            rgba(255, 255, 255, 0.2) 3px,
            transparent 4px
          ),
          repeating-linear-gradient(
            -45deg,
            transparent 0px,
            rgba(255, 255, 255, 0.05) 1px,
            transparent 2px,
            rgba(255, 255, 255, 0.1) 3px,
            transparent 4px
          )
        `,
        backgroundColor: 'rgba(248, 250, 252, 0.8)',
        color: '#1e293b',
        border: '2px solid #cbd5e1',
        fontWeight: 600,
        letterSpacing: '0.7px',
        borderRadius: '12px',
        width: '150px',
        height: '150px',
        minWidth: '150px',
        textTransform: 'none',
        fontSize: '13px',
        transition: 'all 0.3s ease',
        clipPath: 'polygon(15% 0%, 85% 0%, 100% 15%, 100% 85%, 85% 100%, 15% 100%, 0% 85%, 0% 15%)',
        boxShadow: `
          0 8px 25px rgba(148, 163, 184, 0.3),
          inset 0 2px 4px rgba(255, 255, 255, 0.8)
        `,

        '&::before': {
          content: '""',
          position: 'absolute',
          top: '0',
          left: '0',
          right: '0',
          bottom: '0',
          background: `
            linear-gradient(45deg, 
              transparent 0%, 
              rgba(255, 255, 255, 0.4) 25%, 
              transparent 50%, 
              rgba(255, 255, 255, 0.2) 75%, 
              transparent 100%
            )
          `,
          animation: 'crystal-sweep 4s linear infinite',
        },

        '&::after': {
          content: '""',
          position: 'absolute',
          top: '20%',
          left: '20%',
          right: '20%',
          bottom: '20%',
          background: `
            radial-gradient(
              ellipse at 50% 50%,
              rgba(147, 197, 253, 0.4) 0%,
              rgba(196, 181, 253, 0.3) 30%,
              rgba(252, 165, 165, 0.3) 60%,
              transparent 100%
            )
          `,
          clipPath: 'polygon(20% 0%, 80% 0%, 100% 20%, 100% 80%, 80% 100%, 20% 100%, 0% 80%, 0% 20%)',
          animation: 'inner-glow 3s ease-in-out infinite',
        },

        '@keyframes crystal-sweep': {
          '0%': { transform: 'translateX(-100%) rotate(45deg)' },
          '100%': { transform: 'translateX(200%) rotate(45deg)' },
        },

        '@keyframes inner-glow': {
          '0%, 100%': { 
            opacity: 0.5,
            transform: 'scale(1)',
          },
          '50%': { 
            opacity: 0.8,
            transform: 'scale(1.1)',
          },
        },

        '@keyframes crystal-facets': {
          '0%, 100%': { 
            clipPath: 'polygon(15% 0%, 85% 0%, 100% 15%, 100% 85%, 85% 100%, 15% 100%, 0% 85%, 0% 15%)',
            transform: 'scale(1)',
          },
          '25%': { 
            clipPath: 'polygon(10% 0%, 90% 0%, 100% 10%, 100% 90%, 90% 100%, 10% 100%, 0% 90%, 0% 10%)',
            transform: 'scale(1.02)',
          },
          '50%': { 
            clipPath: 'polygon(20% 0%, 80% 0%, 100% 20%, 100% 80%, 80% 100%, 20% 100%, 0% 80%, 0% 20%)',
            transform: 'scale(1.05)',
          },
          '75%': { 
            clipPath: 'polygon(12% 0%, 88% 0%, 100% 12%, 100% 88%, 88% 100%, 12% 100%, 0% 88%, 0% 12%)',
            transform: 'scale(1.02)',
          },
        },

        '@keyframes spectrum-reflection': {
          '0%, 100%': { 
            background: `
              linear-gradient(135deg, 
                rgba(147, 197, 253, 0.4) 0%,
                rgba(196, 181, 253, 0.4) 25%,
                rgba(252, 165, 165, 0.4) 50%,
                rgba(254, 215, 170, 0.4) 75%,
                rgba(147, 197, 253, 0.4) 100%
              ),
              repeating-linear-gradient(
                45deg,
                transparent 0px,
                rgba(255, 255, 255, 0.2) 1px,
                transparent 2px,
                rgba(255, 255, 255, 0.3) 3px,
                transparent 4px
              ),
              repeating-linear-gradient(
                -45deg,
                transparent 0px,
                rgba(255, 255, 255, 0.1) 1px,
                transparent 2px,
                rgba(255, 255, 255, 0.2) 3px,
                transparent 4px
              )
            ` 
          },
          '33%': { 
            background: `
              linear-gradient(135deg, 
                rgba(196, 181, 253, 0.4) 0%,
                rgba(252, 165, 165, 0.4) 25%,
                rgba(254, 215, 170, 0.4) 50%,
                rgba(187, 247, 208, 0.4) 75%,
                rgba(196, 181, 253, 0.4) 100%
              ),
              repeating-linear-gradient(
                45deg,
                transparent 0px,
                rgba(255, 255, 255, 0.2) 1px,
                transparent 2px,
                rgba(255, 255, 255, 0.3) 3px,
                transparent 4px
              ),
              repeating-linear-gradient(
                -45deg,
                transparent 0px,
                rgba(255, 255, 255, 0.1) 1px,
                transparent 2px,
                rgba(255, 255, 255, 0.2) 3px,
                transparent 4px
              )
            ` 
          },
          '66%': { 
            background: `
              linear-gradient(135deg, 
                rgba(252, 165, 165, 0.4) 0%,
                rgba(254, 215, 170, 0.4) 25%,
                rgba(187, 247, 208, 0.4) 50%,
                rgba(147, 197, 253, 0.4) 75%,
                rgba(252, 165, 165, 0.4) 100%
              ),
              repeating-linear-gradient(
                45deg,
                transparent 0px,
                rgba(255, 255, 255, 0.2) 1px,
                transparent 2px,
                rgba(255, 255, 255, 0.3) 3px,
                transparent 4px
              ),
              repeating-linear-gradient(
                -45deg,
                transparent 0px,
                rgba(255, 255, 255, 0.1) 1px,
                transparent 2px,
                rgba(255, 255, 255, 0.2) 3px,
                transparent 4px
              )
            ` 
          },
        },

        '&:hover': {
          animation: 'crystal-facets 2s ease-in-out infinite, spectrum-reflection 4s ease-in-out infinite',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          color: '#0f172a',
          borderColor: '#94a3b8',
          boxShadow: `
            0 12px 35px rgba(148, 163, 184, 0.4),
            inset 0 3px 6px rgba(255, 255, 255, 0.9),
            0 0 30px rgba(147, 197, 253, 0.3),
            0 0 30px rgba(196, 181, 253, 0.2)
          `,

          '&::before': {
            animation: 'crystal-sweep 2s linear infinite',
          },

          '&::after': {
            animation: 'inner-glow 1.5s ease-in-out infinite',
            background: `
              radial-gradient(
                ellipse at 50% 50%,
                rgba(147, 197, 253, 0.6) 0%,
                rgba(196, 181, 253, 0.5) 30%,
                rgba(252, 165, 165, 0.5) 60%,
                transparent 100%
              )
            `,
          },
        },

        '&:active': {
          transform: 'scale(0.97)',
          transition: 'all 0.1s ease',
        },

        '&:focus': {
          outline: 'none',
        },
      }}
    >
      Pattern 34
    </Button>
  );
};

export default ButtonPatternThirtyFour;