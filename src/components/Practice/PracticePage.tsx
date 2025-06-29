import React from 'react';
import { Box } from '@mui/material';
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
  ButtonPatternThirtyOne,
  ButtonPatternThirtyTwo,
  ButtonPatternThirtyThree,
  ButtonPatternThirtyFour,
  ButtonPatternThirtyFive,
  ButtonPatternThirtySix,
  ButtonPatternThirtySeven,
  ButtonPatternThirtyEight,
  ButtonPatternThirtyNine,
  ButtonPatternForty
} from './buttons';
import './PracticePage.css';

interface PracticePageProps {
  onBackToMain?: () => void;
}

const PracticePage: React.FC<PracticePageProps> = ({ onBackToMain }) => {
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
        <ButtonPatternThirtyOne onClick={handleAddClick} />
        <ButtonPatternThirtyTwo onClick={handleAddClick} />
        <ButtonPatternThirtyThree onClick={handleAddClick} />
        <ButtonPatternThirtyFour onClick={handleAddClick} />
        <ButtonPatternThirtyFive onClick={handleAddClick} />
        <ButtonPatternThirtySix onClick={handleAddClick} />
        <ButtonPatternThirtySeven onClick={handleAddClick} />
        <ButtonPatternThirtyEight onClick={handleAddClick} />
        <ButtonPatternThirtyNine onClick={handleAddClick} />
        <ButtonPatternForty onClick={handleAddClick} />
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