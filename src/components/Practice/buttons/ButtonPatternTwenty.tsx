import React, { useRef, useState } from 'react';
import './ButtonPatternTwenty.css';

interface ButtonPatternTwentyProps {
  onClick?: () => void;
}

const ButtonPatternTwenty: React.FC<ButtonPatternTwentyProps> = ({ onClick }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    console.log('Pattern 20 ボタンがクリックされました！');
    if (onClick) {
      onClick();
    }
  };

  // カーソル位置による動的角度計算 + 浮遊テキスト制御
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const card = cardRef.current;
    const titleElement = card.querySelector('.card-3d-inset-title') as HTMLElement;
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
      // カーソルから逃げる方向を計算（正規化されたベクトルの逆方向）
      const escapeX = -mouseX * 25; // X方向の逃避距離（最大25px）
      const escapeY = -mouseY * 25; // Y方向の逃避距離（最大25px）
      
      // Z軸の浮上距離を計算（カーソルが近いほど高く浮上）
      const distance = Math.sqrt(mouseX * mouseX + mouseY * mouseY);
      const escapeZ = Math.min(distance * 60, 50); // 最大50px浮上
      
      // ボタンからはみ出ないよう制限をかける
      const clampedEscapeX = Math.max(-35, Math.min(35, escapeX));
      const clampedEscapeY = Math.max(-35, Math.min(35, escapeY));
      
      // テキストを奥から浮かび上がらせる変形を適用（逆方向の効果）
      const depthZ = -30 + (distance * 50); // -30pxから+20pxまで浮上
      titleElement.style.transform = `
        translateX(${clampedEscapeX * 0.3}px) 
        translateY(${clampedEscapeY * 0.3}px) 
        translateZ(${depthZ}px)
        rotateX(${-mouseY * 4}deg)
        rotateY(${-mouseX * 4}deg)
      `;
      
      // 奥から浮上する際の視覚効果強化
      const intensity = Math.min(distance, 1);
      const brightness = 0.7 + (intensity * 0.5); // 0.7から1.2まで明るくなる
      titleElement.style.filter = `brightness(${brightness}) contrast(${1.2 + intensity * 0.3}) drop-shadow(0 ${Math.abs(depthZ) * 0.1}px ${Math.abs(depthZ) * 0.2}px rgba(0,0,0,0.6))`;
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
    const titleElement = card.querySelector('.card-3d-inset-title') as HTMLElement;
    
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
    
    // テキストを奥の初期位置に戻す
    if (titleElement) {
      titleElement.style.transform = 'translateX(0px) translateY(0px) translateZ(-30px) rotateX(0deg) rotateY(0deg)';
      titleElement.style.filter = 'brightness(0.7) contrast(1.2)';
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
      const titleElement = card.querySelector('.card-3d-inset-title') as HTMLElement;
      
      // インタラクティブな操作用の高速トランジションを設定
      card.style.transition = 'transform 0.15s ease-out, filter 0.15s ease-out';
      if (titleElement) {
        titleElement.style.transition = 'transform 0.15s ease-out, filter 0.15s ease-out';
      }
    }
  };

  return (
    <div 
      className="card-3d-inset-container"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      onClick={handleClick}
      tabIndex={0}
      role="button"
      aria-label="3D Deep Inset Button with Embedded Text Pattern 20"
    >
      <div 
        ref={cardRef}
        className={`card-3d-inset ${isHovered ? 'animate-tilt' : ''}`}
      >
        {/* 動的ライティング用オーバーレイ */}
        <div className="lighting-overlay"></div>
        
        {/* 浮遊テキスト */}
        <div className="card-3d-inset-title">
          Deep Text
        </div>
      </div>
    </div>
  );
};

export default ButtonPatternTwenty;