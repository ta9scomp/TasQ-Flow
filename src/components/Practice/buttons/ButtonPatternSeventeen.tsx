import React from 'react';
import { Button } from '@mui/material';

interface ButtonPatternSeventeenProps {
  onClick?: () => void;
}

const ButtonPatternSeventeen: React.FC<ButtonPatternSeventeenProps> = ({ onClick }) => {
  const handleClick = () => {
    console.log('Pattern 17 ボタンがクリックされました！');
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
        
        // エレガント・フローラル
        background: `
          linear-gradient(135deg, #fdf2f8 0%, #f9fafb 50%, #fdf2f8 100%),
          radial-gradient(circle at 20% 30%, #f9a8d4 0%, transparent 30%),
          radial-gradient(circle at 80% 70%, #a7f3d0 0%, transparent 30%),
          radial-gradient(circle at 50% 50%, #fde68a 0%, transparent 25%)
        `,
        color: '#374151',
        border: '2px solid #d1d5db',
        fontWeight: 600,
        letterSpacing: '0.5px',
        borderRadius: '24px',
        width: '150px',
        height: '150px',
        minWidth: '150px',
        textTransform: 'none',
        fontSize: '14px',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: `
          0 4px 20px rgba(249, 168, 212, 0.2),
          inset 0 1px 3px rgba(255, 255, 255, 0.8)
        `,
        textShadow: '0 1px 2px rgba(255, 255, 255, 0.8)',

        '&::before': {
          content: '""',
          position: 'absolute',
          top: '15px',
          left: '20px',
          width: '12px',
          height: '12px',
          background: 'radial-gradient(circle, #f9a8d4 0%, #ec4899 100%)',
          borderRadius: '50%',
          opacity: 0.6,
        },

        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: '20px',
          right: '25px',
          width: '8px',
          height: '8px',
          background: 'radial-gradient(circle, #a7f3d0 0%, #10b981 100%)',
          borderRadius: '50%',
          opacity: 0.7,
        },

        '&:hover': {
          transform: 'translateY(-4px) scale(1.02)',
          background: `
            linear-gradient(135deg, #fef7ff 0%, #ffffff 50%, #fef7ff 100%),
            radial-gradient(circle at 25% 35%, #fbb6ce 0%, transparent 35%),
            radial-gradient(circle at 75% 65%, #bbf7d0 0%, transparent 35%),
            radial-gradient(circle at 50% 50%, #fef3c7 0%, transparent 30%)
          `,
          color: '#1f2937',
          borderColor: '#9ca3af',
          boxShadow: `
            0 8px 30px rgba(249, 168, 212, 0.3),
            inset 0 2px 5px rgba(255, 255, 255, 0.9),
            0 0 25px rgba(167, 243, 208, 0.2)
          `,
          textShadow: '0 2px 4px rgba(255, 255, 255, 0.9)',

          '&::before': {
            animation: 'float-flower 2s ease-in-out infinite',
          },

          '&::after': {
            animation: 'float-flower 2s ease-in-out infinite 0.5s',
          },
        },

        '@keyframes float-flower': {
          '0%, 100%': { transform: 'translateY(0) scale(1)' },
          '50%': { transform: 'translateY(-3px) scale(1.1)' },
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
      Pattern 17
    </Button>
  );
};

export default ButtonPatternSeventeen;