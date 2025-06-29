import React from 'react';
import { Button } from '@mui/material';
import { ArrowBackIosNewSharp as ArrowBackIosNewSharpIcon} from '@mui/icons-material';

interface BackToMainButtonProps {
  onClick?: () => void;
}

const BackToMainButton: React.FC<BackToMainButtonProps> = ({ onClick }) => {
  const handleClick = () => {
    console.log('メインに戻るボタンがクリックされました！');
    if (onClick) {
      onClick();
    }
  };

  return (
    <Button
      variant="contained"
      startIcon={<ArrowBackIosNewSharpIcon />}
      onClick={handleClick}
      sx={{
        position: 'absolute',
        top: 16,
        left: 16,
        zIndex: 1000,
        backgroundColor: '#2196F3',
        color: 'white',
        fontWeight: 500,
        borderRadius: '8px',
        padding: '8px 16px',
        textTransform: 'none',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
        transition: 'all 0.3s ease',
        // 明示的なサイズ指定
        width: '150px',
        height: '40px',
        minWidth: '150px',
        '&:hover': {
          backgroundColor: '#1976D2',
          transform: 'translateY(-10px)',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
        },
        '&:active': {
          transform: 'translateY(0)',
        },
        '&:focus': {
          outline: 'none',
        },
      }}
    >
    メインに戻る
    </Button>
  );
};

export default BackToMainButton;