import React from 'react';
import { Box } from '@mui/material';

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

  return (
    <Box
      onClick={handleClick}
      sx={{
        '--clr-shadow__border': '#A8DF8E',
        '--clr-text': '#F6F4EB',
        '--clr-code-line': '#43ff85',
        '--clr-matrix': '#020204',
        '--size': '3rem',
        position: 'relative',
        outline: '1px solid #A8DF8E',
        cursor: 'pointer',
        display: 'inline-block',
        // 元デザインに合わせたサイズ調整
        minWidth: '160px',
        minHeight: '60px',

        // ホバー時にmatrix背景を表示
        '&:hover .matrix': {
          opacity: 1,
        },
      }}
    >
      <Box
        component="button"
        sx={{
          fontWeight: 600,
          fontSize: '1.5rem',
          letterSpacing: '0.2rem',
          color: '#F6F4EB',
          padding: 'calc(3rem / 3) 3rem', // 元CSSの padding: calc(var(--size) / 3) var(--size)
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          textShadow: `
            2px 0px #A8DF8E, 
            0px 2px #A8DF8E,
            -2px 0px #A8DF8E, 
            0px -2px #A8DF8E
          `,
          position: 'relative',
          zIndex: 1,
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        MATRIX
      </Box>
      
      {/* Matrix背景（ホバー時に表示、アニメーション付き） */}
      <Box
        className="matrix"
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: `
            radial-gradient(ellipse at center, 
              rgba(2, 2, 4, 0.95) 0%, 
              rgba(0, 0, 0, 0.98) 60%, 
              rgba(0, 0, 0, 1) 100%
            ),
            linear-gradient(180deg, 
              rgba(67, 255, 133, 0.02) 0%, 
              rgba(2, 2, 4, 1) 100%
            )
          `,
          zIndex: 0,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden',
          transition: 'all 0.5s ease-in-out',
          opacity: 0,
          
          // 背景のパーティクル効果
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: `
              radial-gradient(1px 1px at 20px 30px, rgba(67, 255, 133, 0.1), transparent),
              radial-gradient(1px 1px at 40px 70px, rgba(67, 255, 133, 0.1), transparent),
              radial-gradient(1px 1px at 90px 40px, rgba(67, 255, 133, 0.1), transparent),
              radial-gradient(1px 1px at 130px 80px, rgba(67, 255, 133, 0.1), transparent),
              radial-gradient(1px 1px at 160px 30px, rgba(67, 255, 133, 0.1), transparent)
            `,
            backgroundSize: '200px 100px',
            animation: 'particle-float 6s ease-in-out infinite',
            opacity: 0.3,
          },
          
          // フローティングパーティクルアニメーション
          '@keyframes particle-float': {
            '0%, 100%': {
              transform: 'translateY(0px) translateX(0px)',
              opacity: 0.3,
            },
            '33%': {
              transform: 'translateY(-10px) translateX(5px)',
              opacity: 0.6,
            },
            '66%': {
              transform: 'translateY(-5px) translateX(-3px)',
              opacity: 0.4,
            },
          },
          
          // ホバー時の背景強化
          '&:hover': {
            background: `
              radial-gradient(ellipse at center, 
                rgba(2, 2, 4, 0.9) 0%, 
                rgba(0, 0, 0, 0.95) 60%, 
                rgba(0, 0, 0, 1) 100%
              ),
              linear-gradient(180deg, 
                rgba(67, 255, 133, 0.05) 0%, 
                rgba(2, 2, 4, 1) 100%
              )
            `,
          },
        }}
      >
        {matrixLines.map((line, index) => {
          // ラインごとの個性的な特性
          const lineSpeed = 0.15 + (line.i * 0.02); // 速度にバリエーション
          const lineIntensity = 0.7 + Math.sin(line.i * 0.4) * 0.3; // 輝度の変化
          const lineWidth = Math.max(0.8, 1 + Math.cos(index * 0.6) * 0.4); // 幅の微調整
          
          return (
            <Box
              key={index}
              sx={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column-reverse',
                transition: '0.5s',
                minHeight: '0.6rem',
                minWidth: '0.6rem',
                '--i': line.i,
                
                // より複雑で有機的なアニメーション
                '@keyframes matrix-flow': {
                  '0%': {
                    transform: `translateY(calc(-80% * ${line.i})) scale(${lineWidth})`,
                    filter: `brightness(${lineIntensity * 0.5})`,
                  },
                  '20%': {
                    transform: `translateY(calc(-60% * ${line.i})) scale(${lineWidth * 1.1})`,
                    filter: `brightness(${lineIntensity * 1.2})`,
                  },
                  '50%': {
                    transform: `translateY(calc(-20% * ${line.i})) scale(${lineWidth})`,
                    filter: `brightness(${lineIntensity})`,
                  },
                  '80%': {
                    transform: `translateY(calc(20% * ${line.i})) scale(${lineWidth * 0.9})`,
                    filter: `brightness(${lineIntensity * 0.8})`,
                  },
                  '100%': {
                    transform: `translateY(calc(60% * ${line.i})) scale(${lineWidth * 0.7})`,
                    filter: `brightness(${lineIntensity * 0.3})`,
                  },
                },
                animation: `matrix-flow ${lineSpeed * line.i}s ease-in-out infinite`,
                
                // ラインごとの微細な遅延でより自然な流れ
                animationDelay: `${index * 0.1}s`,
                
                // 3Dエフェクト
                transformStyle: 'preserve-3d',
                perspective: '1000px',
              }}
            >
            {line.chars.map((char, charIndex) => {
              // 文字位置による視覚的バリエーション
              const isHead = charIndex === 0;
              const isFading = charIndex > line.chars.length - 3;
              const randomVariation = Math.sin(charIndex * 0.5 + line.i * 0.3 + index * 0.2);
              const timeOffset = Date.now() * 0.001; // 時間による動的変化
              const pulseIntensity = Math.sin(timeOffset + charIndex * 0.8) * 0.3 + 0.7;
              
              // 文字種による特別エフェクト
              const isNumber = /[0-9]/.test(char);
              const isSpecialChar = /[%@#$&]/.test(char);
              
              return (
                <Box
                  key={charIndex}
                  component="p"
                  sx={{
                    margin: 0,
                    padding: 0,
                    // 動的フォントサイズ：より細かな段階的変化
                    fontSize: isHead 
                      ? `${1.1 + Math.sin(timeOffset * 0.5) * 0.05}rem` 
                      : isNumber 
                        ? `${0.88 + randomVariation * 0.12 + pulseIntensity * 0.03}rem`
                        : isSpecialChar
                          ? `${0.92 + randomVariation * 0.18 + Math.cos(timeOffset + charIndex) * 0.04}rem`
                          : isFading 
                            ? `${0.5 + Math.max(0, Math.sin(timeOffset * 2 + charIndex) * 0.1)}rem`
                            : `${0.72 + randomVariation * 0.13 + pulseIntensity * 0.02}rem`,
                    fontWeight: isHead 
                      ? 800 + Math.floor(Math.sin(timeOffset) * 100)
                      : isNumber 
                        ? 550 + Math.floor(pulseIntensity * 50)
                        : isSpecialChar
                          ? 500 + Math.floor(randomVariation * 100)
                          : 400,
                    
                    // より複雑な色彩システム：明暗のダイナミックな変化
                    color: isHead 
                      ? `hsl(45, 15%, ${85 + Math.sin(timeOffset * 1.2) * 10}%)`
                      : isNumber
                        ? `hsl(${120 + randomVariation * 35 + Math.sin(timeOffset * 0.8) * 15}, 100%, ${65 + pulseIntensity * 25 + Math.cos(timeOffset + charIndex) * 10}%)`
                        : isSpecialChar
                          ? `hsl(${160 + randomVariation * 45 + Math.cos(timeOffset * 1.5) * 20}, 100%, ${75 + pulseIntensity * 20 + Math.sin(timeOffset * 2 + charIndex) * 8}%)`
                          : isFading 
                            ? `hsl(120, 60%, ${15 + Math.max(0, Math.sin(timeOffset * 3 + charIndex * 0.5) * 8)}%)`
                            : `hsl(${140 + randomVariation * 30 + Math.sin(timeOffset + index * 0.3) * 12}, 100%, ${50 + randomVariation * 30 + pulseIntensity * 15}%)`,
                    
                    // 動的透明度：より複雑なパルス効果
                    opacity: isHead 
                      ? 0.95 + Math.sin(timeOffset * 2) * 0.05
                      : isNumber
                        ? Math.max(0.2, (1 - (charIndex * 0.1)) * pulseIntensity + randomVariation * 0.12 + Math.sin(timeOffset * 1.5 + charIndex) * 0.1)
                        : isSpecialChar
                          ? Math.max(0.25, (1 - (charIndex * 0.08)) * pulseIntensity + randomVariation * 0.15 + Math.cos(timeOffset * 1.8 + charIndex) * 0.12)
                          : Math.max(0.1, (1 - (charIndex * 0.15)) * pulseIntensity + randomVariation * 0.08 + Math.sin(timeOffset * 0.8 + charIndex * 0.3) * 0.06),
                    lineHeight: 1,
                    
                    // 多層グロー効果：動的な明度変化付き
                    textShadow: isHead 
                      ? `0 0 ${20 + pulseIntensity * 8}px hsl(45, 15%, 90%), 0 0 ${40 + pulseIntensity * 12}px hsl(45, 15%, 85%), 0 0 ${60 + pulseIntensity * 15}px hsla(45, 15%, 80%, 0.4)` 
                      : isNumber
                        ? `0 0 ${15 - charIndex + pulseIntensity * 5}px hsl(120, 100%, 70%), 0 0 ${25 - charIndex * 2 + pulseIntensity * 8}px hsl(120, 100%, 60%), 0 0 ${12 + pulseIntensity * 4}px hsl(125, 100%, 55%), 0 0 ${35}px hsla(120, 100%, 50%, 0.2)`
                        : isSpecialChar
                          ? `0 0 ${18 - charIndex + pulseIntensity * 6}px hsl(160, 100%, 75%), 0 0 ${30 - charIndex * 2 + pulseIntensity * 10}px hsl(160, 100%, 65%), 0 0 ${15 + pulseIntensity * 5}px hsl(165, 100%, 60%), 0 0 ${40}px hsla(160, 100%, 55%, 0.25)`
                          : isFading
                            ? `0 0 ${3 + Math.sin(timeOffset * 4) * 2}px hsl(120, 60%, 25%)`
                            : `0 0 ${10 - charIndex + pulseIntensity * 3}px hsl(140, 100%, 65%), 0 0 ${18 - charIndex * 2 + pulseIntensity * 6}px hsl(140, 100%, 55%), 0 0 ${8 + pulseIntensity * 2}px hsl(145, 100%, 50%)`,
                    
                    fontFamily: 'monospace',
                    textAlign: 'center',
                    
                    // より複雑な3D変形：時間による動的変化
                    transform: `
                      translateX(${randomVariation * 2 + Math.sin(timeOffset * 0.6 + charIndex * 0.4) * 1.5}px) 
                      translateY(${Math.cos(timeOffset * 0.8 + charIndex * 0.3) * 0.8}px)
                      translateZ(${isHead ? '12px' : charIndex * -3 + Math.sin(timeOffset + charIndex) * 2 + 'px'})
                      rotateX(${randomVariation * 6 + Math.sin(timeOffset * 1.2 + charIndex) * 3}deg)
                      rotateY(${Math.cos(timeOffset * 0.9 + charIndex * 0.5) * 2}deg)
                      scale(${1 + (isHead ? 0.12 : 0) + randomVariation * 0.08 + Math.sin(timeOffset * 1.5 + charIndex) * 0.03})
                    `,
                    
                    // 動的トランジション
                    transition: `all ${0.2 + randomVariation * 0.1}s ease-in-out`,
                    
                    // ホバー時の特別エフェクト
                    '&:hover': {
                      transform: `
                        translateX(${randomVariation * 2}px) 
                        translateZ(${isHead ? '15px' : '5px'})
                        scale(${1.1 + randomVariation * 0.1})
                      `,
                      textShadow: isHead 
                        ? '0 0 30px #F6F4EB, 0 0 50px #F6F4EB, 0 0 80px rgba(246, 244, 235, 0.5)' 
                        : `0 0 ${15}px #43ff85, 0 0 ${25}px #43ff85, 0 0 ${35}px #00ff41`,
                    },
                    
                    // より複雑なアニメーション効果
                    '@keyframes char-pulse': {
                      '0%': { 
                        filter: `brightness(${0.9 + randomVariation * 0.2}) saturate(1) hue-rotate(0deg)`,
                        transform: 'scale(1)',
                      },
                      '25%': { 
                        filter: `brightness(${1.3 + randomVariation * 0.4}) saturate(1.2) hue-rotate(${randomVariation * 15}deg)`,
                        transform: `scale(${1.02 + randomVariation * 0.03})`,
                      },
                      '50%': { 
                        filter: `brightness(${1.1 + randomVariation * 0.3}) saturate(0.9) hue-rotate(${randomVariation * -10}deg)`,
                        transform: 'scale(1)',
                      },
                      '75%': { 
                        filter: `brightness(${1.4 + randomVariation * 0.5}) saturate(1.1) hue-rotate(${randomVariation * 20}deg)`,
                        transform: `scale(${0.98 + randomVariation * 0.02})`,
                      },
                      '100%': { 
                        filter: `brightness(${0.9 + randomVariation * 0.2}) saturate(1) hue-rotate(0deg)`,
                        transform: 'scale(1)',
                      },
                    },
                    '@keyframes char-special-glow': {
                      '0%, 100%': { 
                        filter: `brightness(1.2) saturate(1.1) drop-shadow(0 0 ${3 + randomVariation * 2}px currentColor)`,
                      },
                      '50%': { 
                        filter: `brightness(1.6) saturate(1.3) drop-shadow(0 0 ${6 + randomVariation * 4}px currentColor)`,
                      },
                    },
                    animation: isHead 
                      ? `char-pulse ${1.2 + randomVariation * 0.8}s ease-in-out infinite`
                      : isNumber 
                        ? `char-pulse ${1.8 + randomVariation * 0.6}s ease-in-out infinite`
                        : isSpecialChar
                          ? `char-special-glow ${1.5 + randomVariation * 0.4}s ease-in-out infinite`
                          : 'none',
                  }}
                >
                  {char}
                </Box>
              );
            })}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default ButtonPatternFourteen;