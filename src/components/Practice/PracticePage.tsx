import React from 'react';
import { Box, Button } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { 
  BackToMainButton, 
  ButtonPatternOne, 
  ButtonPatternTwo, 
  ButtonPatternThree, 
  ButtonPatternFour, 
  ButtonPatternFive, 
  ButtonPatternSix, 
  ButtonPatternSeven, 
  ButtonPatternEight, 
  ButtonPatternNine, 
  ButtonPatternTen,
  ButtonPatternEleven,
  ButtonPatternTwelve,
  ButtonPatternThirteen,
  ButtonPatternFourteen,
  ButtonPatternFifteen,
  ButtonPatternSixteen,
  ButtonPatternSeventeen,
  ButtonPatternEighteen,
  ButtonPatternNineteen,
  ButtonPatternTwenty,
  ButtonPatternTwentyOne,
  ButtonPatternTwentyTwo,
  ButtonPatternTwentyThree,
  ButtonPatternTwentyFour,
  ButtonPatternTwentyFive,
  ButtonPatternTwentySix,
  ButtonPatternTwentySeven,
  ButtonPatternTwentyEight,
  ButtonPatternTwentyNine,
  ButtonPatternThirty,
} from './buttons';
import './PracticePage.css';

interface PracticePageProps {
  onBackToMain?: () => void;
  onNavigateToPracticeTwo?: () => void;
}

const PracticePage: React.FC<PracticePageProps> = ({ onBackToMain, onNavigateToPracticeTwo }) => {
  const handleAddClick = () => {
    console.log('新規追加ボタンがクリックされました！');
    // ここに必要に応じて処理を追加
  };

  return (
    <Box sx={{ 
      width: '100vw',
      minHeight: '100vh',
      backgroundColor: '#dddddd',
      position: 'relative',
      margin: 0,
      padding: 0,
      boxSizing: 'border-box',
    }}>
      {/* メインに戻るボタン（固定位置） */}
      <BackToMainButton onClick={onBackToMain} />
      
      {/* 練習ページ2へボタン（固定位置） */}
      <Button
        variant="contained"
        endIcon={<ArrowForwardIcon />}
        onClick={onNavigateToPracticeTwo}
        sx={{
          position: 'absolute',
          top: 16,
          right: 16,
          zIndex: 1000,
          backgroundColor: '#673ab7',
          color: 'white',
          fontWeight: 500,
          borderRadius: '8px',
          padding: '8px 16px',
          textTransform: 'none',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
          transition: 'all 0.3s ease',
          width: '170px',
          height: '40px',
          minWidth: '170px',
          '&:hover': {
            backgroundColor: '#5e35b1',
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
        練習ページ 2 へ
      </Button>

      {/* レスポンシブボタンエリア */}
      <Box sx={{ 
        p: 2,
        pt: 8,  // 上部のBackToMainButtonとの間隔
        width: '100%',
        boxSizing: 'border-box',
        display: 'flex',
        flexWrap: 'wrap',
        gap: 2,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
      }}>
        <ButtonPatternOne onClick={handleAddClick} />
        <ButtonPatternTwo onClick={handleAddClick} />
        <ButtonPatternThree onClick={handleAddClick} />
        <ButtonPatternFour onClick={handleAddClick} />
        <ButtonPatternFive onClick={handleAddClick} />
        <ButtonPatternSix onClick={handleAddClick} />
        <ButtonPatternSeven onClick={handleAddClick} />
        <ButtonPatternEight onClick={handleAddClick} />
        <ButtonPatternNine onClick={handleAddClick} />
        <ButtonPatternTen onClick={handleAddClick} />
        <ButtonPatternEleven onClick={handleAddClick} />
        <ButtonPatternTwelve onClick={handleAddClick} />
        <ButtonPatternThirteen onClick={handleAddClick} />
        <ButtonPatternFourteen onClick={handleAddClick} />
        <ButtonPatternFifteen onClick={handleAddClick} />
        <ButtonPatternSixteen onClick={handleAddClick} />
        <ButtonPatternSeventeen onClick={handleAddClick} />
        <ButtonPatternEighteen onClick={handleAddClick} />
        <ButtonPatternNineteen onClick={handleAddClick} />
        <ButtonPatternTwenty onClick={handleAddClick} />
        <ButtonPatternTwentyOne onClick={handleAddClick} />
        <ButtonPatternTwentyTwo onClick={handleAddClick} />
        <ButtonPatternTwentyThree onClick={handleAddClick} />
        <ButtonPatternTwentyFour onClick={handleAddClick} />
        <ButtonPatternTwentyFive onClick={handleAddClick} />
        <ButtonPatternTwentySix onClick={handleAddClick} />
        <ButtonPatternTwentySeven onClick={handleAddClick} />
        <ButtonPatternTwentyEight onClick={handleAddClick} />
        <ButtonPatternTwentyNine onClick={handleAddClick} />
        <ButtonPatternThirty onClick={handleAddClick} />
      </Box>

      {/* 空白のメインエリア - 学習用 */}
      <Box sx={{ 
        p: 2,
        width: '100%',
        boxSizing: 'border-box',
      }}>
        {/* ここに自由にコードを書いて学習してください */}
        
      </Box>
    </Box>
  );
};

export default PracticePage;