import React from 'react';
import { Button } from '@mui/material';

interface ButtonPatternThirtyFiveProps {
  onClick?: () => void;
}

const ButtonPatternThirtyFive: React.FC<ButtonPatternThirtyFiveProps> = ({ onClick }) => {
  const handleClick = () => {
    console.log('Pattern 13 ボタンがクリックされました！');
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
        
        // カーボンファイバー
        background: `
          repeating-linear-gradient(45deg, #1a1a1a 0px, #1a1a1a 2px, #2d2d2d 2px, #2d2d2d 4px),
          repeating-linear-gradient(-45deg, #0d0d0d 0px, #0d0d0d 2px, #262626 2px, #262626 4px),
          linear-gradient(0deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)
        `,
        color: '#00ff41',
        border: '2px solid #333333',
        fontWeight: 600,
        letterSpacing: '1.2px',
        borderRadius: '8px',
        width: '150px',
        height: '150px',
        minWidth: '150px',
        textTransform: 'none',
        fontSize: '12px',
        transition: 'all 0.3s ease',
        boxShadow: `
          0 6px 20px rgba(0, 0, 0, 0.5),
          inset 0 1px 3px rgba(255, 255, 255, 0.1),
          inset 0 -1px 3px rgba(0, 0, 0, 0.3)
        `,
        textShadow: '0 1px 3px rgba(0, 255, 65, 0.5), 0 0 10px rgba(0, 255, 65, 0.3)',

        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            repeating-linear-gradient(90deg, transparent 0px, rgba(255, 255, 255, 0.02) 1px, transparent 2px),
            repeating-linear-gradient(0deg, transparent 0px, rgba(255, 255, 255, 0.01) 1px, transparent 4px)
          `,
          borderRadius: '8px',
          pointerEvents: 'none',
        },

        '&::after': {
          content: '""',
          position: 'absolute',
          top: '5px',
          left: '5px',
          right: '5px',
          bottom: '5px',
          border: '1px solid rgba(0, 255, 65, 0.2)',
          borderRadius: '3px',
          pointerEvents: 'none',
        },

        '&:hover': {
          transform: 'translateY(-2px) scale(1.03)',
          background: `
            repeating-linear-gradient(45deg, #2a2a2a 0px, #2a2a2a 2px, #3d3d3d 2px, #3d3d3d 4px),
            repeating-linear-gradient(-45deg, #1d1d1d 0px, #1d1d1d 2px, #363636 2px, #363636 4px),
            linear-gradient(0deg, #2a2a2a 0%, #3d3d3d 50%, #2a2a2a 100%)
          `,
          color: '#00ff7f',
          borderColor: '#00ff41',
          boxShadow: `
            0 10px 30px rgba(0, 0, 0, 0.7),
            inset 0 2px 5px rgba(255, 255, 255, 0.15),
            inset 0 -2px 5px rgba(0, 0, 0, 0.4),
            0 0 20px rgba(0, 255, 65, 0.3)
          `,
          textShadow: '0 2px 5px rgba(0, 255, 127, 0.7), 0 0 15px rgba(0, 255, 65, 0.5)',
        },

        '&:active': {
          transform: 'translateY(0px) scale(1.01)',
          transition: 'all 0.1s ease',
        },

        '&:focus': {
          outline: 'none',
          boxShadow: `
            0 6px 20px rgba(0, 0, 0, 0.5),
            inset 0 1px 3px rgba(255, 255, 255, 0.1),
            inset 0 -1px 3px rgba(0, 0, 0, 0.3),
            0 0 0 2px rgba(0, 255, 65, 0.4)
          `,
        },
      }}
    >
      Pattern 13
    </Button>
  );
};

export default ButtonPatternThirtyFive;