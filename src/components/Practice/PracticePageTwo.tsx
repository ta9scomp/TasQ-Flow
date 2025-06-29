import React from 'react';
import { Box } from '@mui/material';
import { BackToMainButton } from '../Practice/buttons';
import './PracticePageTwo.css';

interface PracticePageTwoProps {
  onBack: () => void;
}

const PracticePageTwo: React.FC<PracticePageTwoProps> = ({ onBack }) => {
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
      <BackToMainButton onClick={onBack} />

      {/* レスポンシブボタンエリア */}
      <Box sx={{ 
        p: 2,
        pt: 8,  // 上部のBackToMainButtonとの間隔
        width: '100%',
        boxSizing: 'border-box',
        display: 'flex',
        flexWrap: 'wrap',
        gap: 2,
        justifyContent: 'center',
        alignItems: 'flex-start',
      }}>
        {/* ここにボタンコンポーネントを配置 */}
      </Box>
    </Box>
  );
};

export default PracticePageTwo;