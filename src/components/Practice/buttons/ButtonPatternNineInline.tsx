import React from 'react';
import { Button } from '@mui/material';

interface ButtonPatternNineInlineProps {
  onClick?: () => void;
}

const ButtonPatternNineInline: React.FC<ButtonPatternNineInlineProps> = ({ onClick }) => {
  const handleClick = () => {
    console.log('Pattern 9 インライン版ボタンがクリックされました！');
    if (onClick) {
      onClick();
    }
  };

  // TSXファイル内でのCSS記述方法
  const buttonStyles: React.CSSProperties = {
    position: 'relative',
    overflow: 'hidden',
    width: '150px',
    height: '150px',
    minWidth: '150px',
    borderRadius: '12px',
    
    // ベースの背景（複数のグラデーションはCSSプロパティでは制限あり）
    background: `
      linear-gradient(135deg, 
        rgba(30, 27, 75, 0.95) 0%, 
        rgba(55, 48, 163, 0.9) 25%, 
        rgba(99, 102, 241, 0.8) 50%, 
        rgba(55, 48, 163, 0.9) 75%, 
        rgba(30, 27, 75, 0.95) 100%
      )
    `,
    
    // テキストスタイル
    color: '#8b5cf6',
    fontWeight: 700,
    letterSpacing: '1.8px',
    textTransform: 'none' as const,
    fontSize: '11px',
    fontFamily: 'monospace',
    textShadow: '0 0 12px rgba(139, 92, 246, 1)',
    
    // ボーダー
    border: '2px solid rgba(147, 51, 234, 0.4)',
    
    // エフェクト
    backdropFilter: 'blur(15px)',
    boxShadow: `
      0 8px 30px rgba(147, 51, 234, 0.3),
      inset 0 2px 4px rgba(168, 85, 247, 0.2),
      0 0 40px rgba(99, 102, 241, 0.1)
    `,
    
    // トランジション
    transition: 'all 0.4s ease',
  };

  const hoverStyles: React.CSSProperties = {
    transform: 'translateY(-3px) scale(1.03)',
    background: `
      linear-gradient(135deg, 
        rgba(30, 27, 75, 0.98) 0%, 
        rgba(55, 48, 163, 0.93) 25%, 
        rgba(99, 102, 241, 0.85) 50%, 
        rgba(55, 48, 163, 0.93) 75%, 
        rgba(30, 27, 75, 0.98) 100%
      )
    `,
    color: '#c4b5fd',
    textShadow: '0 0 18px rgba(196, 181, 253, 1)',
  };

  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <>
      {/* TSX内でのCSS Keyframes定義 */}
      <style>{`
        @keyframes plasma-spin-inline {
          0% { 
            transform: rotate(0deg);
            opacity: 0.6;
          }
          50% { 
            opacity: 0.9;
          }
          100% { 
            transform: rotate(360deg);
            opacity: 0.6;
          }
        }

        @keyframes pulse-icon-inline {
          0%, 100% { 
            opacity: 0.5;
            transform: scale(1);
          }
          50% { 
            opacity: 1;
            transform: scale(1.2);
          }
        }

        .pattern-nine-inline::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: repeating-conic-gradient(from 0deg at 50% 50%,
            transparent 0deg,
            rgba(147, 51, 234, 0.05) 30deg,
            transparent 60deg,
            rgba(168, 85, 247, 0.05) 90deg,
            transparent 120deg
          );
          animation: plasma-spin-inline 10s linear infinite;
          pointer-events: none;
        }

        .pattern-nine-inline::after {
          content: '▲';
          position: absolute;
          bottom: 15px;
          right: 15px;
          font-size: 10px;
          color: rgba(147, 51, 234, 0.7);
          animation: pulse-icon-inline 2s ease-in-out infinite;
          pointer-events: none;
        }

        .pattern-nine-inline:hover::before {
          animation: plasma-spin-inline 5s linear infinite;
        }

        .pattern-nine-inline:hover::after {
          animation: pulse-icon-inline 1s ease-in-out infinite;
          color: rgba(196, 181, 253, 1);
        }
      `}</style>

      <Button
        variant="outlined"
        onClick={handleClick}
        className="pattern-nine-inline"
        style={isHovered ? { ...buttonStyles, ...hoverStyles } : buttonStyles}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        Pattern 9 (TSX内CSS)
      </Button>
    </>
  );
};

export default ButtonPatternNineInline;