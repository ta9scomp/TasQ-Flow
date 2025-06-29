import React, { useRef, useState } from 'react';
import './ButtonPatternEighteen.css';

interface ButtonPatternEighteenProps {
  onClick?: () => void;
}

const ButtonPatternEighteen: React.FC<ButtonPatternEighteenProps> = ({ onClick }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    console.log('Pattern 18 ボタンがクリックされました！');
    if (onClick) {
      onClick();
    }
  };

  // カーソル位置による動的角度計算 + 浮遊テキスト制御
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const card = cardRef.current;
    const titleElement = card.querySelector('.card-3d-square-title') as HTMLElement;
    const rect = card.getBoundingClientRect();
    
    // カード中心からのカーソル位置を計算
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // カーソル位置を-1から1の範囲に正規化
    const mouseX = (e.clientX - centerX) / (rect.width / 2);
    const mouseY = (e.clientY - centerY) / (rect.height / 2);
    
    // 角度を計算（正方形なので少し控えめに±20度）
    const rotateY = mouseX * 20;
    const rotateX = -mouseY * 20;
    
    // Z軸の浮上効果
    const translateZ = Math.min(Math.abs(mouseX) + Math.abs(mouseY), 1) * 12;
    
    // 3D変形を適用
    card.style.transform = `translateZ(${8 + translateZ}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    
    // 🌟 テキストの動的浮遊効果（カーソルから逃げる方向）
    if (titleElement) {
      // カーソルから逃げる方向を計算（控えめな動き）
      const escapeX = -mouseX * 8; // X方向の逃避距離（最大8px - 大幅削減）
      const escapeY = -mouseY * 8; // Y方向の逃避距離（最大8px - 大幅削減）
      
      // Z軸の浮上距離を計算（控えめに調整）
      const distance = Math.sqrt(mouseX * mouseX + mouseY * mouseY);
      const escapeZ = Math.min(distance * 20, 15); // 最大15px浮上（大幅削減）
      
      // ボタンからはみ出ないよう制限をかける
      const clampedEscapeX = Math.max(-12, Math.min(12, escapeX));
      const clampedEscapeY = Math.max(-12, Math.min(12, escapeY));
      
      // テキストに立体的な逃避変形を適用
      titleElement.style.transform = `
        translateX(${clampedEscapeX}px) 
        translateY(${clampedEscapeY}px) 
        translateZ(${escapeZ}px)
        rotateX(${-mouseY * 3}deg)
        rotateY(${-mouseX * 3}deg)
      `;
      
      // 距離に応じた視覚効果強化
      const intensity = Math.min(distance, 1);
      titleElement.style.filter = `brightness(${1 + intensity * 0.3}) drop-shadow(0 ${escapeZ * 0.3}px ${escapeZ * 0.5}px rgba(0,0,0,0.4))`;
    }
    
    // 動的ライティング効果
    const mouseXPercent = ((mouseX + 1) / 2) * 100;
    const mouseYPercent = ((mouseY + 1) / 2) * 100;
    card.style.setProperty('--mouse-x', `${mouseXPercent}%`);
    card.style.setProperty('--mouse-y', `${mouseYPercent}%`);
    
    // 極端な角度での視覚効果強化
    const intensity = Math.sqrt(mouseX * mouseX + mouseY * mouseY);
    if (intensity > 0.6) {
      card.style.filter = `brightness(${1 + intensity * 0.15}) contrast(${1 + intensity * 0.08})`;
    } else {
      card.style.filter = 'brightness(1) contrast(1)';
    }
  };

  // マウスリーブ時のリセット（パターン17と同じ滑らかさ）
  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    setIsHovered(false);
    
    const card = cardRef.current;
    const titleElement = card.querySelector('.card-3d-square-title') as HTMLElement;
    
    // カードとテキストの両方に滑らかな復帰アニメーションを設定
    card.style.transition = 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94), filter 0.6s ease-out';
    if (titleElement) {
      titleElement.style.transition = 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94), filter 0.6s ease-out';
    }
    
    // カードを元の位置に戻す
    card.style.transform = 'translateZ(0px) rotateX(0deg) rotateY(0deg)';
    card.style.filter = 'brightness(1) contrast(1)';
    card.style.removeProperty('--mouse-x');
    card.style.removeProperty('--mouse-y');
    
    // テキストも元の位置に戻す
    if (titleElement) {
      titleElement.style.transform = 'translateX(0px) translateY(0px) translateZ(0px) rotateX(0deg) rotateY(0deg)';
      titleElement.style.filter = 'brightness(1)';
    }
    
    // 復帰完了後、トランジションを高速に戻す
    setTimeout(() => {
      if (card) {
        card.style.transition = 'transform 0.2s ease-out, filter 0.2s ease-out';
      }
      if (titleElement) {
        titleElement.style.transition = 'transform 0.15s ease-out, filter 0.15s ease-out';
      }
    }, 600);
  };

  // マウスエンター時の処理
  const handleMouseEnter = () => {
    setIsHovered(true);
    
    if (cardRef.current) {
      const card = cardRef.current;
      const titleElement = card.querySelector('.card-3d-square-title') as HTMLElement;
      
      // インタラクティブな操作用の高速トランジションを設定
      card.style.transition = 'transform 0.15s ease-out, filter 0.15s ease-out';
      if (titleElement) {
        titleElement.style.transition = 'transform 0.15s ease-out, filter 0.15s ease-out';
      }
    }
  };

  return (
    <div 
      className="card-3d-square-container"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      onClick={handleClick}
      tabIndex={0}
      role="button"
      aria-label="3D Square Button with Floating Text Pattern 18"
    >
      <div 
        ref={cardRef}
        className={`card-3d-square ${isHovered ? 'animate-tilt' : ''}`}
      >
        {/* 動的ライティング用オーバーレイ */}
        <div className="lighting-overlay"></div>
        
        {/* 浮遊テキスト */}
        <div className="card-3d-square-title">
          Float Text
        </div>
      </div>
    </div>
  );
};

export default ButtonPatternEighteen;