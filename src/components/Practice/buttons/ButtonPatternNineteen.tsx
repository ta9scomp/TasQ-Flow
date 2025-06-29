import React from 'react';
import { Button } from '@mui/material';

interface ButtonPatternNineteenProps {
  onClick?: () => void;
}

const ButtonPatternNineteen: React.FC<ButtonPatternNineteenProps> = ({ onClick }) => {
  const handleClick = () => {
    console.log('Pattern 19 ボタンがクリックされました！');
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
        
        // エレクトリック・ウェーブ
        background: `
          linear-gradient(45deg, #0f172a 0%, #1e293b 25%, #334155 50%, #1e293b 75%, #0f172a 100%),
          radial-gradient(circle at 30% 40%, rgba(34, 197, 94, 0.3) 0%, transparent 50%)
        `,
        color: '#22c55e',
        border: '2px solid #16a34a',
        fontWeight: 600,
        letterSpacing: '1.5px',
        borderRadius: '16px',
        width: '150px',
        height: '150px',
        minWidth: '150px',
        textTransform: 'none',
        fontSize: '13px',
        transition: 'all 0.4s ease',
        boxShadow: `
          0 6px 20px rgba(34, 197, 94, 0.2),
          inset 0 1px 3px rgba(34, 197, 94, 0.1)
        `,
        textShadow: '0 1px 3px rgba(34, 197, 94, 0.5), 0 0 10px rgba(34, 197, 94, 0.3)',

        '&::before': {
          content: '""',
          position: 'absolute',
          top: '50%',
          left: '0',
          width: '100%',
          height: '2px',
          background: 'linear-gradient(90deg, transparent 0%, #22c55e 20%, #16a34a 50%, #22c55e 80%, transparent 100%)',
          transform: 'translateY(-50%)',
          animation: 'pulse-line 2s ease-in-out infinite',
        },

        '&::after': {
          content: '""',
          position: 'absolute',
          top: '20px',
          right: '20px',
          width: '6px',
          height: '6px',
          background: '#22c55e',
          borderRadius: '50%',
          boxShadow: '0 0 6px #22c55e',
          animation: 'pulse-dot 1.5s ease-in-out infinite',
        },

        '@keyframes pulse-line': {
          '0%, 100%': { 
            opacity: 0.4,
            transform: 'translateY(-50%) scaleX(0.8)',
          },
          '50%': { 
            opacity: 1,
            transform: 'translateY(-50%) scaleX(1.2)',
          },
        },

        '@keyframes pulse-dot': {
          '0%, 100%': { 
            opacity: 0.6,
            transform: 'scale(1)',
          },
          '50%': { 
            opacity: 1,
            transform: 'scale(1.5)',
          },
        },

        '&:hover': {
          transform: 'translateY(-4px) scale(1.03)',
          background: `
            linear-gradient(45deg, #1e293b 0%, #334155 25%, #475569 50%, #334155 75%, #1e293b 100%),
            radial-gradient(circle at 35% 45%, rgba(34, 197, 94, 0.4) 0%, transparent 50%)
          `,
          color: '#4ade80',
          borderColor: '#22c55e',
          boxShadow: `
            0 10px 30px rgba(34, 197, 94, 0.3),
            inset 0 2px 5px rgba(34, 197, 94, 0.2),
            0 0 25px rgba(34, 197, 94, 0.2)
          `,
          textShadow: '0 2px 5px rgba(34, 197, 94, 0.7), 0 0 15px rgba(34, 197, 94, 0.5)',

          '&::before': {
            animation: 'pulse-line 1s ease-in-out infinite',
          },

          '&::after': {
            animation: 'pulse-dot 0.8s ease-in-out infinite',
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
      Pattern 19
    </Button>
  );
};

export default ButtonPatternNineteen;