import React from 'react';
import { Box } from '@mui/material';

interface ButtonPatternFiveProps {
  onClick?: () => void;
}

const ButtonPatternFive: React.FC<ButtonPatternFiveProps> = ({ onClick }) => {
  const handleClick = () => {
    console.log('Pattern 5ボタンがクリックされました！');
    if (onClick) {
      onClick();
    }
  };

  return (
    <Box
      onClick={handleClick}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'flex-end',
        backgroundColor: '#000',
        color: '#fff',
        fontSize: '16px',
        letterSpacing: '1px',
        border: '0.5px solid rgba(0, 0, 0, 0.1)',
        paddingBottom: '8px',
        height: '65px',
        width: '200px',
        padding: '12px',
        borderRadius: '15px 15px 12px 12px',
        cursor: 'pointer',
        position: 'relative',
        willChange: 'transform',
        transition: 'all .1s ease-in-out 0s',
        userSelect: 'none',
        // Add gradient shading to each side
        backgroundImage: `
          linear-gradient(to right, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0)),
          linear-gradient(to bottom, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0))
        `,
        backgroundPosition: 'bottom right, bottom right',
        backgroundSize: '100% 100%, 100% 100%',
        backgroundRepeat: 'no-repeat',
        boxShadow: `
          inset -4px -10px 0px rgba(255, 255, 255, 0.4),
          inset -4px -8px 0px rgba(0, 0, 0, 0.3),
          0px 2px 1px rgba(0, 0, 0, 0.3),
          0px 2px 1px rgba(255, 255, 255, 0.1)
        `,
        transform: 'perspective(70px) rotateX(5deg) rotateY(0deg)',

        '& span': {
          transform: 'translateY(-10px)',
        },

        '&::after': {
          content: '""',
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          backgroundImage: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.2), rgba(0, 0, 0, 0.5))',
          zIndex: -1,
          borderRadius: '15px',
          boxShadow: `
            inset 4px 0px 0px rgba(255, 255, 255, 0.1),
            inset 4px -8px 0px rgba(0, 0, 0, 0.3)
          `,
          transition: 'all .1s ease-in-out 0s',
        },

        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          backgroundImage: `
            linear-gradient(to right, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0)),
            linear-gradient(to bottom, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0))
          `,
          backgroundPosition: 'bottom right, bottom right',
          backgroundSize: '100% 100%, 100% 100%',
          backgroundRepeat: 'no-repeat',
          zIndex: -1,
          borderRadius: '15px',
          transition: 'all .1s ease-in-out 0s',
        },

        '&:active': {
          willChange: 'transform',
          transform: 'perspective(80px) rotateX(5deg) rotateY(1deg) translateY(3px) scale(0.96)',
          height: '64px',
          border: '0.25px solid rgba(0, 0, 0, 0.2)',
          boxShadow: `
            inset -4px -8px 0px rgba(255, 255, 255, 0.2),
            inset -4px -6px 0px rgba(0, 0, 0, 0.8),
            0px 1px 0px rgba(0, 0, 0, 0.9),
            0px 1px 0px rgba(255, 255, 255, 0.2)
          `,
          transition: 'all .1s ease-in-out 0s',

          '&::after': {
            backgroundImage: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.5), rgba(255, 255, 255, 0.2))',
          },

          '&::before': {
            content: '""',
            display: 'block',
            position: 'absolute',
            top: '5%',
            left: '20%',
            width: '50%',
            height: '80%',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            '@keyframes overlay': {
              from: {
                opacity: 0,
              },
              to: {
                opacity: 1,
              },
            },
            animation: 'overlay 0.1s ease-in-out 0s',
            pointerEvents: 'none',
          },
        },

        '&:focus': {
          outline: 'none',
        },

        '& svg': {
          width: '15px',
          height: '15px',
        },
      }}
    >
      <span>✨ Classic 3D</span>
    </Box>
  );
};

export default ButtonPatternFive;