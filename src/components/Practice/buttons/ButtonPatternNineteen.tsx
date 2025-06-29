import React, { useRef, useState } from 'react';
import './ButtonPatternNineteen.css';

interface ButtonPatternNineteenProps {
  onClick?: () => void;
}

const ButtonPatternNineteen: React.FC<ButtonPatternNineteenProps> = ({ onClick }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    console.log('Pattern 19 ボタンがクリックされました！');
    if (onClick) {
      onClick();
    }
  };

  // カーソル位置による動的角度計算 + 磁力的テキスト引き寄せ制御
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const card = cardRef.current;
    const titleElement = card.querySelector('.card-3d-magnet-title') as HTMLElement;
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
    
    // 🧲 テキストの磁力的引き寄せ効果（カーソルに向かって移動）
    if (titleElement) {
      // カーソルに引き寄せられる方向を計算（パターン20程度に抑制）
      const attractX = mouseX * 5; // X方向の引き寄せ距離（最大5px - さらに削減）
      const attractY = mouseY * 5; // Y方向の引き寄せ距離（最大5px - さらに削減）
      
      // Z軸の浮上距離を計算（さらに控えめに）
      const distance = Math.sqrt(mouseX * mouseX + mouseY * mouseY);
      const attractZ = Math.min(distance * 15, 20); // 最大20px浮上（さらに削減）
      
      // ボタンからはみ出ないよう制限をかける（最小限の範囲）
      const clampedAttractX = Math.max(-8, Math.min(8, attractX));
      const clampedAttractY = Math.max(-8, Math.min(8, attractY));
      
      // テキスト全体に立体的な変形を適用（角度をより強調）
      titleElement.style.transform = `
        translateX(${clampedAttractX}px) 
        translateY(${clampedAttractY}px) 
        translateZ(${attractZ}px)
        rotateX(${mouseY * 4}deg)
        rotateY(${mouseX * 4}deg)
      `;
      
      // 🎯 各文字のサイズを角度と距離に応じて動的調整（エミッシブ効果なし、軽量化）
      const magneticChars = titleElement.querySelectorAll('.magnetic-char');
      magneticChars.forEach((charElement, charIndex) => {
        const element = charElement as HTMLElement;
        
        // 文字の基本情報を取得
        const totalChars = magneticChars.length;
        const charPosition = (charIndex - totalChars / 2) / totalChars; // -0.5 to 0.5
        const char = element.textContent || '';
        const charSeed = char.charCodeAt(0) + charIndex;
        
        // 基本浮遊状態（全文字統一サイズ）
        const baseScale = 1.0; // 全文字同じサイズ
        const baseFloatZ = 8 + (charSeed % 3) * 2; // 8-12px（Z軸のみ軽微な差）
        
        // 🎯 カーソル位置に基づく方向的スケール変化
        // 文字の相対位置：-1(左端) から +1(右端)
        const charRelativePosition = (charIndex - totalChars / 2) / (totalChars / 2);
        
        // カーソルX位置との関係性を計算（逆の効果）
        // カーソルが右にあるとき(mouseX > 0)、右側の文字(charRelativePosition > 0)を小さく
        // カーソルが左にあるとき(mouseX < 0)、左側の文字(charRelativePosition < 0)を小さく
        const positionAlignment = -mouseX * charRelativePosition; // 符号を反転
        
        // Y軸についても同様の効果（上下の位置関係）
        const verticalAlignment = -mouseY * charRelativePosition * 0.3; // Y軸も角度に応じて
        
        // スケール変化の計算（角度に応じた遠近効果 - 控えめに）
        // positionAlignmentが正の値：カーソル反対側の文字 → 大きく（遠く見える）
        // positionAlignmentが負の値：カーソル方向の文字 → 小さく（近く見える）
        const scaleEffect = positionAlignment * 0.25 + verticalAlignment; // -0.25 から +0.25 の範囲（半分に削減）
        
        // 最終スケール計算
        const finalScale = Math.max(0.8, Math.min(1.2, baseScale + scaleEffect)); // 0.8-1.2の範囲（より控えめに）
        
        // Z軸の動的変化（シンプルに）
        const dynamicZ = baseFloatZ + Math.abs(scaleEffect) * 20;
        
        // 常に変化を適用（方向的な変化を明確に表示）
        element.style.transform = `scale(${finalScale}) translateZ(${dynamicZ}px)`;
      });
    }
    
    // 動的ライティング効果（磁力場のシミュレーション）
    const mouseXPercent = ((mouseX + 1) / 2) * 100;
    const mouseYPercent = ((mouseY + 1) / 2) * 100;
    card.style.setProperty('--mouse-x', `${mouseXPercent}%`);
    card.style.setProperty('--mouse-y', `${mouseYPercent}%`);
    
    // 軽量化：エミッシブフィルター効果を削除してパフォーマンス向上
    // const intensity = Math.sqrt(mouseX * mouseX + mouseY * mouseY);
    // フィルター効果は削除（軽量化のため）
  };

  // マウスリーブ時のリセット（パターン18と同じ滑らかさ）
  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    setIsHovered(false);
    
    const card = cardRef.current;
    const titleElement = card.querySelector('.card-3d-magnet-title') as HTMLElement;
    
    // カードとテキストの両方に滑らかな復帰アニメーションを設定（軽量化）
    card.style.transition = 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    if (titleElement) {
      titleElement.style.transition = 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    }
    
    // カードを元の位置に戻す（軽量化：フィルター削除）
    card.style.transform = 'translateZ(0px) rotateX(0deg) rotateY(0deg)';
    card.style.removeProperty('--mouse-x');
    card.style.removeProperty('--mouse-y');
    
    // テキストも元の位置に戻す（エミッシブ効果なし）
    if (titleElement) {
      titleElement.style.transform = 'translateX(0px) translateY(0px) translateZ(0px) rotateX(0deg) rotateY(0deg)';
      
      // 各文字を基本浮遊状態に戻す
      const magneticChars = titleElement.querySelectorAll('.magnetic-char');
      magneticChars.forEach((charElement, charIndex) => {
        const element = charElement as HTMLElement;
        const char = element.textContent || '';
        const charSeed = char.charCodeAt(0) + charIndex;
        
        // 基本浮遊状態を復元
        const baseScale = 1.0; // 全文字同じサイズに復元
        const baseFloatZ = 8 + (charSeed % 3) * 2;
        
        element.style.transform = `scale(${baseScale}) translateZ(${baseFloatZ}px)`;
      });
    }
    
    // 復帰完了後、トランジションを高速に戻す
    setTimeout(() => {
      if (card) {
        card.style.transition = 'transform 0.2s ease-out';
      }
      if (titleElement) {
        titleElement.style.transition = 'transform 0.1s ease-out';
      }
    }, 600);
  };

  // マウスエンター時の処理
  const handleMouseEnter = () => {
    setIsHovered(true);
    
    if (cardRef.current) {
      const card = cardRef.current;
      const titleElement = card.querySelector('.card-3d-magnet-title') as HTMLElement;
      
      // インタラクティブな操作用の高速トランジションを設定（軽量化）
      card.style.transition = 'transform 0.15s ease-out';
      if (titleElement) {
        titleElement.style.transition = 'transform 0.1s ease-out';
      }
    }
  };

  return (
    <div 
      className="card-3d-magnet-container"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      onClick={handleClick}
      tabIndex={0}
      role="button"
      aria-label="3D Magnetic Button with Cursor-Following Text Pattern 19"
    >
      <div 
        ref={cardRef}
        className={`card-3d-magnet ${isHovered ? 'animate-tilt' : ''}`}
      >
        {/* 磁力ライティング用オーバーレイ */}
        <div className="magnetic-overlay"></div>
        
        {/* 磁力場エフェクト */}
        <div className="magnetic-field"></div>
        
        {/* 磁力的に引き寄せられるテキスト（文字別サイズ制御） */}
        <div className="card-3d-magnet-title">
          {'Follow Me'.split('').map((char, index) => {
            // 各文字の初期浮遊状態を設定（サイズは統一、Z軸のみ軽微な差）
            const charSeed = char.charCodeAt(0) + index;
            const baseScale = 1.0; // 全文字同じサイズ
            const baseFloatZ = 8 + (charSeed % 3) * 2; // 8-12pxの範囲（軽微な差）
            
            return (
              <span 
                key={index} 
                className="magnetic-char"
                data-char-index={index}
                style={{ 
                  display: char === ' ' ? 'inline' : 'inline-block',
                  transform: `scale(${baseScale}) translateZ(${baseFloatZ}px)`,
                  transition: 'transform 0.15s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                }}
              >
                {char === ' ' ? '\u00A0' : char}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ButtonPatternNineteen;