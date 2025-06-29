import React, { useRef, useState } from 'react';
import './ButtonPatternSeventeen.css';

interface ButtonPatternSeventeenProps {
  onClick?: () => void;
}

const ButtonPatternSeventeen: React.FC<ButtonPatternSeventeenProps> = ({ onClick }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    console.log('Pattern 17 ボタンがクリックされました！');
    if (onClick) {
      onClick();
    }
  };

  // カーソル位置による動的角度計算
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    
    // カード中心からのカーソル位置を計算
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // カーソル位置を-1から1の範囲に正規化
    const mouseX = (e.clientX - centerX) / (rect.width / 2);
    const mouseY = (e.clientY - centerY) / (rect.height / 2);
    
    // 角度を計算（最大±25度）
    const rotateY = mouseX * 25;
    const rotateX = -mouseY * 25;
    
    // Z軸の浮上効果
    const translateZ = Math.min(Math.abs(mouseX) + Math.abs(mouseY), 1) * 15;
    
    // 3D変形を適用
    card.style.transform = `translateZ(${10 + translateZ}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    
    // 動的ライティング効果のためのCSS変数を設定
    const mouseXPercent = ((mouseX + 1) / 2) * 100; // 0-100%
    const mouseYPercent = ((mouseY + 1) / 2) * 100; // 0-100%
    card.style.setProperty('--mouse-x', `${mouseXPercent}%`);
    card.style.setProperty('--mouse-y', `${mouseYPercent}%`);
    
    // 極端な角度での視覚効果強化
    const intensity = Math.sqrt(mouseX * mouseX + mouseY * mouseY);
    if (intensity > 0.7) {
      card.style.filter = `brightness(${1 + intensity * 0.2}) contrast(${1 + intensity * 0.1})`;
    } else {
      card.style.filter = 'brightness(1) contrast(1)';
    }
  };

  // マウスリーブ時のリセット
  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    setIsHovered(false);
    
    // より滑らかな復帰のためにトランジション時間を延長
    const card = cardRef.current;
    card.style.transition = 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94), filter 0.6s ease-out';
    
    // 滑らかにニュートラル位置に戻る
    card.style.transform = 'translateZ(0px) rotateX(0deg) rotateY(0deg)';
    card.style.filter = 'brightness(1) contrast(1)';
    card.style.removeProperty('--mouse-x');
    card.style.removeProperty('--mouse-y');
    
    // 復帰完了後、トランジションを高速に戻す（次のインタラクション用）
    setTimeout(() => {
      if (card) {
        card.style.transition = 'transform 0.2s ease-out, filter 0.2s ease-out';
      }
    }, 600);
  };

  // マウスエンター時の処理
  const handleMouseEnter = () => {
    setIsHovered(true);
    
    // インタラクティブな操作用の高速トランジションを設定
    if (cardRef.current) {
      cardRef.current.style.transition = 'transform 0.15s ease-out, filter 0.15s ease-out';
    }
  };

  return (
    <div 
      className="card-3d-container"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      onClick={handleClick}
      tabIndex={0}
      role="button"
      aria-label="3D Hover Button Pattern 17"
    >
      <div 
        ref={cardRef}
        className={`card-3d ${isHovered ? 'animate-tilt' : ''}`}
      >
        <div className="card-3d-title">
          3D Hover
        </div>
      </div>
    </div>
  );
};

export default ButtonPatternSeventeen;