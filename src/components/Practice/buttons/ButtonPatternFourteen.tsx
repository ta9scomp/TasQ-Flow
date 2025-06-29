import React from 'react';
import './ButtonPatternFourteen.css';

interface ButtonPatternFourteenProps {
  onClick?: () => void;
}

const ButtonPatternFourteen: React.FC<ButtonPatternFourteenProps> = ({ onClick }) => {
  const handleClick = () => {
    console.log('Pattern 14 ボタンがクリックされました！');
    if (onClick) {
      onClick();
    }
  };

  // HTMLからの正確なMatrix codeラインデータ
  const matrixLines = [
    { i: 6, chars: ['z', '6', '0', 'z'] },
    { i: 8, chars: ['6', '9', 'p'] },
    { i: 5, chars: ['u', '3', 'g'] },
    { i: 12, chars: ['a', 't', '7', '2', 'g', 'h', '0', 'k'] },
    { i: 9, chars: ['6', '3', '0'] },
    { i: 6, chars: ['7', 's', 'b', 'q'] },
    { i: 8, chars: ['m', '2', '5', '4', 'l', '1'] },
    { i: 12, chars: ['9', '1', 's', '2', 't', '7', '4', 'h', '0'] },
    { i: 16, chars: ['a', 'b', 'c', 'd', 'e'] },
    { i: 9, chars: ['f', 'g', 'h', 'i', 'j'] },
    { i: 6, chars: ['k', 'l', 'm', 'n'] },
    { i: 19, chars: ['u', 'v', 'w', 'v', '2', '3'] },
    { i: 7, chars: ['p', 'q', 'r', 's', 't'] },
    { i: 12, chars: ['1', '2', '6', 'x', '5', 'h'] },
    { i: 9, chars: ['6', '7', 'f', 'a', '6', '1'] },
    { i: 17, chars: ['j', 'f', '0', 'x', '6', '0'] },
    { i: 10, chars: ['0', 'k', '%', 'f', '6', '%'] },
  ];

  // 動的にクラス名を決定する関数
  const getCharClass = (char: string, charIndex: number, totalChars: number) => {
    const classes = ['matrix-char'];
    
    // 位置による分類
    if (charIndex === 0) classes.push('head');
    else if (charIndex > totalChars - 3) classes.push('fading');
    
    // 文字種による分類
    if (/[0-9]/.test(char)) classes.push('number');
    else if (/[%@#$&]/.test(char)) classes.push('special');
    
    // ランダムなサイズバリエーション
    const sizeClasses = ['size-xs', 'size-sm', 'size-md', 'size-lg', 'size-xl'];
    const randomSize = sizeClasses[Math.floor(Math.random() * sizeClasses.length)];
    classes.push(randomSize);
    
    // ランダムな明度バリエーション
    const brightClasses = ['bright-low', 'bright-med', 'bright-high', 'bright-max'];
    const randomBright = brightClasses[Math.floor(Math.random() * brightClasses.length)];
    classes.push(randomBright);
    
    // ランダムなモーションバリエーション
    const motionClasses = ['motion-slow', 'motion-normal', 'motion-fast', 'motion-rapid'];
    const randomMotion = motionClasses[Math.floor(Math.random() * motionClasses.length)];
    classes.push(randomMotion);
    
    return classes.join(' ');
  };

  return (
    <div className="matrix-button-container" onClick={handleClick}>
      <button className="matrix-button">
        MATRIX
      </button>
      
      <div className="matrix-background">
        {matrixLines.map((line, index) => (
          <div
            key={index}
            className="matrix-line"
            style={{
              animationDuration: `${3 + line.i * 0.1}s`,
              animationDelay: `${index * 0.1}s`,
            }}
          >
            {line.chars.map((char, charIndex) => (
              <p
                key={charIndex}
                className={getCharClass(char, charIndex, line.chars.length)}
              >
                {char}
              </p>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ButtonPatternFourteen;