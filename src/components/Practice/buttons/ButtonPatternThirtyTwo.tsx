import React from 'react';
import { Button } from '@mui/material';

interface ButtonPatternThirtyTwoProps {
  onClick?: () => void;
}

const ButtonPatternThirtyTwo: React.FC<ButtonPatternThirtyTwoProps> = ({ onClick }) => {
  const handleClick = () => {
    console.log('Pattern 32 ボタンがクリックされました！');
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
        
        // レンズフレア・エフェクト
        background: `
          radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.3) 20%, transparent 40%),
          radial-gradient(circle at 70% 70%, rgba(59, 130, 246, 0.2) 0%, rgba(59, 130, 246, 0.1) 30%, transparent 50%),
          radial-gradient(circle at 20% 80%, rgba(251, 146, 60, 0.2) 0%, rgba(251, 146, 60, 0.1) 25%, transparent 45%),
          radial-gradient(circle at 80% 20%, rgba(168, 85, 247, 0.2) 0%, rgba(168, 85, 247, 0.1) 25%, transparent 45%),
          linear-gradient(135deg, rgba(248, 250, 252, 0.9) 0%, rgba(241, 245, 249, 0.8) 100%)
        `,
        color: '#334155',
        border: '2px solid #e2e8f0',
        fontWeight: 700,
        letterSpacing: '0.5px',
        borderRadius: '16px',
        width: '150px',
        height: '150px',
        minWidth: '150px',
        textTransform: 'none',
        fontSize: '13px',
        transition: 'all 0.4s ease',
        boxShadow: `
          0 8px 25px rgba(148, 163, 184, 0.3),
          inset 0 2px 4px rgba(255, 255, 255, 0.9)
        `,

        '&::before': {
          content: '""',
          position: 'absolute',
          top: '20%',
          left: '20%',
          width: '8px',
          height: '8px',
          background: 'radial-gradient(circle, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.4) 50%, transparent 100%)',
          borderRadius: '50%',
          animation: 'lens-flare 4s ease-in-out infinite',
          boxShadow: `
            0 0 20px rgba(255, 255, 255, 0.8),
            0 0 40px rgba(255, 255, 255, 0.4)
          `,
        },

        '&::after': {
          content: '""',
          position: 'absolute',
          top: '60%',
          right: '25%',
          width: '12px',
          height: '12px',
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.8) 0%, rgba(59, 130, 246, 0.3) 60%, transparent 100%)',
          borderRadius: '50%',
          animation: 'lens-flare 4s ease-in-out infinite 2s',
          boxShadow: `
            0 0 15px rgba(59, 130, 246, 0.6),
            0 0 30px rgba(59, 130, 246, 0.3)
          `,
        },

        '@keyframes lens-flare': {
          '0%, 100%': { 
            opacity: 0.4,
            transform: 'scale(1)',
          },
          '50%': { 
            opacity: 1,
            transform: 'scale(1.5)',
          },
        },

        '@keyframes prism-burst': {
          '0%, 100%': { 
            background: `
              radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.4) 20%, transparent 40%),
              radial-gradient(circle at 70% 70%, rgba(59, 130, 246, 0.3) 0%, rgba(59, 130, 246, 0.15) 30%, transparent 50%),
              radial-gradient(circle at 20% 80%, rgba(251, 146, 60, 0.3) 0%, rgba(251, 146, 60, 0.15) 25%, transparent 45%),
              radial-gradient(circle at 80% 20%, rgba(168, 85, 247, 0.3) 0%, rgba(168, 85, 247, 0.15) 25%, transparent 45%),
              linear-gradient(135deg, rgba(248, 250, 252, 1) 0%, rgba(241, 245, 249, 0.9) 100%)
            ` 
          },
          '25%': { 
            background: `
              radial-gradient(circle at 70% 30%, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.4) 20%, transparent 40%),
              radial-gradient(circle at 30% 70%, rgba(168, 85, 247, 0.3) 0%, rgba(168, 85, 247, 0.15) 30%, transparent 50%),
              radial-gradient(circle at 80% 80%, rgba(34, 197, 94, 0.3) 0%, rgba(34, 197, 94, 0.15) 25%, transparent 45%),
              radial-gradient(circle at 20% 20%, rgba(236, 72, 153, 0.3) 0%, rgba(236, 72, 153, 0.15) 25%, transparent 45%),
              linear-gradient(135deg, rgba(248, 250, 252, 1) 0%, rgba(241, 245, 249, 0.9) 100%)
            ` 
          },
          '50%': { 
            background: `
              radial-gradient(circle at 50% 70%, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.4) 20%, transparent 40%),
              radial-gradient(circle at 50% 30%, rgba(236, 72, 153, 0.3) 0%, rgba(236, 72, 153, 0.15) 30%, transparent 50%),
              radial-gradient(circle at 80% 50%, rgba(59, 130, 246, 0.3) 0%, rgba(59, 130, 246, 0.15) 25%, transparent 45%),
              radial-gradient(circle at 20% 50%, rgba(250, 204, 21, 0.3) 0%, rgba(250, 204, 21, 0.15) 25%, transparent 45%),
              linear-gradient(135deg, rgba(248, 250, 252, 1) 0%, rgba(241, 245, 249, 0.9) 100%)
            ` 
          },
          '75%': { 
            background: `
              radial-gradient(circle at 30% 70%, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.4) 20%, transparent 40%),
              radial-gradient(circle at 70% 30%, rgba(250, 204, 21, 0.3) 0%, rgba(250, 204, 21, 0.15) 30%, transparent 50%),
              radial-gradient(circle at 20% 20%, rgba(168, 85, 247, 0.3) 0%, rgba(168, 85, 247, 0.15) 25%, transparent 45%),
              radial-gradient(circle at 80% 80%, rgba(34, 197, 94, 0.3) 0%, rgba(34, 197, 94, 0.15) 25%, transparent 45%),
              linear-gradient(135deg, rgba(248, 250, 252, 1) 0%, rgba(241, 245, 249, 0.9) 100%)
            ` 
          },
        },

        '&:hover': {
          transform: 'translateY(-4px) scale(1.05)',
          animation: 'prism-burst 3s ease-in-out infinite',
          color: '#1e293b',
          borderColor: '#cbd5e1',
          boxShadow: `
            0 12px 35px rgba(148, 163, 184, 0.4),
            inset 0 3px 6px rgba(255, 255, 255, 1),
            0 0 25px rgba(59, 130, 246, 0.2),
            0 0 25px rgba(168, 85, 247, 0.2)
          `,

          '&::before': {
            animation: 'lens-flare 2s ease-in-out infinite',
            width: '12px',
            height: '12px',
            boxShadow: `
              0 0 30px rgba(255, 255, 255, 1),
              0 0 60px rgba(255, 255, 255, 0.6)
            `,
          },

          '&::after': {
            animation: 'lens-flare 2s ease-in-out infinite 1s',
            width: '16px',
            height: '16px',
            boxShadow: `
              0 0 25px rgba(59, 130, 246, 0.8),
              0 0 50px rgba(59, 130, 246, 0.5)
            `,
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
      Pattern 32
    </Button>
  );
};

export default ButtonPatternThirtyTwo;