import React from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Chip,
  Divider,
  IconButton,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Schedule as ScheduleIcon,
  Add as AddIcon,
} from '@mui/icons-material';

interface LearningGuideViewerProps {
  guideId: string;
  title: string;
  difficulty: number;
  estimatedTime: string;
  onBack: () => void;
}

export const LearningGuideViewer: React.FC<LearningGuideViewerProps> = ({
  guideId,
  title,
  difficulty,
  estimatedTime,
  onBack,
}) => {
  const getDifficultyColor = (difficulty: number) => {
    switch (difficulty) {
      case 1: return '#4CAF50';
      case 2: return '#8BC34A';
      case 3: return '#FF9800';
      case 4: return '#FF5722';
      case 5: return '#F44336';
      default: return '#9E9E9E';
    }
  };

  const getDifficultyText = (difficulty: number) => {
    const stars = '⭐'.repeat(difficulty) + '☆'.repeat(5 - difficulty);
    const levels = ['', '入門', '初級', '中級', '上級', '専門'];
    return `${stars} (${levels[difficulty]})`;
  };

  const renderGuideContent = () => {
    switch (guideId) {
      case 'react-basics':
        return (
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3, color: '#1976d2' }}>
              🚀 React基礎：WebアプリケーションをLEGOブロックのように組み立てよう！
            </Typography>

            <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
              <strong>「Reactって何？」「なんで人気なの？」</strong><br/>
              そんな疑問をお持ちの方、ご安心ください！このガイドでは、<strong>LEGOブロック</strong>でお家を建てるように、
              Webアプリケーションを小さな「コンポーネント」という部品で組み立てていく方法を学びます。<br/><br/>
              
              Reactをマスターすれば、Instagram、Facebook、Netflix...多くの有名サイトと同じ技術を使えるようになります！
            </Typography>

            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#1976d2' }}>
              💡 Reactって何がすごいの？
            </Typography>
            <Paper elevation={1} sx={{ p: 3, mb: 3, backgroundColor: '#e3f2fd' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#1976d2', minWidth: '30px' }}>🧩</Typography>
                  <Typography variant="body2"><strong>再利用できる部品</strong>：一度作ったボタンを色んな場所で使いまわせる</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#1976d2', minWidth: '30px' }}>⚡</Typography>
                  <Typography variant="body2"><strong>高速な画面更新</strong>：必要な部分だけをサッと更新、無駄がない</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#1976d2', minWidth: '30px' }}>👥</Typography>
                  <Typography variant="body2"><strong>みんな使ってる</strong>：世界中の開発者が使っているから、情報がたくさん</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#1976d2', minWidth: '30px' }}>🔄</Typography>
                  <Typography variant="body2"><strong>簡単な状態管理</strong>：ボタンを押したら何かが変わる、そういう仕組みが簡単に作れる</Typography>
                </Box>
              </Box>
            </Paper>

            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#1976d2' }}>
              🎯 この学習で身につくスキル
            </Typography>
            
            <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.8 }}>
              このガイドを最後まで読むと、<strong>「あ、これならできそう！」</strong>と思えるようになります。<br/>
              具体的には、こんなことができるようになります：
            </Typography>
            
            <Paper elevation={1} sx={{ p: 3, mb: 3, backgroundColor: '#f3e5f5' }}>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#7b1fa2', minWidth: '30px' }}>🏗️</Typography>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#7b1fa2', mb: 0.5 }}>LEGOブロック作り</Typography>
                    <Typography variant="body2" sx={{ color: '#666' }}>再利用できるコンポーネントを作成</Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#7b1fa2', minWidth: '30px' }}>📝</Typography>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#7b1fa2', mb: 0.5 }}>JSX記法</Typography>
                    <Typography variant="body2" sx={{ color: '#666' }}>HTMLとJavaScriptを組み合わせた書き方</Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#7b1fa2', minWidth: '30px' }}>🔄</Typography>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#7b1fa2', mb: 0.5 }}>状態管理</Typography>
                    <Typography variant="body2" sx={{ color: '#666' }}>ボタンを押したら画面が変わる仕組み</Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#7b1fa2', minWidth: '30px' }}>📦</Typography>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#7b1fa2', mb: 0.5 }}>データの受け渡し</Typography>
                    <Typography variant="body2" sx={{ color: '#666' }}>コンポーネント同士で情報を共有</Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#7b1fa2', minWidth: '30px' }}>🖱️</Typography>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#7b1fa2', mb: 0.5 }}>イベント処理</Typography>
                    <Typography variant="body2" sx={{ color: '#666' }}>クリック、入力などのユーザー操作</Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#7b1fa2', minWidth: '30px' }}>🎨</Typography>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#7b1fa2', mb: 0.5 }}>動的な画面</Typography>
                    <Typography variant="body2" sx={{ color: '#666' }}>リアルタイムで変化するUI作成</Typography>
                  </Box>
                </Box>
              </Box>
            </Paper>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#1976d2' }}>
              🏗️ Step 1: 最初のLEGOブロック（コンポーネント）を作ろう
            </Typography>
            
            <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.8 }}>
              まずは<strong>「コンポーネント」</strong>という概念を理解しましょう！<br/>
              コンポーネントは、LEGOブロックのような再利用できる部品のことです。一度作れば、何度でも使いまわせます。<br/><br/>
              
              下のコードは、<strong>「Hello, React!」と表示するだけのシンプルなコンポーネント</strong>です。<br/>
              でも、このシンプルなブロックが、大きなWebアプリケーションの土台になるんです！
            </Typography>
            <Paper elevation={1} sx={{ 
              p: 3, 
              mb: 3, 
              backgroundColor: '#1e1e1e',
              borderRadius: 2,
              border: '1px solid #333'
            }}>
              <pre style={{ 
                margin: 0, 
                fontFamily: '"Fira Code", "SF Mono", Monaco, monospace',
                fontSize: '14px',
                lineHeight: '1.5',
                color: '#d4d4d4',
                overflow: 'auto'
              }}>
                <code>
                  <span style={{ color: '#6a9955' }}>// 関数コンポーネントの基本形</span><br/>
                  <span style={{ color: '#c586c0' }}>import</span> <span style={{ color: '#9cdcfe' }}>React</span> <span style={{ color: '#c586c0' }}>from</span> <span style={{ color: '#ce9178' }}>'react'</span>;<br/>
                  <br/>
                  <span style={{ color: '#c586c0' }}>const</span> <span style={{ color: '#4fc1ff' }}>MyComponent</span>: <span style={{ color: '#4fc1ff' }}>React.FC</span> = () <span style={{ color: '#c586c0' }}>=&gt;</span> {'{'}<br/>
                  &nbsp;&nbsp;<span style={{ color: '#c586c0' }}>return</span> (<br/>
                  &nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: '#808080' }}>&lt;</span><span style={{ color: '#4ec9b0' }}>div</span><span style={{ color: '#808080' }}>&gt;</span><br/>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: '#808080' }}>&lt;</span><span style={{ color: '#4ec9b0' }}>h1</span><span style={{ color: '#808080' }}>&gt;</span>Hello, React!<span style={{ color: '#808080' }}>&lt;/</span><span style={{ color: '#4ec9b0' }}>h1</span><span style={{ color: '#808080' }}>&gt;</span><br/>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: '#808080' }}>&lt;</span><span style={{ color: '#4ec9b0' }}>p</span><span style={{ color: '#808080' }}>&gt;</span>これは私の最初のReactコンポーネントです。<span style={{ color: '#808080' }}>&lt;/</span><span style={{ color: '#4ec9b0' }}>p</span><span style={{ color: '#808080' }}>&gt;</span><br/>
                  &nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: '#808080' }}>&lt;/</span><span style={{ color: '#4ec9b0' }}>div</span><span style={{ color: '#808080' }}>&gt;</span><br/>
                  &nbsp;&nbsp;);<br/>
                  {'}'};<br/>
                  <br/>
                  <span style={{ color: '#c586c0' }}>export</span> <span style={{ color: '#c586c0' }}>default</span> <span style={{ color: '#4fc1ff' }}>MyComponent</span>;
                </code>
              </pre>
            </Paper>

            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#1976d2' }}>
              🔄 Step 2: 魔法の力「useState」で画面を動かそう
            </Typography>
            
            <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.8 }}>
              さて、ここからが<strong>Reactの真骨頂</strong>です！<br/>
              <code>useState</code>は、<strong>「ページを再読み込みせずに、画面の一部だけを変える」</strong>魔法のような機能です。<br/><br/>
              
              例えば、ボタンを押すとカウンターが1ずつ増える。そんな<strong>「反応する」</strong>Webページが作れます。<br/>
              （だから「React」って名前なんですね！）
            </Typography>
            
            <Paper elevation={1} sx={{ p: 2, mb: 2, backgroundColor: '#fff3e0' }}>
              <Typography variant="body2" sx={{ fontStyle: 'italic', color: '#f57c00' }}>
                💡 <strong>ポイント：</strong>従来のWebページでは、何かが変わるたびにページ全体を再読み込みする必要がありました。
                Reactなら、変わった部分だけをパパッと更新できます！
              </Typography>
            </Paper>
            <Paper elevation={1} sx={{ 
              p: 3, 
              mb: 3, 
              backgroundColor: '#1e1e1e',
              borderRadius: 2,
              border: '1px solid #333'
            }}>
              <pre style={{ 
                margin: 0, 
                fontFamily: '"Fira Code", "SF Mono", Monaco, monospace',
                fontSize: '14px',
                lineHeight: '1.5',
                color: '#d4d4d4',
                overflow: 'auto'
              }}>
                <code>
                  <span style={{ color: '#c586c0' }}>import</span> <span style={{ color: '#9cdcfe' }}>React</span>, {'{'} <span style={{ color: '#9cdcfe' }}>useState</span> {'}'} <span style={{ color: '#c586c0' }}>from</span> <span style={{ color: '#ce9178' }}>'react'</span>;<br/>
                  <br/>
                  <span style={{ color: '#c586c0' }}>const</span> <span style={{ color: '#4fc1ff' }}>Counter</span>: <span style={{ color: '#4fc1ff' }}>React.FC</span> = () <span style={{ color: '#c586c0' }}>=&gt;</span> {'{'}<br/>
                  &nbsp;&nbsp;<span style={{ color: '#c586c0' }}>const</span> [<span style={{ color: '#9cdcfe' }}>count</span>, <span style={{ color: '#9cdcfe' }}>setCount</span>] = <span style={{ color: '#dcdcaa' }}>useState</span>(<span style={{ color: '#b5cea8' }}>0</span>);<br/>
                  <br/>
                  &nbsp;&nbsp;<span style={{ color: '#c586c0' }}>const</span> <span style={{ color: '#dcdcaa' }}>handleIncrement</span> = () <span style={{ color: '#c586c0' }}>=&gt;</span> {'{'}<br/>
                  &nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: '#dcdcaa' }}>setCount</span>(<span style={{ color: '#9cdcfe' }}>count</span> + <span style={{ color: '#b5cea8' }}>1</span>);<br/>
                  &nbsp;&nbsp;{'}'};<br/>
                  <br/>
                  &nbsp;&nbsp;<span style={{ color: '#c586c0' }}>return</span> (<br/>
                  &nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: '#808080' }}>&lt;</span><span style={{ color: '#4ec9b0' }}>div</span><span style={{ color: '#808080' }}>&gt;</span><br/>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: '#808080' }}>&lt;</span><span style={{ color: '#4ec9b0' }}>p</span><span style={{ color: '#808080' }}>&gt;</span>現在のカウント: {'{'}<span style={{ color: '#9cdcfe' }}>count</span>{'}'}<span style={{ color: '#808080' }}>&lt;/</span><span style={{ color: '#4ec9b0' }}>p</span><span style={{ color: '#808080' }}>&gt;</span><br/>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: '#808080' }}>&lt;</span><span style={{ color: '#4ec9b0' }}>button</span> <span style={{ color: '#92c5f8' }}>onClick</span>=<span style={{ color: '#808080' }}>{'{'}</span><span style={{ color: '#9cdcfe' }}>handleIncrement</span><span style={{ color: '#808080' }}>{'}'}</span><span style={{ color: '#808080' }}>&gt;</span><br/>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;+1<br/>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: '#808080' }}>&lt;/</span><span style={{ color: '#4ec9b0' }}>button</span><span style={{ color: '#808080' }}>&gt;</span><br/>
                  &nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: '#808080' }}>&lt;/</span><span style={{ color: '#4ec9b0' }}>div</span><span style={{ color: '#808080' }}>&gt;</span><br/>
                  &nbsp;&nbsp;);<br/>
                  {'}'};<br/>
                </code>
              </pre>
            </Paper>

            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#1976d2' }}>
              🎮 チャレンジ：初めてのインタラクティブアプリを作ろう！
            </Typography>
            
            <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.8 }}>
              学んだことを活かして、<strong>「名前を入力すると挨拶してくれるアプリ」</strong>を作ってみましょう！<br/>
              これができるようになれば、あなたは立派なReact開発者の仕閣入りです！
            </Typography>
            
            <Paper elevation={1} sx={{ p: 3, mb: 3, backgroundColor: '#f3e5f5' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 2, color: '#7b1fa2' }}>
                📝 作るもの：「こんにちはアプリ」
              </Typography>
              <Box component="ol" sx={{ pl: 3, '& li': { mb: 1 } }}>
                <li><strong>📝 テキスト入力欄</strong>：ユーザーが自分の名前を入力できる</li>
                <li><strong>👋 挨拶メッセージ</strong>：「こんにちは、[Enter your name]さん！」と表示</li>
                <li><strong>🔄 リセットボタン</strong>：ボタンを押すと名前が消えて元に戻る</li>
                <li><strong>✨ おまけ</strong>：名前が入っていない時は「げしさん」と表示する</li>
              </Box>
              
              <Typography variant="body2" sx={{ mt: 2, p: 2, backgroundColor: '#c8e6c9', borderRadius: 1, fontStyle: 'italic' }}>
                💡 <strong>ヒント：</strong>練習用ページで実際にコードを書いて、動かしてみてください！エラーが出ても大丈夫、それも勉強の一部です。
              </Typography>
            </Paper>

            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#1976d2' }}>
              🎆 おめでとうございます！ここからがスタート！
            </Typography>
            
            <Paper elevation={1} sx={{ p: 3, mb: 3, backgroundColor: '#e1f5fe' }}>
              <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.8 }}>
                Reactの基礎を学んだあなたは、もう<strong>モダンWeb開発の世界</strong>に足を踏み入れました！<br/>
                これからはどんどん楽しくなっていきます。
              </Typography>
              
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 2, color: '#1976d2' }}>
                🚀 次にチャレンジしたいスキル：
              </Typography>
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1, backgroundColor: '#fff3e0', borderRadius: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>🎨</Typography>
                  <Typography variant="body2"><strong>CSS・スタイリング</strong>：美しいデザイン作成</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1, backgroundColor: '#f3e5f5', borderRadius: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>📝</Typography>
                  <Typography variant="body2"><strong>TypeScript</strong>：型安全なコード</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1, backgroundColor: '#e8f5e8', borderRadius: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>🔄</Typography>
                  <Typography variant="body2"><strong>状態管理</strong>：大きなアプリ作成</Typography>
                </Box>
              </Box>
              
              <Typography variant="body2" sx={{ textAlign: 'center', fontStyle: 'italic', color: '#666' }}>
                💪 まずは「CSS・スタイリング」で、あなたのアプリを美しく飾ってみましょう！
              </Typography>
            </Paper>
          </Box>
        );

      case 'css-styling':
        return (
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3, color: '#e91e63' }}>
              🎨 CSS・スタイリング：あなたのアプリを美しく飾ろう！
            </Typography>

            <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
              <strong>「コードは動くけど、デザインがダサい...」</strong><br/>
              そんなお悩みを解決しましょう！このガイドでは、Reactアプリを<strong>美しく、使いやすく</strong>飾る方法を学びます。<br/><br/>
              
              まるでインテリアコーディネーターのように、あなたのWebアプリを素敵にコーディネートしていきましょう！
            </Typography>

            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#e91e63' }}>
              🌈 スタイリングの世界でできること
            </Typography>
            <Paper elevation={1} sx={{ p: 3, mb: 3, backgroundColor: '#fce4ec' }}>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#e91e63', minWidth: '30px' }}>🎨</Typography>
                  <Typography variant="body2"><strong>美しい色とフォント</strong>：ブランドに合ったデザイン</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#e91e63', minWidth: '30px' }}>📱</Typography>
                  <Typography variant="body2"><strong>レスポンシブデザイン</strong>：PCもスマホも綺麗に</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#e91e63', minWidth: '30px' }}>✨</Typography>
                  <Typography variant="body2"><strong>アニメーション</strong>：滑らかで感動的なUI</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#e91e63', minWidth: '30px' }}>🚀</Typography>
                  <Typography variant="body2"><strong>プロ並みデザイン</strong>：GoogleやAppleレベル</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#e91e63', minWidth: '30px' }}>♾️</Typography>
                  <Typography variant="body2"><strong>テーマシステム</strong>：ダークモードも簡単に</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#e91e63', minWidth: '30px' }}>🎯</Typography>
                  <Typography variant="body2"><strong>ユーザビリティ</strong>：使いやすさを追求</Typography>
                </Box>
              </Box>
            </Paper>

            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#e91e63' }}>
              🎯 このコースでマスターするスキル
            </Typography>
            
            <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.8 }}>
              「デザインのセンスがない...」と思っていませんか？<br/>
              安心してください！デザインも<strong>正しい知識とツール</strong>さえあれば、誰でも美しいUIが作れます！
            </Typography>
            
            <Paper elevation={1} sx={{ p: 3, mb: 3, backgroundColor: '#f8bbd9' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 2, color: '#880e4f' }}>
                🎓 レベル別スキルマップ
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#4caf50', minWidth: '60px' }}>🔰 初級</Typography>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#4caf50', mb: 0.5 }}>Material-UIで簡単美しいUI</Typography>
                    <Typography variant="body2" sx={{ color: '#666' }}>コピペで使えるコンポーネント集を使いこなそう</Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#ff9800', minWidth: '60px' }}>📚 中級</Typography>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#ff9800', mb: 0.5 }}>レスポンシブデザインとテーマ</Typography>
                    <Typography variant="body2" sx={{ color: '#666' }}>PC、スマホ、タブレットで綺麗に表示させよう</Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#f44336', minWidth: '60px' }}>⚙️ 上級</Typography>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#f44336', mb: 0.5 }}>アニメーションとカスタムスタイル</Typography>
                    <Typography variant="body2" sx={{ color: '#666' }}>滑らかな動きと独自デザインで差をつけよう</Typography>
                  </Box>
                </Box>
              </Box>
            </Paper>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#e91e63' }}>
              🚀 Step 1: Material-UIで一瞬にプロ級み！
            </Typography>
            
            <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.8 }}>
              <strong>Material-UI</strong>は、Googleが作った「Material Design」をReactで簡単に使える魔法のライブラリです！<br/>
              これさえあれば、<strong>まるでGoogleのアプリのような美しいUI</strong>があっという間に作れます。<br/><br/>
              
              下のコードを見てください。たったこれだけで、プロが作ったようなカードができあがります！
            </Typography>
            
            <Paper elevation={1} sx={{ p: 2, mb: 2, backgroundColor: '#fff3e0' }}>
              <Typography variant="body2" sx={{ fontStyle: 'italic', color: '#f57c00' }}>
                💡 <strong>なぜこんなに簡単？</strong>コンポーネントの中に、美しいデザインが最初から組み込まれているからです！
                まるでデザイナーが作ったテンプレートを使うようなものですね。
              </Typography>
            </Paper>
            <Paper elevation={1} sx={{ 
              p: 3, 
              mb: 3, 
              backgroundColor: '#1e1e1e',
              borderRadius: 2,
              border: '1px solid #333'
            }}>
              <pre style={{ 
                margin: 0, 
                fontFamily: '"Fira Code", "SF Mono", Monaco, monospace',
                fontSize: '14px',
                lineHeight: '1.5',
                color: '#d4d4d4',
                overflow: 'auto'
              }}>
                <code dangerouslySetInnerHTML={{ __html: `<span style="color: #c586c0">import</span> { <span style="color: #9cdcfe">Button</span>, <span style="color: #9cdcfe">Typography</span>, <span style="color: #9cdcfe">Box</span> } <span style="color: #c586c0">from</span> <span style="color: #ce9178">'@mui/material'</span>;

<span style="color: #c586c0">const</span> <span style="color: #4fc1ff">StyledComponent</span>: <span style="color: #4fc1ff">React.FC</span> = () <span style="color: #c586c0">=&gt;</span> {
  <span style="color: #c586c0">return</span> (
    <span style="color: #808080">&lt;</span><span style="color: #4ec9b0">Box</span> <span style="color: #92c5f8">sx</span>=<span style="color: #808080">{{</span> 
      <span style="color: #9cdcfe">p</span>: <span style="color: #b5cea8">3</span>, 
      <span style="color: #9cdcfe">backgroundColor</span>: <span style="color: #ce9178">'primary.main'</span>,
      <span style="color: #9cdcfe">borderRadius</span>: <span style="color: #b5cea8">2</span>,
      <span style="color: #9cdcfe">boxShadow</span>: <span style="color: #b5cea8">2</span>
    <span style="color: #808080">}}</span><span style="color: #808080">&gt;</span>
      <span style="color: #808080">&lt;</span><span style="color: #4ec9b0">Typography</span> <span style="color: #92c5f8">variant</span>=<span style="color: #ce9178">"h6"</span> <span style="color: #92c5f8">sx</span>=<span style="color: #808080">{{</span> <span style="color: #9cdcfe">color</span>: <span style="color: #ce9178">'white'</span>, <span style="color: #9cdcfe">mb</span>: <span style="color: #b5cea8">2</span> <span style="color: #808080">}}</span><span style="color: #808080">&gt;</span>
        Material-UIの基本
      <span style="color: #808080">&lt;/</span><span style="color: #4ec9b0">Typography</span><span style="color: #808080">&gt;</span>
      <span style="color: #808080">&lt;</span><span style="color: #4ec9b0">Button</span> <span style="color: #92c5f8">variant</span>=<span style="color: #ce9178">"contained"</span> <span style="color: #92c5f8">color</span>=<span style="color: #ce9178">"secondary"</span><span style="color: #808080">&gt;</span>
        クリックしてみよう
      <span style="color: #808080">&lt;/</span><span style="color: #4ec9b0">Button</span><span style="color: #808080">&gt;</span>
    <span style="color: #808080">&lt;/</span><span style="color: #4ec9b0">Box</span><span style="color: #808080">&gt;</span>
  );
};` }} />
              </pre>
            </Paper>

            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#e91e63' }}>
              📱 Step 2: マジック！どの端末でも緺麗に表示
            </Typography>
            
            <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.8 }}>
              <strong>「スマホで見たらデザインが崩れていた...」</strong><br/>
              そんな悩みとはおさらば！Material-UIの<strong>レスポンシブシステム</strong>を使えば、<br/>
              PC、タブレット、スマートフォン、どの端末でも美しく表示されます！<br/><br/>
              
              まるでマジックのように、サイズが自動で調整されていきます。
            </Typography>
            
            <Paper elevation={1} sx={{ p: 2, mb: 2, backgroundColor: '#f3e5f5' }}>
              <Typography variant="body2" sx={{ fontStyle: 'italic', color: '#7b1fa2' }}>
                💡 <strong>数字の意味：</strong>
                <code>xs=12</code>＝スマホでは横幅100%、
                <code>md=6</code>＝タブレットでは50%、
                <code>lg=4</code>＝PCでは33%の幅を意味します。
              </Typography>
            </Paper>
            <Paper elevation={1} sx={{ 
              p: 3, 
              mb: 3, 
              backgroundColor: '#1e1e1e',
              borderRadius: 2,
              border: '1px solid #333'
            }}>
              <pre style={{ 
                margin: 0, 
                fontFamily: '"Fira Code", "SF Mono", Monaco, monospace',
                fontSize: '14px',
                lineHeight: '1.5',
                color: '#d4d4d4',
                overflow: 'auto'
              }}>
                <code dangerouslySetInnerHTML={{ __html: `<span style="color: #c586c0">import</span> { <span style="color: #9cdcfe">Grid</span>, <span style="color: #9cdcfe">Container</span> } <span style="color: #c586c0">from</span> <span style="color: #ce9178">'@mui/material'</span>;

<span style="color: #c586c0">const</span> <span style="color: #4fc1ff">ResponsiveLayout</span>: <span style="color: #4fc1ff">React.FC</span> = () <span style="color: #c586c0">=&gt;</span> {
  <span style="color: #c586c0">return</span> (
    <span style="color: #808080">&lt;</span><span style="color: #4ec9b0">Container</span> <span style="color: #92c5f8">maxWidth</span>=<span style="color: #ce9178">"lg"</span><span style="color: #808080">&gt;</span>
      <span style="color: #808080">&lt;</span><span style="color: #4ec9b0">Grid</span> <span style="color: #92c5f8">container</span> <span style="color: #92c5f8">spacing</span>=<span style="color: #808080">{</span><span style="color: #b5cea8">3</span><span style="color: #808080">}</span><span style="color: #808080">&gt;</span>
        <span style="color: #808080">&lt;</span><span style="color: #4ec9b0">Grid</span> <span style="color: #92c5f8">item</span> <span style="color: #92c5f8">xs</span>=<span style="color: #808080">{</span><span style="color: #b5cea8">12</span><span style="color: #808080">}</span> <span style="color: #92c5f8">md</span>=<span style="color: #808080">{</span><span style="color: #b5cea8">6</span><span style="color: #808080">}</span> <span style="color: #92c5f8">lg</span>=<span style="color: #808080">{</span><span style="color: #b5cea8">4</span><span style="color: #808080">}</span><span style="color: #808080">&gt;</span>
          <span style="color: #808080">&lt;</span><span style="color: #4ec9b0">Paper</span> <span style="color: #92c5f8">sx</span>=<span style="color: #808080">{{</span> <span style="color: #9cdcfe">p</span>: <span style="color: #b5cea8">2</span> <span style="color: #808080">}}</span><span style="color: #808080">&gt;</span>
            モバイル: 100%, タブレット: 50%, デスクトップ: 33%
          <span style="color: #808080">&lt;/</span><span style="color: #4ec9b0">Paper</span><span style="color: #808080">&gt;</span>
        <span style="color: #808080">&lt;/</span><span style="color: #4ec9b0">Grid</span><span style="color: #808080">&gt;</span>
        <span style="color: #808080">&lt;</span><span style="color: #4ec9b0">Grid</span> <span style="color: #92c5f8">item</span> <span style="color: #92c5f8">xs</span>=<span style="color: #808080">{</span><span style="color: #b5cea8">12</span><span style="color: #808080">}</span> <span style="color: #92c5f8">md</span>=<span style="color: #808080">{</span><span style="color: #b5cea8">6</span><span style="color: #808080">}</span> <span style="color: #92c5f8">lg</span>=<span style="color: #808080">{</span><span style="color: #b5cea8">4</span><span style="color: #808080">}</span><span style="color: #808080">&gt;</span>
          <span style="color: #808080">&lt;</span><span style="color: #4ec9b0">Paper</span> <span style="color: #92c5f8">sx</span>=<span style="color: #808080">{{</span> <span style="color: #9cdcfe">p</span>: <span style="color: #b5cea8">2</span> <span style="color: #808080">}}</span><span style="color: #808080">&gt;</span>
            レスポンシブなグリッドレイアウト
          <span style="color: #808080">&lt;/</span><span style="color: #4ec9b0">Paper</span><span style="color: #808080">&gt;</span>
        <span style="color: #808080">&lt;/</span><span style="color: #4ec9b0">Grid</span><span style="color: #808080">&gt;</span>
      <span style="color: #808080">&lt;/</span><span style="color: #4ec9b0">Grid</span><span style="color: #808080">&gt;</span>
    <span style="color: #808080">&lt;/</span><span style="color: #4ec9b0">Container</span><span style="color: #808080">&gt;</span>
  );
};` }} />
              </pre>
            </Paper>

            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#e91e63' }}>
              🎯 ミッション：プロ級みカードを作ってみよう！
            </Typography>
            
            <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.8 }}>
              学んだことを活かして、<strong>「ホバーすると浮き上がる美しいカード」</strong>を作ってみましょう！<br/>
              InstagramやPinterestのような、プロが作ったようなカードができあがります。
            </Typography>
            
            <Paper elevation={1} sx={{ p: 3, mb: 3, backgroundColor: '#fce4ec' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 2, color: '#ad1457' }}>
                🎨 カードに含める要素
              </Typography>
              <Box component="ol" sx={{ pl: 3, '& li': { mb: 1 } }}>
                <li><strong>✨ ホバーアニメーション</strong>：マウスを乗せるとふわっと浮き上がる</li>
                <li><strong>🔲 美しいシャドウ</strong>：立体的な影で深みを表現</li>
                <li><strong>🔘 丸い角</strong>：優しい印象を与えるデザイン</li>
                <li><strong>📱 レスポンシブ対応</strong>：どの端末でも美しく表示</li>
                <li><strong>📝 コンテンツ</strong>：タイトル、説明文、ボタンを美しく配置</li>
              </Box>
              
              <Typography variant="body2" sx={{ mt: 2, p: 2, backgroundColor: '#f8bbd9', borderRadius: 1, fontStyle: 'italic' }}>
                💡 <strong>ボーナスチャレンジ：</strong>テーマカラーを使ったダークモード対応も試してみてください！
              </Typography>
            </Paper>
            
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#e91e63' }}>
              🎆 おつかれさま！デザイナーの仕閣入り！
            </Typography>
            
            <Paper elevation={1} sx={{ p: 3, mb: 3, backgroundColor: '#e1f5fe' }}>
              <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.8 }}>
                CSS・スタイリングをマスターしたあなたは、もう<strong>美しいUIを作るスキル</strong>を手に入れました！<br/>
                これであなたのReactアプリは、機能だけでなく見た目も素晴らしいものになります。
              </Typography>
              
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 2, color: '#1976d2' }}>
                🚀 次のステップは？
              </Typography>
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1, backgroundColor: '#e8f5e8', borderRadius: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>📝</Typography>
                  <Typography variant="body2"><strong>TypeScript</strong>：コードをもっと安全に</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1, backgroundColor: '#fff3e0', borderRadius: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>🔄</Typography>
                  <Typography variant="body2"><strong>状態管理</strong>：大きなアプリ作成</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1, backgroundColor: '#f3e5f5', borderRadius: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>🏠</Typography>
                  <Typography variant="body2"><strong>コンポーネント設計</strong>：再利用しやすい設計</Typography>
                </Box>
              </Box>
              
              <Typography variant="body2" sx={{ textAlign: 'center', fontStyle: 'italic', color: '#666' }}>
                💪 次は「TypeScript」でコードをもっと安全に書けるようになりましょう！
              </Typography>
            </Paper>
          </Box>
        );

      case 'typescript':
        return (
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3, color: '#3178c6' }}>
              🕰️ TypeScript：コードのボディガードでバグを防ごう！
            </Typography>

            <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
              <strong>「コードを実行したらエラーが...」「数字を入れるべき場所に文字を入れてしまった...」</strong><br/>
              そんな悩みを解決するのがTypeScriptです！<br/><br/>
              
              TypeScriptは、JavaScriptに<strong>「型」というボディガード</strong>をつけて、
              コードを実行する前にエラーを教えてくれる魔法の言語です。<br/>
              Microsoft、Google、Netflix...多くの大企業が使っている理由があります！
            </Typography>

            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#3178c6' }}>
              🛡️ TypeScriptが守ってくれるもの
            </Typography>
            <Paper elevation={1} sx={{ p: 3, mb: 3, backgroundColor: '#e3f2fd' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#3178c6', minWidth: '30px' }}>🚨</Typography>
                  <Typography variant="body2"><strong>タイプミス防止</strong>：数字の代わりに文字を入れてしまうミスを事前に教えてくれる</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#3178c6', minWidth: '30px' }}>🔍</Typography>
                  <Typography variant="body2"><strong>自動補完</strong>：エディタが賞くなって、使える属性やメソッドを提案してくれる</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#3178c6', minWidth: '30px' }}>🛠️</Typography>
                  <Typography variant="body2"><strong>リファクタリング</strong>：コードの名前を変更する時、関連する全ての箱所を自動で更新</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#3178c6', minWidth: '30px' }}>👥</Typography>
                  <Typography variant="body2"><strong>チーム開発</strong>：他の人が書いたコードが理解しやすく、コラボレーションがスムーズ</Typography>
                </Box>
              </Box>
            </Paper>

            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#3178c6' }}>
              🎯 このコースで身につく「安全コーディング」スキル
            </Typography>
            
            <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.8 }}>
              「TypeScriptって難しそう...」と思っていませんか？<br/>
              実は、基本さえ押さえれば、<strong>JavaScriptよりも簡単</strong>に感じることが多いんです！
            </Typography>
            
            <Paper elevation={1} sx={{ p: 3, mb: 3, backgroundColor: '#e8f5e8' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 2, color: '#2e7d32' }}>
                🎓 レベル別学習ロードマップ
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#4caf50', minWidth: '60px' }}>🔰 1週目</Typography>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#4caf50', mb: 0.5 }}>基本の型を覚えよう</Typography>
                    <Typography variant="body2" sx={{ color: '#666' }}>string、number、boolean...この3つさえ覚えればOK</Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#ff9800', minWidth: '60px' }}>📚 2週目</Typography>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#ff9800', mb: 0.5 }}>オブジェクトと配列の型</Typography>
                    <Typography variant="body2" sx={{ color: '#666' }}>複数のデータをまとめて扱う方法をマスター</Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#9c27b0', minWidth: '60px' }}>⚙️ 3週目</Typography>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#9c27b0', mb: 0.5 }}>ReactとTypeScriptの組み合わせ</Typography>
                    <Typography variant="body2" sx={{ color: '#666' }}>コンポーネントのPropsやStateを型安全に書こう</Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#f44336', minWidth: '60px' }}>🚀 4週目</Typography>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#f44336', mb: 0.5 }}>上級技法とベストプラクティス</Typography>
                    <Typography variant="body2" sx={{ color: '#666' }}>ジェネリクス、ユーティリティ型などの応用技法</Typography>
                  </Box>
                </Box>
              </Box>
            </Paper>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#3178c6' }}>
              🔰 Step 1: まずは3つの基本型を覚えよう！
            </Typography>
            
            <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.8 }}>
              TypeScriptの基本は、たった<strong>3つの型</strong>を覚えるだけ！<br/>
              この3つさえおさえれば、あなたもTypeScriptマスターの仕閣入りです。<br/><br/>
              
              まずは「この変数には数字しか入らないよ」というように、
              <strong>コンピュータに約束をさせる</strong>ことから始めましょう。
            </Typography>
            
            <Paper elevation={1} sx={{ p: 2, mb: 2, backgroundColor: '#fff3e0' }}>
              <Typography variant="body2" sx={{ fontStyle: 'italic', color: '#f57c00' }}>
                💡 <strong>「型」って何？</strong>コンピュータに「この箱には数字しか入れちゃダメよ」と教えてあげるようなものです。
                違うものを入れようとすると、エラーで教えてくれます。
              </Typography>
            </Paper>
            <Paper elevation={1} sx={{ 
              p: 3, 
              mb: 3, 
              backgroundColor: '#1e1e1e',
              borderRadius: 2,
              border: '1px solid #333'
            }}>
              <pre style={{ 
                margin: 0, 
                fontFamily: '"Fira Code", "SF Mono", Monaco, monospace',
                fontSize: '14px',
                lineHeight: '1.5',
                color: '#d4d4d4',
                overflow: 'auto'
              }}>
                <code dangerouslySetInnerHTML={{ __html: `<span style="color: #6a9955">// 基本的な型の定義</span>
<span style="color: #c586c0">let</span> <span style="color: #9cdcfe">name</span>: <span style="color: #4fc1ff">string</span> = <span style="color: #ce9178">"田中太郎"</span>;
<span style="color: #c586c0">let</span> <span style="color: #9cdcfe">age</span>: <span style="color: #4fc1ff">number</span> = <span style="color: #b5cea8">25</span>;
<span style="color: #c586c0">let</span> <span style="color: #9cdcfe">isActive</span>: <span style="color: #4fc1ff">boolean</span> = <span style="color: #569cd6">true</span>;
<span style="color: #c586c0">let</span> <span style="color: #9cdcfe">tags</span>: <span style="color: #4fc1ff">string</span>[] = [<span style="color: #ce9178">"React"</span>, <span style="color: #ce9178">"TypeScript"</span>];

<span style="color: #6a9955">// オブジェクトの型定義</span>
<span style="color: #c586c0">interface</span> <span style="color: #4fc1ff">User</span> {
  <span style="color: #9cdcfe">id</span>: <span style="color: #4fc1ff">number</span>;
  <span style="color: #9cdcfe">name</span>: <span style="color: #4fc1ff">string</span>;
  <span style="color: #9cdcfe">email</span>: <span style="color: #4fc1ff">string</span>;
  <span style="color: #9cdcfe">isAdmin</span>?: <span style="color: #4fc1ff">boolean</span>; <span style="color: #6a9955">// オプショナルプロパティ</span>
}

<span style="color: #c586c0">const</span> <span style="color: #9cdcfe">user</span>: <span style="color: #4fc1ff">User</span> = {
  <span style="color: #9cdcfe">id</span>: <span style="color: #b5cea8">1</span>,
  <span style="color: #9cdcfe">name</span>: <span style="color: #ce9178">"田中太郎"</span>,
  <span style="color: #9cdcfe">email</span>: <span style="color: #ce9178">"tanaka@example.com"</span>
};` }} />
              </pre>
            </Paper>

            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#3178c6' }}>
              📖 Step 2: React + TypeScript
            </Typography>
            <Paper elevation={1} sx={{ 
              p: 3, 
              mb: 3, 
              backgroundColor: '#1e1e1e',
              borderRadius: 2,
              border: '1px solid #333'
            }}>
              <pre style={{ 
                margin: 0, 
                fontFamily: '"Fira Code", "SF Mono", Monaco, monospace',
                fontSize: '14px',
                lineHeight: '1.5',
                color: '#d4d4d4',
                overflow: 'auto'
              }}>
                <code dangerouslySetInnerHTML={{ __html: `<span style="color: #c586c0">interface</span> <span style="color: #4fc1ff">Props</span> {
  <span style="color: #9cdcfe">title</span>: <span style="color: #4fc1ff">string</span>;
  <span style="color: #9cdcfe">count</span>: <span style="color: #4fc1ff">number</span>;
  <span style="color: #9cdcfe">onIncrement</span>: () <span style="color: #c586c0">=&gt;</span> <span style="color: #4fc1ff">void</span>;
  <span style="color: #9cdcfe">children</span>?: <span style="color: #4fc1ff">React.ReactNode</span>;
}

<span style="color: #c586c0">const</span> <span style="color: #4fc1ff">Counter</span>: <span style="color: #4fc1ff">React.FC</span>&lt;<span style="color: #4fc1ff">Props</span>&gt; = ({ 
  <span style="color: #9cdcfe">title</span>, 
  <span style="color: #9cdcfe">count</span>, 
  <span style="color: #9cdcfe">onIncrement</span>, 
  <span style="color: #9cdcfe">children</span> 
}) <span style="color: #c586c0">=&gt;</span> {
  <span style="color: #c586c0">return</span> (
    <span style="color: #808080">&lt;</span><span style="color: #4ec9b0">div</span><span style="color: #808080">&gt;</span>
      <span style="color: #808080">&lt;</span><span style="color: #4ec9b0">h2</span><span style="color: #808080">&gt;</span>{<span style="color: #9cdcfe">title</span>}<span style="color: #808080">&lt;/</span><span style="color: #4ec9b0">h2</span><span style="color: #808080">&gt;</span>
      <span style="color: #808080">&lt;</span><span style="color: #4ec9b0">p</span><span style="color: #808080">&gt;</span>カウント: {<span style="color: #9cdcfe">count</span>}<span style="color: #808080">&lt;/</span><span style="color: #4ec9b0">p</span><span style="color: #808080">&gt;</span>
      <span style="color: #808080">&lt;</span><span style="color: #4ec9b0">button</span> <span style="color: #92c5f8">onClick</span>=<span style="color: #808080">{</span><span style="color: #9cdcfe">onIncrement</span><span style="color: #808080">}</span><span style="color: #808080">&gt;</span>
        +1
      <span style="color: #808080">&lt;/</span><span style="color: #4ec9b0">button</span><span style="color: #808080">&gt;</span>
      {<span style="color: #9cdcfe">children</span>}
    <span style="color: #808080">&lt;/</span><span style="color: #4ec9b0">div</span><span style="color: #808080">&gt;</span>
  );
};` }} />
              </pre>
            </Paper>
          </Box>
        );

      case 'state-management':
        return (
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3, color: '#4caf50' }}>
              🏮 状態管理：あなたのアプリに「記憶力」を持たせよう！
            </Typography>

            <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
              <strong>「ページを移動したらデータが消えた...」「複数のコンポーネントで同じデータを使いたい」</strong><br/>
              そんな悩みを解決するのが「状態管理」です！<br/><br/>
              
              状態管理を使えば、アプリ全体で<strong>「共通の記憶」</strong>を持つことができます。<br/>
              例えば、ショッピングカートの中身、ログイン情報、テーマ設定など、<br/>
              どのページからでもアクセスできるようになります！
            </Typography>

            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#4caf50' }}>
              🧠 状態管理が必要な理由
            </Typography>
            <Paper elevation={1} sx={{ p: 3, mb: 3, backgroundColor: '#e8f5e8' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#4caf50', minWidth: '30px' }}>🏪</Typography>
                  <Typography variant="body2"><strong>ショッピングサイト</strong>：カートの中身をどのページからでも確認・変更</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#4caf50', minWidth: '30px' }}>👤</Typography>
                  <Typography variant="body2"><strong>ユーザー情報</strong>：ログイン状態をアプリ全体で共有</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#4caf50', minWidth: '30px' }}>🎨</Typography>
                  <Typography variant="body2"><strong>テーマ設定</strong>：ダークモードの設定を全ページに適用</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#4caf50', minWidth: '30px' }}>📊</Typography>
                  <Typography variant="body2"><strong>リアルタイムデータ</strong>：複数のコンポーネントで同期的に更新</Typography>
                </Box>
              </Box>
            </Paper>

            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#4caf50' }}>
              🎯 Zustandでマスターするスキル
            </Typography>
            
            <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.8 }}>
              <strong>Zustand（ズースタンド）</strong>は、ドイツ語で「状態」という意味。<br/>
              他の状態管理ライブラリよりも<strong>簡単で直感的</strong>に使えると話題です！
            </Typography>
            
            <Paper elevation={1} sx={{ p: 3, mb: 3, backgroundColor: '#c8e6c9' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 2, color: '#2e7d32' }}>
                🌱 成長のステップ
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#4caf50', minWidth: '40px' }}>🔰 1.</Typography>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#4caf50', mb: 0.5 }}>ストアの作成</Typography>
                    <Typography variant="body2" sx={{ color: '#666' }}>アプリの「共通の記憶場所」を作る</Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#ff9800', minWidth: '40px' }}>📚 2.</Typography>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#ff9800', mb: 0.5 }}>コンポーネントで使う</Typography>
                    <Typography variant="body2" sx={{ color: '#666' }}>どこからでもデータにアクセス</Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#9c27b0', minWidth: '40px' }}>⚙️ 3.</Typography>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#9c27b0', mb: 0.5 }}>非同期処理</Typography>
                    <Typography variant="body2" sx={{ color: '#666' }}>API通信と組み合わせる</Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#f44336', minWidth: '40px' }}>🚀 4.</Typography>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#f44336', mb: 0.5 }}>最適化</Typography>
                    <Typography variant="body2" sx={{ color: '#666' }}>必要な部分だけ再レンダリング</Typography>
                  </Box>
                </Box>
              </Box>
            </Paper>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#4caf50' }}>
              🏪 Step 1: アプリの「記憶場所」を作ろう
            </Typography>
            
            <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.8 }}>
              まずは<strong>「ストア」</strong>という、アプリ全体の記憶場所を作ります。<br/>
              まるで共通のノートに情報を書いて、みんなで共有するイメージです。<br/><br/>
              
              下のコードは、<strong>カウンターの数値を記憶するストア</strong>の例です。
            </Typography>
            
            <Paper elevation={1} sx={{ p: 2, mb: 2, backgroundColor: '#fff3e0' }}>
              <Typography variant="body2" sx={{ fontStyle: 'italic', color: '#f57c00' }}>
                💡 <strong>なぜこんなにシンプル？</strong> Zustandは「余計な設定は一切不要」というポリシー。
                必要最低限のコードで動くように設計されています！
              </Typography>
            </Paper>
            <Paper elevation={1} sx={{ 
              p: 3, 
              mb: 3, 
              backgroundColor: '#1e1e1e',
              borderRadius: 2,
              border: '1px solid #333'
            }}>
              <pre style={{ 
                margin: 0, 
                fontFamily: '"Fira Code", "SF Mono", Monaco, monospace',
                fontSize: '14px',
                lineHeight: '1.5',
                color: '#d4d4d4',
                overflow: 'auto'
              }}>
                <code dangerouslySetInnerHTML={{ __html: `<span style="color: #c586c0">import</span> { <span style="color: #9cdcfe">create</span> } <span style="color: #c586c0">from</span> <span style="color: #ce9178">'zustand'</span>;

<span style="color: #c586c0">interface</span> <span style="color: #4fc1ff">CounterState</span> {
  <span style="color: #9cdcfe">count</span>: <span style="color: #4fc1ff">number</span>;
  <span style="color: #9cdcfe">increment</span>: () <span style="color: #c586c0">=&gt;</span> <span style="color: #4fc1ff">void</span>;
  <span style="color: #9cdcfe">decrement</span>: () <span style="color: #c586c0">=&gt;</span> <span style="color: #4fc1ff">void</span>;
  <span style="color: #9cdcfe">reset</span>: () <span style="color: #c586c0">=&gt;</span> <span style="color: #4fc1ff">void</span>;
}

<span style="color: #c586c0">export</span> <span style="color: #c586c0">const</span> <span style="color: #4fc1ff">useCounterStore</span> = <span style="color: #dcdcaa">create</span>&lt;<span style="color: #4fc1ff">CounterState</span>&gt;((<span style="color: #9cdcfe">set</span>) <span style="color: #c586c0">=&gt;</span> ({
  <span style="color: #9cdcfe">count</span>: <span style="color: #b5cea8">0</span>,
  <span style="color: #9cdcfe">increment</span>: () <span style="color: #c586c0">=&gt;</span> <span style="color: #dcdcaa">set</span>((<span style="color: #9cdcfe">state</span>) <span style="color: #c586c0">=&gt;</span> ({ <span style="color: #9cdcfe">count</span>: <span style="color: #9cdcfe">state</span>.<span style="color: #9cdcfe">count</span> + <span style="color: #b5cea8">1</span> })),
  <span style="color: #9cdcfe">decrement</span>: () <span style="color: #c586c0">=&gt;</span> <span style="color: #dcdcaa">set</span>((<span style="color: #9cdcfe">state</span>) <span style="color: #c586c0">=&gt;</span> ({ <span style="color: #9cdcfe">count</span>: <span style="color: #9cdcfe">state</span>.<span style="color: #9cdcfe">count</span> - <span style="color: #b5cea8">1</span> })),
  <span style="color: #9cdcfe">reset</span>: () <span style="color: #c586c0">=&gt;</span> <span style="color: #dcdcaa">set</span>({ <span style="color: #9cdcfe">count</span>: <span style="color: #b5cea8">0</span> }),
}));` }} />
              </pre>
            </Paper>

            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#4caf50' }}>
              🌐 Step 2: どこからでもデータにアクセス
            </Typography>
            
            <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.8 }}>
              ストアを作ったら、<strong>どのコンポーネントからでも使える</strong>ようになります！<br/>
              まるでテレパシーのように、データが瞬時に共有されます。
            </Typography>
            <Paper elevation={1} sx={{ 
              p: 3, 
              mb: 3, 
              backgroundColor: '#1e1e1e',
              borderRadius: 2,
              border: '1px solid #333'
            }}>
              <pre style={{ 
                margin: 0, 
                fontFamily: '"Fira Code", "SF Mono", Monaco, monospace',
                fontSize: '14px',
                lineHeight: '1.5',
                color: '#d4d4d4',
                overflow: 'auto'
              }}>
                <code dangerouslySetInnerHTML={{ __html: `<span style="color: #c586c0">import</span> { <span style="color: #9cdcfe">useCounterStore</span> } <span style="color: #c586c0">from</span> <span style="color: #ce9178">'./stores/useCounterStore'</span>;

<span style="color: #c586c0">const</span> <span style="color: #4fc1ff">Counter</span>: <span style="color: #4fc1ff">React.FC</span> = () <span style="color: #c586c0">=&gt;</span> {
  <span style="color: #c586c0">const</span> { <span style="color: #9cdcfe">count</span>, <span style="color: #9cdcfe">increment</span>, <span style="color: #9cdcfe">decrement</span>, <span style="color: #9cdcfe">reset</span> } = <span style="color: #dcdcaa">useCounterStore</span>();

  <span style="color: #c586c0">return</span> (
    <span style="color: #808080">&lt;</span><span style="color: #4ec9b0">div</span><span style="color: #808080">&gt;</span>
      <span style="color: #808080">&lt;</span><span style="color: #4ec9b0">h2</span><span style="color: #808080">&gt;</span>カウント: {<span style="color: #9cdcfe">count</span>}<span style="color: #808080">&lt;/</span><span style="color: #4ec9b0">h2</span><span style="color: #808080">&gt;</span>
      <span style="color: #808080">&lt;</span><span style="color: #4ec9b0">button</span> <span style="color: #92c5f8">onClick</span>=<span style="color: #808080">{</span><span style="color: #9cdcfe">increment</span><span style="color: #808080">}</span><span style="color: #808080">&gt;</span>+1<span style="color: #808080">&lt;/</span><span style="color: #4ec9b0">button</span><span style="color: #808080">&gt;</span>
      <span style="color: #808080">&lt;</span><span style="color: #4ec9b0">button</span> <span style="color: #92c5f8">onClick</span>=<span style="color: #808080">{</span><span style="color: #9cdcfe">decrement</span><span style="color: #808080">}</span><span style="color: #808080">&gt;</span>-1<span style="color: #808080">&lt;/</span><span style="color: #4ec9b0">button</span><span style="color: #808080">&gt;</span>
      <span style="color: #808080">&lt;</span><span style="color: #4ec9b0">button</span> <span style="color: #92c5f8">onClick</span>=<span style="color: #808080">{</span><span style="color: #9cdcfe">reset</span><span style="color: #808080">}</span><span style="color: #808080">&gt;</span>リセット<span style="color: #808080">&lt;/</span><span style="color: #4ec9b0">button</span><span style="color: #808080">&gt;</span>
    <span style="color: #808080">&lt;/</span><span style="color: #4ec9b0">div</span><span style="color: #808080">&gt;</span>
  );
};` }} />
              </pre>
            </Paper>
          </Box>
        );

      case 'component-design':
        return (
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3, color: '#9c27b0' }}>
              🏠 コンポーネント設計：「もったいない」コードを書こう！
            </Typography>

            <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
              <strong>「同じようなコードを何度も書いている...」「修正する時が大変...」</strong><br/>
              そんな悩みを解決するのが<strong>「コンポーネント設計」</strong>です！<br/><br/>
              
              まるでLEGOブロックのように、<strong>一度作ったパーツを何度でも使い回せる</strong>ように、<br/>
              賞い設計をするコツを学びましょう。あなたの開発速度が2倍、3倍になりますよ！
            </Typography>

            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#9c27b0' }}>
              🙌 いい設計のメリット
            </Typography>
            <Paper elevation={1} sx={{ p: 3, mb: 3, backgroundColor: '#f3e5f5' }}>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#9c27b0', minWidth: '30px' }}>♾️</Typography>
                  <Typography variant="body2"><strong>再利用性</strong>：一度作れば何度でも使える</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#9c27b0', minWidth: '30px' }}>🔧</Typography>
                  <Typography variant="body2"><strong>保守性</strong>：変更が簡単、バグが少ない</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#9c27b0', minWidth: '30px' }}>📚</Typography>
                  <Typography variant="body2"><strong>可読性</strong>：他の人が読んでも分かる</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#9c27b0', minWidth: '30px' }}>🚀</Typography>
                  <Typography variant="body2"><strong>開発速度</strong>：DRY原則でコード量削減</Typography>
                </Box>
              </Box>
            </Paper>

            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#9c27b0' }}>
              🎯 マスターする設計スキル
            </Typography>
            
            <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.8 }}>
              「設計」と聞くと難しそうですが、基本は<strong>「整理整頓」</strong>と同じ！<br/>
              下記の4つのポイントを押さえれば、あなたも設計マスターです。
            </Typography>
            
            <Paper elevation={1} sx={{ p: 3, mb: 3, backgroundColor: '#e1bee7' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 2, color: '#6a1b9a' }}>
                🎓 コンポーネント設計の4原則
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#7b1fa2', minWidth: '40px' }}>🎯 1.</Typography>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#7b1fa2', mb: 0.5 }}>単一責任の原則</Typography>
                    <Typography variant="body2" sx={{ color: '#666' }}>1つのコンポーネントは1つのことだけする（例：ボタンはクリックされるだけ）</Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#8e24aa', minWidth: '40px' }}>🔗 2.</Typography>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#8e24aa', mb: 0.5 }}>Propsをシンプルに</Typography>
                    <Typography variant="body2" sx={{ color: '#666' }}>データの受け渡しは必要最低限に、深い階層は避ける</Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#9c27b0', minWidth: '40px' }}>♾️ 3.</Typography>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#9c27b0', mb: 0.5 }}>再利用を意識</Typography>
                    <Typography variant="body2" sx={{ color: '#666' }}>「あ、これ他でも使えそう」と思ったら分離する</Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#ab47bc', minWidth: '40px' }}>🤝 4.</Typography>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#ab47bc', mb: 0.5 }}>カスタムフックの活用</Typography>
                    <Typography variant="body2" sx={{ color: '#666' }}>ロジックを共通化してコードをスッキリ</Typography>
                  </Box>
                </Box>
              </Box>
            </Paper>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#9c27b0' }}>
              🎯 原則１：「一つのことだけ」ルール
            </Typography>
            
            <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.8 }}>
              コンポーネント設計の<strong>一番大切なルール</strong>です！<br/>
              まるで「包丁は切るだけ、フライパンは焗るだけ」のように、<br/>
              一つのコンポーネントは一つの役割だけを担当しましょう。
            </Typography>
            
            <Paper elevation={1} sx={{ p: 2, mb: 2, backgroundColor: '#fff3e0' }}>
              <Typography variant="body2" sx={{ fontStyle: 'italic', color: '#f57c00' }}>
                💡 <strong>メリット：</strong>「このコンポーネント、何をするの？」と聞かれた時、
                1文で答えられるようになります。修正も簡単に！
              </Typography>
            </Paper>
            <Paper elevation={1} sx={{ 
              p: 3, 
              mb: 3, 
              backgroundColor: '#1e1e1e',
              borderRadius: 2,
              border: '1px solid #333'
            }}>
              <pre style={{ 
                margin: 0, 
                fontFamily: '"Fira Code", "SF Mono", Monaco, monospace',
                fontSize: '14px',
                lineHeight: '1.5',
                color: '#d4d4d4',
                overflow: 'auto'
              }}>
                <code dangerouslySetInnerHTML={{ __html: `<span style="color: #6a9955">// ❌ 悪い例：一つのコンポーネントが多くの責任を持つ</span>
<span style="color: #c586c0">const</span> <span style="color: #4fc1ff">UserProfile</span>: <span style="color: #4fc1ff">React.FC</span> = () <span style="color: #c586c0">=&gt;</span> {
  <span style="color: #6a9955">// ユーザー情報の取得</span>
  <span style="color: #6a9955">// フォームのバリデーション</span>
  <span style="color: #6a9955">// API通信</span>
  <span style="color: #6a9955">// UI表示</span>
  <span style="color: #6a9955">// ...</span>
};

<span style="color: #6a9955">// ✅ 良い例：責任を分離</span>
<span style="color: #c586c0">const</span> <span style="color: #4fc1ff">UserProfile</span>: <span style="color: #4fc1ff">React.FC</span> = () <span style="color: #c586c0">=&gt;</span> {
  <span style="color: #c586c0">return</span> (
    <span style="color: #808080">&lt;</span><span style="color: #4ec9b0">div</span><span style="color: #808080">&gt;</span>
      <span style="color: #808080">&lt;</span><span style="color: #4ec9b0">UserInfo</span> <span style="color: #808080">/&gt;</span>
      <span style="color: #808080">&lt;</span><span style="color: #4ec9b0">UserForm</span> <span style="color: #808080">/&gt;</span>
      <span style="color: #808080">&lt;</span><span style="color: #4ec9b0">UserActions</span> <span style="color: #808080">/&gt;</span>
    <span style="color: #808080">&lt;/</span><span style="color: #4ec9b0">div</span><span style="color: #808080">&gt;</span>
  );
};` }} />
              </pre>
            </Paper>

            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#9c27b0' }}>
              🤝 原則４：カスタムフックでコードをまとめよう
            </Typography>
            
            <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.8 }}>
              カスタムフックは、<strong>「よく使う機能をまとめた便利ツール」</strong>です！<br/>
              例えば、「ローディング中の表示」「エラー処理」「データ取得」など、<br/>
              よく使うパターンを一つのフックにまとめておくと便利です。
            </Typography>
            <Paper elevation={1} sx={{ 
              p: 3, 
              mb: 3, 
              backgroundColor: '#1e1e1e',
              borderRadius: 2,
              border: '1px solid #333'
            }}>
              <pre style={{ 
                margin: 0, 
                fontFamily: '"Fira Code", "SF Mono", Monaco, monospace',
                fontSize: '14px',
                lineHeight: '1.5',
                color: '#d4d4d4',
                overflow: 'auto'
              }}>
                <code dangerouslySetInnerHTML={{ __html: `<span style="color: #6a9955">// カスタムフック</span>
<span style="color: #c586c0">const</span> <span style="color: #dcdcaa">useUserData</span> = (<span style="color: #9cdcfe">userId</span>: <span style="color: #4fc1ff">string</span>) <span style="color: #c586c0">=&gt;</span> {
  <span style="color: #c586c0">const</span> [<span style="color: #9cdcfe">user</span>, <span style="color: #9cdcfe">setUser</span>] = <span style="color: #dcdcaa">useState</span>&lt;<span style="color: #4fc1ff">User</span> | <span style="color: #569cd6">null</span>&gt;(<span style="color: #569cd6">null</span>);
  <span style="color: #c586c0">const</span> [<span style="color: #9cdcfe">loading</span>, <span style="color: #9cdcfe">setLoading</span>] = <span style="color: #dcdcaa">useState</span>(<span style="color: #569cd6">true</span>);

  <span style="color: #dcdcaa">useEffect</span>(() <span style="color: #c586c0">=&gt;</span> {
    <span style="color: #dcdcaa">fetchUser</span>(<span style="color: #9cdcfe">userId</span>).<span style="color: #dcdcaa">then</span>(<span style="color: #9cdcfe">setUser</span>).<span style="color: #dcdcaa">finally</span>(() <span style="color: #c586c0">=&gt;</span> <span style="color: #dcdcaa">setLoading</span>(<span style="color: #569cd6">false</span>));
  }, [<span style="color: #9cdcfe">userId</span>]);

  <span style="color: #c586c0">return</span> { <span style="color: #9cdcfe">user</span>, <span style="color: #9cdcfe">loading</span> };
};

<span style="color: #6a9955">// コンポーネントでの使用</span>
<span style="color: #c586c0">const</span> <span style="color: #4fc1ff">UserProfile</span>: <span style="color: #4fc1ff">React.FC</span>&lt;{ <span style="color: #9cdcfe">userId</span>: <span style="color: #4fc1ff">string</span> }&gt; = ({ <span style="color: #9cdcfe">userId</span> }) <span style="color: #c586c0">=&gt;</span> {
  <span style="color: #c586c0">const</span> { <span style="color: #9cdcfe">user</span>, <span style="color: #9cdcfe">loading</span> } = <span style="color: #dcdcaa">useUserData</span>(<span style="color: #9cdcfe">userId</span>);

  <span style="color: #c586c0">if</span> (<span style="color: #9cdcfe">loading</span>) <span style="color: #c586c0">return</span> <span style="color: #808080">&lt;</span><span style="color: #4ec9b0">div</span><span style="color: #808080">&gt;</span>読み込み中...<span style="color: #808080">&lt;/</span><span style="color: #4ec9b0">div</span><span style="color: #808080">&gt;</span>;
  <span style="color: #c586c0">if</span> (!<span style="color: #9cdcfe">user</span>) <span style="color: #c586c0">return</span> <span style="color: #808080">&lt;</span><span style="color: #4ec9b0">div</span><span style="color: #808080">&gt;</span>ユーザーが見つかりません<span style="color: #808080">&lt;/</span><span style="color: #4ec9b0">div</span><span style="color: #808080">&gt;</span>;

  <span style="color: #c586c0">return</span> <span style="color: #808080">&lt;</span><span style="color: #4ec9b0">div</span><span style="color: #808080">&gt;</span>{<span style="color: #9cdcfe">user</span>.<span style="color: #9cdcfe">name</span>}<span style="color: #808080">&lt;/</span><span style="color: #4ec9b0">div</span><span style="color: #808080">&gt;</span>;
};` }} />
              </pre>
            </Paper>
          </Box>
        );

      case 'error-handling':
        return (
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3, color: '#f44336' }}>
              🛡️ エラーハンドリング：アプリを守る４つの防御策
            </Typography>

            <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
              <strong>「画面が真っ白になった！」「アプリが動かない！」</strong><br/>
              そんなピンチを乗り切るのが「エラーハンドリング」です！<br/><br/>
              
              エラーハンドリングは、アプリの<strong>「お守り」</strong>のようなもの。<br/>
              万が一何かが起こっても、ユーザーが困らないように守ってくれます。<br/>
              この学習で、頼もしい「デジタルボディガード」を作りましょう！
            </Typography>

            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#f44336' }}>
              🎯 エラーハンドリングで身につく「安心感」
            </Typography>
            <Paper elevation={1} sx={{ p: 3, mb: 3, backgroundColor: '#ffebee' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#f44336', minWidth: '30px' }}>🛡️</Typography>
                  <Typography variant="body2"><strong>アプリクラッシュ防止</strong>：一部でエラーが起きても全体は動き続ける</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#f44336', minWidth: '30px' }}>💬</Typography>
                  <Typography variant="body2"><strong>親切なメッセージ</strong>：「何かエラーが発生しました」より具体的な案内</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#f44336', minWidth: '30px' }}>🔄</Typography>
                  <Typography variant="body2"><strong>自動回復機能</strong>：「再試行」ボタンで簡単に復旧</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#f44336', minWidth: '30px' }}>📊</Typography>
                  <Typography variant="body2"><strong>問題の見える化</strong>：どこで何が起きたかを記録・分析</Typography>
                </Box>
              </Box>
            </Paper>

            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#f44336' }}>
              🏰 防御策１：Error Boundary（エラーの砦）
            </Typography>
            
            <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.8 }}>
              Error Boundaryは、アプリの<strong>「最後の砦」</strong>です！<br/>
              コンポーネントの中でエラーが起きても、そのエラーを<strong>「囲い込んで」</strong>、<br/>
              他の部分に影響が出ないようにしてくれます。
            </Typography>
            <Paper elevation={1} sx={{ 
              p: 3, 
              mb: 3, 
              backgroundColor: '#1e1e1e',
              borderRadius: 2,
              border: '1px solid #333'
            }}>
              <pre style={{ 
                margin: 0, 
                fontFamily: '"Fira Code", "SF Mono", Monaco, monospace',
                fontSize: '14px',
                lineHeight: '1.5',
                color: '#d4d4d4',
                overflow: 'auto'
              }}>
                <code dangerouslySetInnerHTML={{ __html: `<span style="color: #c586c0">class</span> <span style="color: #4fc1ff">ErrorBoundary</span> <span style="color: #c586c0">extends</span> <span style="color: #4fc1ff">Component</span>&lt;<span style="color: #4fc1ff">Props</span>, <span style="color: #4fc1ff">State</span>&gt; {
  <span style="color: #dcdcaa">constructor</span>(<span style="color: #9cdcfe">props</span>: <span style="color: #4fc1ff">Props</span>) {
    <span style="color: #c586c0">super</span>(<span style="color: #9cdcfe">props</span>);
    <span style="color: #569cd6">this</span>.<span style="color: #9cdcfe">state</span> = { <span style="color: #9cdcfe">hasError</span>: <span style="color: #569cd6">false</span> };
  }

  <span style="color: #c586c0">static</span> <span style="color: #dcdcaa">getDerivedStateFromError</span>(<span style="color: #9cdcfe">error</span>: <span style="color: #4fc1ff">Error</span>): <span style="color: #4fc1ff">State</span> {
    <span style="color: #c586c0">return</span> { <span style="color: #9cdcfe">hasError</span>: <span style="color: #569cd6">true</span> };
  }

  <span style="color: #dcdcaa">componentDidCatch</span>(<span style="color: #9cdcfe">error</span>: <span style="color: #4fc1ff">Error</span>, <span style="color: #9cdcfe">errorInfo</span>: <span style="color: #4fc1ff">ErrorInfo</span>) {
    <span style="color: #9cdcfe">console</span>.<span style="color: #dcdcaa">error</span>(<span style="color: #ce9178">'Error caught by boundary:'</span>, <span style="color: #9cdcfe">error</span>, <span style="color: #9cdcfe">errorInfo</span>);
  }

  <span style="color: #dcdcaa">render</span>() {
    <span style="color: #c586c0">if</span> (<span style="color: #569cd6">this</span>.<span style="color: #9cdcfe">state</span>.<span style="color: #9cdcfe">hasError</span>) {
      <span style="color: #c586c0">return</span> (
        <span style="color: #808080">&lt;</span><span style="color: #4ec9b0">div</span><span style="color: #808080">&gt;</span>
          <span style="color: #808080">&lt;</span><span style="color: #4ec9b0">h2</span><span style="color: #808080">&gt;</span>何かエラーが発生しました<span style="color: #808080">&lt;/</span><span style="color: #4ec9b0">h2</span><span style="color: #808080">&gt;</span>
          <span style="color: #808080">&lt;</span><span style="color: #4ec9b0">button</span> <span style="color: #92c5f8">onClick</span>=<span style="color: #808080">{</span>() <span style="color: #c586c0">=&gt;</span> <span style="color: #569cd6">this</span>.<span style="color: #dcdcaa">setState</span>({ <span style="color: #9cdcfe">hasError</span>: <span style="color: #569cd6">false</span> })<span style="color: #808080">}</span><span style="color: #808080">&gt;</span>
            再試行
          <span style="color: #808080">&lt;/</span><span style="color: #4ec9b0">button</span><span style="color: #808080">&gt;</span>
        <span style="color: #808080">&lt;/</span><span style="color: #4ec9b0">div</span><span style="color: #808080">&gt;</span>
      );
    }

    <span style="color: #c586c0">return</span> <span style="color: #569cd6">this</span>.<span style="color: #9cdcfe">props</span>.<span style="color: #9cdcfe">children</span>;
  }
}` }} />
              </pre>
            </Paper>

            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#f44336' }}>
              🚑 防御策２：try-catch文（即座の対応）
            </Typography>
            
            <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.8 }}>
              try-catch文は、<strong>「救急隊」</strong>のような存在です！<br/>
              APIの通信エラーやデータ処理でのトラブルを<strong>「その場で」</strong>キャッチして、<br/>
              適切な対応を取ってくれます。
            </Typography>

            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#f44336' }}>
              💊 防御策３：ローディング状態（ユーザーの安心感）
            </Typography>
            
            <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.8 }}>
              ローディング表示は、<strong>「今、頑張って作業中です！」</strong>のメッセージ。<br/>
              ユーザーが「固まった？」と不安にならないように、<br/>
              <strong>「ちゃんと動いてますよ」</strong>をお知らせします。
            </Typography>

            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#f44336' }}>
              📱 防御策４：フォールバック表示（代替案の提示）
            </Typography>
            
            <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
              フォールバック表示は、<strong>「プランB」</strong>です！<br/>
              メイン機能が使えない時でも、代わりに何かを表示して、<br/>
              ユーザーが困らないようにします。
            </Typography>

            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#f44336' }}>
              🎉 まとめ：エラーに強いアプリの作り方
            </Typography>
            <Paper elevation={1} sx={{ p: 3, mb: 3, backgroundColor: '#fff3e0' }}>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                <Box sx={{ 
                  p: 2, 
                  backgroundColor: '#ffebee', 
                  borderRadius: 2,
                  border: '2px solid #f44336',
                  textAlign: 'center'
                }}>
                  <Typography variant="h6" sx={{ color: '#f44336', fontWeight: 'bold', mb: 1 }}>
                    🏰 Error Boundary
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#666' }}>
                    アプリ全体を守る最後の砦
                  </Typography>
                </Box>
                <Box sx={{ 
                  p: 2, 
                  backgroundColor: '#e3f2fd', 
                  borderRadius: 2,
                  border: '2px solid #2196f3',
                  textAlign: 'center'
                }}>
                  <Typography variant="h6" sx={{ color: '#2196f3', fontWeight: 'bold', mb: 1 }}>
                    🚑 try-catch
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#666' }}>
                    即座にエラーをキャッチ
                  </Typography>
                </Box>
                <Box sx={{ 
                  p: 2, 
                  backgroundColor: '#f3e5f5', 
                  borderRadius: 2,
                  border: '2px solid #9c27b0',
                  textAlign: 'center'
                }}>
                  <Typography variant="h6" sx={{ color: '#9c27b0', fontWeight: 'bold', mb: 1 }}>
                    💊 ローディング
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#666' }}>
                    ユーザーに安心感を提供
                  </Typography>
                </Box>
                <Box sx={{ 
                  p: 2, 
                  backgroundColor: '#e8f5e8', 
                  borderRadius: 2,
                  border: '2px solid #4caf50',
                  textAlign: 'center'
                }}>
                  <Typography variant="h6" sx={{ color: '#4caf50', fontWeight: 'bold', mb: 1 }}>
                    📱 フォールバック
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#666' }}>
                    代替案で問題を回避
                  </Typography>
                </Box>
              </Box>
              
              <Typography variant="body1" sx={{ 
                mt: 3, 
                textAlign: 'center', 
                fontWeight: 'bold',
                color: '#ff6f00',
                fontSize: '1.1rem'
              }}>
                🎊 これで、どんなトラブルが起きても安心のアプリが完成！<br/>
                ユーザーは快適に、開発者は安心して運用できます 🎊
              </Typography>
            </Paper>
          </Box>
        );

      case 'sticky-notes-tutorial':
        return (
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3, color: '#ff5722' }}>
              🗒️ 付箋システム作成：デジタル付箋でアイデアを整理しよう！
            </Typography>

            <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
              <strong>「アイデアをすぐにメモしたい！」「チームでアイデアを共有したい！」</strong><br/>
              そんな時に便利なのが「デジタル付箋システム」です！<br/><br/>
              
              リアルな付箋を<strong>「デジタル化」</strong>して、ドラッグ&ドロップで自由に動かせる、<br/>
              美しいアニメーション付きの付箋システムを作りましょう。<br/>
              まるで<strong>「魔法の壁」</strong>にアイデアを貼り付けるような感覚です！
            </Typography>

            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#ff5722' }}>
              🎨 このチュートリアルで作れるもの
            </Typography>
            <Paper elevation={1} sx={{ p: 3, mb: 3, backgroundColor: '#fff3e0' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#ff5722', minWidth: '30px' }}>🖱️</Typography>
                  <Typography variant="body2"><strong>ドラッグ&ドロップ</strong>：付箋を自由に動かして整理</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#ff5722', minWidth: '30px' }}>🎨</Typography>
                  <Typography variant="body2"><strong>カラフルな付箋</strong>：色分けでカテゴリ管理</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#ff5722', minWidth: '30px' }}>✨</Typography>
                  <Typography variant="body2"><strong>滑らかアニメーション</strong>：現実の付箋のような動き</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#ff5722', minWidth: '30px' }}>📱</Typography>
                  <Typography variant="body2"><strong>レスポンシブ対応</strong>：スマホでもタブレットでも快適</Typography>
                </Box>
              </Box>
            </Paper>

            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#ff5722' }}>
              ✨ 完成予想図：みんなのアイデアボード
            </Typography>
            <Paper elevation={1} sx={{ p: 3, mb: 3, backgroundColor: '#fbe9e7' }}>
              {/* 付箋タブのモックアップ */}
              <Box sx={{ 
                backgroundColor: '#fff8e1',
                borderRadius: 2,
                p: 2,
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}>
                {/* ヘッダー部分 */}
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  mb: 2,
                  pb: 2,
                  borderBottom: '2px solid #ffecb3'
                }}>
                  <Typography variant="h6" sx={{ color: '#f57c00', display: 'flex', alignItems: 'center', gap: 1 }}>
                    🗒️ 付箋管理システム
                  </Typography>
                  <Button
                    size="small"
                    variant="contained"
                    startIcon={<AddIcon />}
                    sx={{ 
                      backgroundColor: '#ff6f00',
                      '&:hover': { backgroundColor: '#e65100' }
                    }}
                  >
                    新規追加
                  </Button>
                </Box>
                
                {/* フィルタータブ */}
                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  <Chip label="📋 すべて" clickable sx={{ backgroundColor: '#fff3e0' }} />
                  <Chip label="🔴 重要" clickable sx={{ backgroundColor: '#ffebee' }} />
                  <Chip label="🟡 通常" clickable sx={{ backgroundColor: '#fffde7' }} />
                </Box>
                
                {/* 付箋カード */}
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  {/* 重要付箋 */}
                  <Paper sx={{ 
                    p: 2, 
                    width: '180px',
                    backgroundColor: '#ffcdd2',
                    border: '2px solid #f44336',
                    borderRadius: 1,
                    boxShadow: '2px 2px 8px rgba(0,0,0,0.1)',
                    transform: 'rotate(-2deg)',
                    '&:hover': { transform: 'rotate(0deg)' },
                    transition: 'transform 0.2s'
                  }}>
                    <Typography variant="subtitle2" sx={{ color: '#d32f2f', fontWeight: 'bold', mb: 1 }}>
                      🔴 重要
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#5d4037', mb: 1 }}>
                      UI修正
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#8d6e63' }}>
                      優先度: 高
                    </Typography>
                  </Paper>
                  
                  {/* アイデア付箋 */}
                  <Paper sx={{ 
                    p: 2, 
                    width: '180px',
                    backgroundColor: '#fff9c4',
                    border: '2px solid #fbc02d',
                    borderRadius: 1,
                    boxShadow: '2px 2px 8px rgba(0,0,0,0.1)',
                    transform: 'rotate(2deg)',
                    '&:hover': { transform: 'rotate(0deg)' },
                    transition: 'transform 0.2s'
                  }}>
                    <Typography variant="subtitle2" sx={{ color: '#f57f17', fontWeight: 'bold', mb: 1 }}>
                      🟡 アイデア
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#5d4037', mb: 1 }}>
                      新機能検討
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#8d6e63' }}>
                      明日まで
                    </Typography>
                  </Paper>
                </Box>
              </Box>
            </Paper>

            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#ff5722' }}>
              📖 主要機能
            </Typography>
            <Box component="ul" sx={{ mb: 3, pl: 3 }}>
              <li>付箋の作成、編集、削除</li>
              <li>カテゴリー別分類とフィルタリング</li>
              <li>ドラッグ&ドロップによる並び替え</li>
              <li>美しいアニメーションとホバー効果</li>
              <li>レスポンシブ対応のグリッドレイアウト</li>
            </Box>

            <Typography variant="body1" sx={{ mb: 3, fontStyle: 'italic' }}>
              詳細な実装ガイドは、学習ガイド一覧の「付箋タブ一覧の背景作成」の
              完全版ドキュメントをご確認ください。
            </Typography>
          </Box>
        );

      case 'practice-page':
        return (
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3, color: '#ff9800' }}>
              🎨 練習用ページ：あなた専用の「実験室」で自由に挑戦！
            </Typography>

            <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
              <strong>「学んだことを試してみたい！」「自分なりにアレンジしてみたい！」</strong><br/>
              そんな時のための特別な場所が「練習用ページ」です！<br/><br/>
              
              ここは<strong>「あなた専用の実験室」</strong>。何を書いても、どんなに失敗しても大丈夫！<br/>
              学習ガイドで学んだことを実際に手を動かして試すことで、<br/>
              <strong>「あ、こういうことか！」</strong>という発見がきっと見つかります。
            </Typography>

            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#ff9800' }}>
              🎯 練習ページで何ができるの？
            </Typography>
            <Paper elevation={1} sx={{ p: 3, mb: 3, backgroundColor: '#fff3e0' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#ff9800', minWidth: '30px' }}>🧪</Typography>
                  <Typography variant="body2"><strong>コード実験</strong>：新しいコンポーネントやアイデアを自由に試してみる</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#ff9800', minWidth: '30px' }}>🎨</Typography>
                  <Typography variant="body2"><strong>デザイン練習</strong>：CSSで見た目を変更、アニメーションに挑戦</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#ff9800', minWidth: '30px' }}>🔧</Typography>
                  <Typography variant="body2"><strong>機能テスト</strong>：ボタンクリック、フォーム入力などの動作確認</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#ff9800', minWidth: '30px' }}>🚀</Typography>
                  <Typography variant="body2"><strong>アイデア実現</strong>：「こんなのあったらいいな」を形にしてみる</Typography>
                </Box>
              </Box>
            </Paper>

            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#ff9800' }}>
              📁 あなたの実験室の構成
            </Typography>
            <Paper elevation={1} sx={{ p: 3, mb: 3, backgroundColor: '#fff8e1' }}>
              <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#e65100', mb: 2 }}>
                🗂️ 練習用ファイル
              </Typography>
              <pre style={{ 
                margin: 0, 
                fontFamily: 'monospace',
                fontSize: '14px',
                lineHeight: '1.6',
                color: '#bf360c',
                backgroundColor: '#fafafa',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid #ffcc02'
              }}>
{`src/components/Practice/
├── 📄 PracticePage.tsx    ← あなたのReactコード
└── 🎨 PracticePage.css    ← 見た目のスタイリング`}
              </pre>
            </Paper>

            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#ff9800' }}>
              🚀 練習の始め方（3ステップ）
            </Typography>
            <Paper elevation={1} sx={{ p: 3, mb: 3, backgroundColor: '#e8f5e8' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <Typography variant="h6" sx={{ 
                    backgroundColor: '#4caf50', 
                    color: 'white', 
                    borderRadius: '50%', 
                    width: 32, 
                    height: 32, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    flexShrink: 0
                  }}>
                    1
                  </Typography>
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#388e3c', mb: 1 }}>
                      右上の設定メニューから「練習用ページ」をクリック
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#666' }}>
                      まずは練習ページにアクセスしましょう！
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <Typography variant="h6" sx={{ 
                    backgroundColor: '#2196f3', 
                    color: 'white', 
                    borderRadius: '50%', 
                    width: 32, 
                    height: 32, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    flexShrink: 0
                  }}>
                    2
                  </Typography>
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#1976d2', mb: 1 }}>
                      エディタでファイルを開いて、自由にコードを書こう
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#666' }}>
                      PracticePage.tsxとPracticePage.cssを編集できます！
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <Typography variant="h6" sx={{ 
                    backgroundColor: '#ff9800', 
                    color: 'white', 
                    borderRadius: '50%', 
                    width: 32, 
                    height: 32, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    flexShrink: 0
                  }}>
                    3
                  </Typography>
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#f57c00', mb: 1 }}>
                      保存して、ブラウザで結果を確認！
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#666' }}>
                      変更が即座に反映されます。たくさん実験してみよう！
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Paper>

            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#ff9800' }}>
              💡 おすすめ練習アイデア
            </Typography>
            <Paper elevation={1} sx={{ p: 3, mb: 3, backgroundColor: '#f3e5f5' }}>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                <Box sx={{ p: 2, backgroundColor: '#fff3e0', borderRadius: 2, border: '1px solid #ffcc02' }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#f57c00', mb: 1 }}>
                    🌱 初心者向け
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: '0.85rem', lineHeight: 1.4 }}>
                    • ボタンの色を変えてみる<br/>
                    • 「Hello World」を表示<br/>
                    • 簡単なカウンターを作る
                  </Typography>
                </Box>
                <Box sx={{ p: 2, backgroundColor: '#e8f5e8', borderRadius: 2, border: '1px solid #4caf50' }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#388e3c', mb: 1 }}>
                    🌿 中級者向け
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: '0.85rem', lineHeight: 1.4 }}>
                    • ToDoリストアプリ<br/>
                    • アニメーション効果<br/>
                    • フォームの作成と検証
                  </Typography>
                </Box>
                <Box sx={{ p: 2, backgroundColor: '#e3f2fd', borderRadius: 2, border: '1px solid #2196f3' }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#1976d2', mb: 1 }}>
                    🌳 上級者向け
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: '0.85rem', lineHeight: 1.4 }}>
                    • APIとの連携<br/>
                    • 複雑なコンポーネント設計<br/>
                    • カスタムフックの作成
                  </Typography>
                </Box>
                <Box sx={{ p: 2, backgroundColor: '#ffebee', borderRadius: 2, border: '1px solid #f44336' }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#d32f2f', mb: 1 }}>
                    🎨 デザイン系
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: '0.85rem', lineHeight: 1.4 }}>
                    • グラデーション背景<br/>
                    • ホバー効果<br/>
                    • レスポンシブデザイン
                  </Typography>
                </Box>
              </Box>
            </Paper>

            <Typography variant="body1" sx={{ 
              textAlign: 'center', 
              fontWeight: 'bold',
              color: '#ff6f00',
              fontSize: '1.1rem',
              backgroundColor: '#fff3e0',
              p: 2,
              borderRadius: 2,
              border: '2px solid #ffcc02'
            }}>
              🎉 失敗を恐れずに、たくさん実験してみましょう！<br/>
              エラーも学びの一部です。どんどんチャレンジしよう！ 🎉
            </Typography>
          </Box>
        );

      case 'gpu-acceleration':
        return (
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3, color: '#2196f3' }}>
              ⚡ GPU加速とハードウェアアクセラレーション
            </Typography>

            <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
              <strong>「なぜボタンがカクカク動くの？」「アニメーションがスムーズにならない」</strong><br/>
              そんな悩みを解決するのがGPU加速です！<br/><br/>
              
              普段使っているパソコンやスマホには、<strong>CPU</strong>と<strong>GPU</strong>という2つの「頭脳」があります。
              この2つを上手に使い分けることで、Webページのアニメーションを驚くほどスムーズにできるんです。
            </Typography>

            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#2196f3' }}>
              📚 目次
            </Typography>
            <Box component="ul" sx={{ mb: 3, pl: 3 }}>
              <li>CPUとGPUの違い</li>
              <li>ブラウザのレンダリングプロセス</li>
              <li>コンポジットレイヤーの仕組み</li>
              <li>GPU加速を発動するCSSプロパティ</li>
              <li>実践的な最適化テクニック</li>
            </Box>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#2196f3' }}>
              💻 CPUとGPU - 2つの「頭脳」の違いを理解しよう
            </Typography>

            <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
              まずは身近な例で考えてみましょう。<br/>
              <strong>料理を作る時</strong>を想像してください：
            </Typography>

            <Paper elevation={1} sx={{ p: 3, mb: 3, backgroundColor: '#e3f2fd' }}>
              <Box sx={{ display: 'flex', gap: 3 }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2, color: '#1976d2' }}>
                    🧠 CPU = 料理長（1人）
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1, lineHeight: 1.6 }}>
                    <strong>🎯 得意なこと：</strong><br/>
                    複雑なレシピを考える、手順を決める、味を調整する
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1, lineHeight: 1.6 }}>
                    <strong>👥 人数：</strong> 少ない（4-16人）
                  </Typography>
                  <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                    <strong>💼 Webでの仕事：</strong><br/>
                    JavaScriptの実行、計算処理、ページの制御
                  </Typography>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2, color: '#1976d2' }}>
                    🎮 GPU = 調理スタッフ（大勢）
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1, lineHeight: 1.6 }}>
                    <strong>🎯 得意なこと：</strong><br/>
                    同じ作業を大勢で分担、野菜を同時に切る
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1, lineHeight: 1.6 }}>
                    <strong>👥 人数：</strong> 多い（数百〜数千人）
                  </Typography>
                  <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                    <strong>💼 Webでの仕事：</strong><br/>
                    画面の描画、アニメーション、エフェクト処理
                  </Typography>
                </Box>
              </Box>
              
              <Typography variant="body2" sx={{ mt: 2, p: 2, backgroundColor: '#fff3e0', borderRadius: 1, fontStyle: 'italic' }}>
                💡 <strong>つまり：</strong> CPUは「考える」のが得意、GPUは「同じ作業を大量にこなす」のが得意！
              </Typography>
            </Paper>

            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#2196f3' }}>
              🎬 ブラウザがWebページを表示する流れ
            </Typography>

            <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
              ブラウザがWebページを表示するまでには、<strong>6つの工程</strong>があります。<br/>
              動画制作に例えてみましょう：
            </Typography>

            <Paper elevation={1} sx={{ p: 3, mb: 3, backgroundColor: '#f3e5f5' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ width: '30px', height: '30px', borderRadius: '50%', backgroundColor: '#e3f2fd', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#1976d2' }}>1</Box>
                  <Typography variant="body2" sx={{ flex: 1 }}>
                    <strong>📝 HTML/CSS解析</strong> = 脚本を読む
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ width: '30px', height: '30px', borderRadius: '50%', backgroundColor: '#e8f5e8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#2e7d32' }}>2</Box>
                  <Typography variant="body2" sx={{ flex: 1 }}>
                    <strong>🏗️ DOM構築</strong> = セットを組み立てる
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ width: '30px', height: '30px', borderRadius: '50%', backgroundColor: '#fff3e0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#f57c00' }}>3</Box>
                  <Typography variant="body2" sx={{ flex: 1 }}>
                    <strong>📐 レイアウト</strong> = カメラアングルを決める
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ width: '30px', height: '30px', borderRadius: '50%', backgroundColor: '#fce4ec', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#c2185b' }}>4</Box>
                  <Typography variant="body2" sx={{ flex: 1 }}>
                    <strong>🎨 ペイント</strong> = 色を塗る・装飾する
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ width: '30px', height: '30px', borderRadius: '50%', backgroundColor: '#e1f5fe', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#0277bd' }}>5</Box>
                  <Typography variant="body2" sx={{ flex: 1 }}>
                    <strong>🎞️ コンポジット</strong> = 映像を合成する <span style={{ backgroundColor: '#ffeb3b', padding: '2px 6px', borderRadius: '3px', fontWeight: 'bold' }}>← GPU加速はここで活躍！</span>
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ width: '30px', height: '30px', borderRadius: '50%', backgroundColor: '#f3e5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#7b1fa2' }}>6</Box>
                  <Typography variant="body2" sx={{ flex: 1 }}>
                    <strong>📺 画面表示</strong> = 完成した映像を上映
                  </Typography>
                </Box>
              </Box>
              
              <Typography variant="body2" sx={{ mt: 3, p: 2, backgroundColor: '#fff3e0', borderRadius: 1, fontStyle: 'italic' }}>
                💡 <strong>重要：</strong> GPU加速は「コンポジット」段階で効果を発揮します！他の工程をスキップして、GPUが直接映像合成を担当するのです。
              </Typography>
            </Paper>

            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#2196f3' }}>
              🚀 魔法の呪文：GPU加速を発動するCSSプロパティ
            </Typography>

            <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
              これから紹介するCSSプロパティは、まるで魔法の呪文のように<strong>GPUの力を呼び覚まします</strong>！<br/>
              正しく使えば、カクカクだったアニメーションが一瞬でヌルヌル動くようになります。
            </Typography>

            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1, color: '#1976d2' }}>
              🎯 1. transform プロパティ（最強の味方）
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, lineHeight: 1.6, color: '#555' }}>
              transformは<strong>GPU加速の王様</strong>です！移動、回転、拡大縮小など、見た目の変更はこれ一つでOK。<br/>
              重要なのは、要素の実際の位置やサイズは変わらず、<strong>「見た目だけ」</strong>を変えることです。
            </Typography>
            <Paper elevation={1} sx={{ 
              p: 3, 
              mb: 3, 
              backgroundColor: '#1e1e1e',
              borderRadius: 2,
              border: '1px solid #333'
            }}>
              <pre style={{ 
                margin: 0, 
                fontFamily: '"Fira Code", "SF Mono", Monaco, monospace',
                fontSize: '14px',
                lineHeight: '1.5',
                color: '#d4d4d4',
                overflow: 'auto'
              }}>
                <code dangerouslySetInnerHTML={{ __html: `<span style="color: #6a9955">/* GPU加速される変換 */</span>
<span style="color: #92c5f8">transform</span>: <span style="color: #ce9178">translateZ(0)</span>;        <span style="color: #6a9955">/* 強制的にレイヤー作成 */</span>
<span style="color: #92c5f8">transform</span>: <span style="color: #ce9178">translate3d(0,0,0)</span>;   <span style="color: #6a9955">/* 明示的な3D変換 */</span>
<span style="color: #92c5f8">transform</span>: <span style="color: #ce9178">scale(1.1)</span>;          <span style="color: #6a9955">/* スケール変換 */</span>
<span style="color: #92c5f8">transform</span>: <span style="color: #ce9178">rotate(45deg)</span>;       <span style="color: #6a9955">/* 回転変換 */</span>

<span style="color: #6a9955">/* CPU処理される変換 */</span>
<span style="color: #92c5f8">left</span>: <span style="color: #b5cea8">100px</span>;                   <span style="color: #6a9955">/* position変更 */</span>
<span style="color: #92c5f8">top</span>: <span style="color: #b5cea8">50px</span>;                    <span style="color: #6a9955">/* position変更 */</span>
<span style="color: #92c5f8">width</span>: <span style="color: #b5cea8">200px</span>;                 <span style="color: #6a9955">/* サイズ変更 */</span>` }} />
              </pre>
            </Paper>

            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1, color: '#1976d2' }}>
              ✨ 2. その他のGPU加速プロパティ（便利な仲間たち）
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, lineHeight: 1.6, color: '#555' }}>
              transformの他にも、GPUの力を借りられるプロパティがあります。<br/>
              これらも同じように、<strong>レイアウトを変更せずに見た目だけ</strong>を変えるプロパティです。
            </Typography>
            <Paper elevation={1} sx={{ 
              p: 3, 
              mb: 3, 
              backgroundColor: '#1e1e1e',
              borderRadius: 2,
              border: '1px solid #333'
            }}>
              <pre style={{ 
                margin: 0, 
                fontFamily: '"Fira Code", "SF Mono", Monaco, monospace',
                fontSize: '14px',
                lineHeight: '1.5',
                color: '#d4d4d4',
                overflow: 'auto'
              }}>
                <code dangerouslySetInnerHTML={{ __html: `<span style="color: #6a9955">/* GPU加速されるプロパティ */</span>
<span style="color: #92c5f8">opacity</span>: <span style="color: #b5cea8">0.5</span>;                    <span style="color: #6a9955">/* 透明度変更 */</span>
<span style="color: #92c5f8">filter</span>: <span style="color: #ce9178">blur(5px)</span>;              <span style="color: #6a9955">/* フィルター効果 */</span>
<span style="color: #92c5f8">backdrop-filter</span>: <span style="color: #ce9178">blur(10px)</span>;    <span style="color: #6a9955">/* 背景フィルター */</span>
<span style="color: #92c5f8">position</span>: <span style="color: #ce9178">fixed</span>;               <span style="color: #6a9955">/* 固定位置 */</span>

<span style="color: #6a9955">/* 最適化ヒント */</span>
<span style="color: #92c5f8">will-change</span>: <span style="color: #ce9178">transform</span>;         <span style="color: #6a9955">/* 事前通知 */</span>
<span style="color: #92c5f8">backface-visibility</span>: <span style="color: #ce9178">hidden</span>;    <span style="color: #6a9955">/* 裏面描画無効 */</span>` }} />
              </pre>
            </Paper>

            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#2196f3' }}>
              ⚡ 実際の速度比較：CPUとGPUの違いを体感しよう
            </Typography>

            <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
              同じ「ボタンを右に200px、下に100px移動する」アニメーションでも、<br/>
              <strong>やり方によって滑らかさが全然違います</strong>！実際に比較してみましょう：
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <Paper elevation={1} sx={{ flex: 1, p: 2, backgroundColor: '#ffebee' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1, color: '#d32f2f' }}>
                  ❌ CPU処理（重い）
                </Typography>
                <Paper elevation={1} sx={{ 
                  p: 2, 
                  backgroundColor: '#1e1e1e',
                  borderRadius: 1,
                  border: '1px solid #333'
                }}>
                  <pre style={{ 
                    margin: 0, 
                    fontFamily: 'monospace',
                    fontSize: '12px',
                    color: '#d4d4d4'
                  }}>
                    <code dangerouslySetInnerHTML={{ __html: `<span style="color: #92c5f8">left</span>: <span style="color: #b5cea8">0px</span> → <span style="color: #b5cea8">200px</span>;
<span style="color: #92c5f8">top</span>: <span style="color: #b5cea8">0px</span> → <span style="color: #b5cea8">100px</span>;

<span style="color: #6a9955">/* リペイントが発生 */</span>
<span style="color: #6a9955">/* FPS: 30-45 */</span>` }} />
                  </pre>
                </Paper>
              </Paper>

              <Paper elevation={1} sx={{ flex: 1, p: 2, backgroundColor: '#e8f5e8' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1, color: '#2e7d32' }}>
                  ✅ GPU加速（軽い）
                </Typography>
                <Paper elevation={1} sx={{ 
                  p: 2, 
                  backgroundColor: '#1e1e1e',
                  borderRadius: 1,
                  border: '1px solid #333'
                }}>
                  <pre style={{ 
                    margin: 0, 
                    fontFamily: 'monospace',
                    fontSize: '12px',
                    color: '#d4d4d4'
                  }}>
                    <code dangerouslySetInnerHTML={{ __html: `<span style="color: #92c5f8">transform</span>: 
  <span style="color: #ce9178">translate3d(200px, 100px, 0)</span>;

<span style="color: #6a9955">/* コンポジットのみ */</span>
<span style="color: #6a9955">/* FPS: 60 */</span>` }} />
                  </pre>
                </Paper>
              </Paper>
            </Box>

            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#2196f3' }}>
              🔮 will-change：GPUに「準備して！」と事前にお知らせ
            </Typography>

            <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
              <code>will-change</code>は、ブラウザに<strong>「これからアニメーションするよ！」</strong>と教えてあげるプロパティです。<br/>
              料理で例えると、「お客さんが来る前にオーブンを予熱しておく」ようなものです。<br/><br/>
              
              ただし、<strong>使いすぎは禁物</strong>！常にオーブンを点けっぱなしにしておくと電気代がかかるように、
              <code>will-change</code>を使いすぎるとメモリを無駄遣いしてしまいます。
            </Typography>

            <Paper elevation={1} sx={{ 
              p: 3, 
              mb: 3, 
              backgroundColor: '#1e1e1e',
              borderRadius: 2,
              border: '1px solid #333'
            }}>
              <pre style={{ 
                margin: 0, 
                fontFamily: '"Fira Code", "SF Mono", Monaco, monospace',
                fontSize: '14px',
                lineHeight: '1.5',
                color: '#d4d4d4',
                overflow: 'auto'
              }}>
                <code dangerouslySetInnerHTML={{ __html: `<span style="color: #6a9955">/* ✅ 良い例：アニメーション前に設定 */</span>
<span style="color: #92c5f8">.button</span>:<span style="color: #569cd6">hover</span> {
  <span style="color: #92c5f8">will-change</span>: <span style="color: #ce9178">transform</span>;
  <span style="color: #92c5f8">transform</span>: <span style="color: #ce9178">scale(1.1)</span>;
}

<span style="color: #6a9955">/* ❌ 悪い例：常時設定（メモリ消費増加） */</span>
<span style="color: #92c5f8">.all-elements</span> {
  <span style="color: #92c5f8">will-change</span>: <span style="color: #ce9178">transform</span>; <span style="color: #6a9955">/* 全要素に設定は NG */</span>
}

<span style="color: #6a9955">/* 💡 アニメーション終了後はリセット */</span>
<span style="color: #92c5f8">.animation-end</span> {
  <span style="color: #92c5f8">will-change</span>: <span style="color: #ce9178">auto</span>;
}` }} />
              </pre>
            </Paper>

            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#2196f3' }}>
              🔍 おまけ：GPU加速を目で見て確認する方法
            </Typography>

            <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.8 }}>
              「本当にGPU加速されているの？」そんな疑問を解決する<strong>可視化機能</strong>があります！<br/>
              Chrome DevToolsを使えば、どの部分がGPUで処理されているかを実際に見ることができます。
            </Typography>

            <Paper elevation={1} sx={{ p: 3, mb: 3, backgroundColor: '#e8f5e8' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 2, color: '#2e7d32' }}>
                🔧 手順（5つのステップ）
              </Typography>
              <Box component="ol" sx={{ pl: 3, '& li': { mb: 1 } }}>
                <li><strong>F12キー</strong>を押してChrome DevToolsを開く</li>
                <li>右上の<strong>「⋯」メニュー</strong> → <strong>「More tools」</strong> → <strong>「Rendering」</strong>を選択</li>
                <li><strong>「Layer borders」</strong>にチェックを入れる</li>
                <li><strong>「Composited layer borders」</strong>にチェックを入れる</li>
                <li><strong>緑色の枠</strong>で囲まれた部分 = GPU加速されている！</li>
              </Box>
              
              <Typography variant="body2" sx={{ mt: 2, p: 2, backgroundColor: '#c8e6c9', borderRadius: 1, fontWeight: 'bold' }}>
                💡 緑の枠が見えたら成功！それがGPUで処理されている証拠です。
              </Typography>
            </Paper>

            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#2196f3' }}>
              🎮 チャレンジ：実際に作ってみよう！
            </Typography>
            <Box sx={{ mb: 3 }}>
              <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.8 }}>
                学んだことを活かして、以下のアニメーションを<strong>GPU加速版</strong>で作ってみましょう。<br/>
                最初はCPU処理で作って、その後GPU加速に変更すると違いがよく分かります！
              </Typography>
              <Paper elevation={1} sx={{ p: 3, backgroundColor: '#f3e5f5' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 2, color: '#7b1fa2' }}>
                  📝 練習課題（難易度順）
                </Typography>
                <Box component="ol" sx={{ pl: 3, '& li': { mb: 1.5 } }}>
                  <li><strong>🔰 初級：</strong>ボタンのホバーエフェクト（1.1倍に拡大）</li>
                  <li><strong>📚 中級：</strong>モーダルのフェードイン・アウト（透明度変化）</li>
                  <li><strong>⚙️ 上級：</strong>カードの360度回転アニメーション</li>
                  <li><strong>🚀 挑戦：</strong>リストアイテムのスライドイン（左からふわっと登場）</li>
                </Box>
                <Typography variant="body2" sx={{ mt: 2, fontStyle: 'italic', color: '#666' }}>
                  💡 ヒント：練習用ページで実際にコードを書いて試してみてください！
                </Typography>
              </Paper>
            </Box>

            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#ff5722' }}>
              ⚠️ 大切な注意点：GPU加速の落とし穴
            </Typography>
            
            <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.8 }}>
              GPU加速は魔法のように便利ですが、<strong>使いすぎは逆効果</strong>になることがあります。<br/>
              以下の点に注意して、賢く使いましょう：
            </Typography>
            
            <Paper elevation={1} sx={{ p: 3, mb: 3, backgroundColor: '#ffebee' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#d32f2f', minWidth: '20px' }}>🚫</Typography>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#d32f2f', mb: 1 }}>メモリの無駄遣いに注意</Typography>
                    <Typography variant="body2" sx={{ color: '#666' }}>GPUレイヤーはメモリを消費します。全ての要素に適用すると逆に重くなることも。</Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#f57c00', minWidth: '20px' }}>📱</Typography>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#f57c00', mb: 1 }}>スマートフォンでの動作確認</Typography>
                    <Typography variant="body2" sx={{ color: '#666' }}>PCでは快適でも、スマホでは重い場合があります。実際の端末でテストしましょう。</Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#1976d2', minWidth: '20px' }}>⚖️</Typography>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#1976d2', mb: 1 }}>バランスが大切</Typography>
                    <Typography variant="body2" sx={{ color: '#666' }}>「必要な時に必要な分だけ」がGPU加速を上手に使うコツです。</Typography>
                  </Box>
                </Box>
              </Box>
            </Paper>

            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#2196f3' }}>
              🎆 まとめ：GPU加速であなたもアニメーションマスター！
            </Typography>
            
            <Paper elevation={1} sx={{ p: 3, backgroundColor: '#e1f5fe' }}>
              <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
                おこさまでした！これであなたも<strong>GPU加速の基本</strong>をマスターしました。<br/>
                これからはカクカクアニメーションとはおさらば！
              </Typography>
              
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 2, color: '#1976d2' }}>
                🔑 キーポイントをおさらい：
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>🚀</Typography>
                  <Typography variant="body2"><code>transform</code>、<code>opacity</code>、<code>filter</code>を活用</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>🔮</Typography>
                  <Typography variant="body2"><code>will-change</code>で事前最適化</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>🔍</Typography>
                  <Typography variant="body2">開発者ツールで緑の枠を確認</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>⚖️</Typography>
                  <Typography variant="body2">適切な使用でスムーズなUXを実現</Typography>
                </Box>
              </Box>
              
              <Typography variant="body2" sx={{ mt: 2, p: 2, backgroundColor: '#fff3e0', borderRadius: 1, fontStyle: 'italic', textAlign: 'center' }}>
                💪 さあ、練習用ページで実際に作ってみましょう！体験してこそ真の理解が得られます。
              </Typography>
            </Paper>
          </Box>
        );

      case 'text-and-linebreak':
        return (
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3, color: '#00796b' }}>
              📝 React/JSXでの改行とテキスト表示
            </Typography>

            <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
              このガイドでは、React/JSXで改行や複数行テキストを表示する様々な方法を学びます。
            </Typography>

            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#00796b' }}>
              📚 目次
            </Typography>
            <Box component="ul" sx={{ mb: 3, pl: 3 }}>
              <li>基本的な改行方法</li>
              <li>複数行テキストの表示</li>
              <li>特殊文字とエスケープ</li>
              <li>Material-UIでのテキスト表示</li>
              <li>実践的な例</li>
            </Box>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#00796b' }}>
              📖 基本的な改行方法
            </Typography>

            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1, color: '#00897b' }}>
              1. {'<br />'}タグを使う方法
            </Typography>
            <Paper elevation={1} sx={{ 
              p: 3, 
              mb: 3, 
              backgroundColor: '#1e1e1e',
              borderRadius: 2,
              border: '1px solid #333'
            }}>
              <pre style={{ 
                margin: 0, 
                fontFamily: '"Fira Code", "SF Mono", Monaco, monospace',
                fontSize: '14px',
                lineHeight: '1.5',
                color: '#d4d4d4',
                overflow: 'auto'
              }}>
                <code dangerouslySetInnerHTML={{ __html: `<span style="color: #c586c0">function</span> <span style="color: #dcdcaa">SimpleLineBreak</span>() {
  <span style="color: #c586c0">return</span> (
    <span style="color: #808080">&lt;</span><span style="color: #4ec9b0">div</span><span style="color: #808080">&gt;</span>
      1行目のテキスト<span style="color: #808080">&lt;</span><span style="color: #4ec9b0">br</span> <span style="color: #808080">/&gt;</span>
      2行目のテキスト<span style="color: #808080">&lt;</span><span style="color: #4ec9b0">br</span> <span style="color: #808080">/&gt;</span>
      3行目のテキスト
    <span style="color: #808080">&lt;/</span><span style="color: #4ec9b0">div</span><span style="color: #808080">&gt;</span>
  );
}` }} />
              </pre>
            </Paper>

            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1, color: '#00897b' }}>
              2. 複数の要素に分ける方法
            </Typography>
            <Paper elevation={1} sx={{ 
              p: 3, 
              mb: 3, 
              backgroundColor: '#1e1e1e',
              borderRadius: 2,
              border: '1px solid #333'
            }}>
              <pre style={{ 
                margin: 0, 
                fontFamily: '"Fira Code", "SF Mono", Monaco, monospace',
                fontSize: '14px',
                lineHeight: '1.5',
                color: '#d4d4d4',
                overflow: 'auto'
              }}>
                <code dangerouslySetInnerHTML={{ __html: `<span style="color: #c586c0">function</span> <span style="color: #dcdcaa">MultipleElements</span>() {
  <span style="color: #c586c0">return</span> (
    <span style="color: #808080">&lt;</span><span style="color: #4ec9b0">div</span><span style="color: #808080">&gt;</span>
      <span style="color: #808080">&lt;</span><span style="color: #4ec9b0">p</span><span style="color: #808080">&gt;</span>段落1の内容です<span style="color: #808080">&lt;/</span><span style="color: #4ec9b0">p</span><span style="color: #808080">&gt;</span>
      <span style="color: #808080">&lt;</span><span style="color: #4ec9b0">p</span><span style="color: #808080">&gt;</span>段落2の内容です<span style="color: #808080">&lt;/</span><span style="color: #4ec9b0">p</span><span style="color: #808080">&gt;</span>
      <span style="color: #808080">&lt;</span><span style="color: #4ec9b0">p</span><span style="color: #808080">&gt;</span>段落3の内容です<span style="color: #808080">&lt;/</span><span style="color: #4ec9b0">p</span><span style="color: #808080">&gt;</span>
    <span style="color: #808080">&lt;/</span><span style="color: #4ec9b0">div</span><span style="color: #808080">&gt;</span>
  );
}` }} />
              </pre>
            </Paper>

            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1, color: '#00897b' }}>
              3. 配列とmapを使った動的な改行
            </Typography>
            <Paper elevation={1} sx={{ 
              p: 3, 
              mb: 3, 
              backgroundColor: '#1e1e1e',
              borderRadius: 2,
              border: '1px solid #333'
            }}>
              <pre style={{ 
                margin: 0, 
                fontFamily: '"Fira Code", "SF Mono", Monaco, monospace',
                fontSize: '14px',
                lineHeight: '1.5',
                color: '#d4d4d4',
                overflow: 'auto'
              }}>
                <code dangerouslySetInnerHTML={{ __html: `<span style="color: #c586c0">function</span> <span style="color: #dcdcaa">DynamicLines</span>() {
  <span style="color: #c586c0">const</span> <span style="color: #9cdcfe">lines</span> = [
    <span style="color: #ce9178">'ReactはUIライブラリです'</span>,
    <span style="color: #ce9178">'コンポーネントベースで開発します'</span>,
    <span style="color: #ce9178">'状態管理も簡単です'</span>
  ];

  <span style="color: #c586c0">return</span> (
    <span style="color: #808080">&lt;</span><span style="color: #4ec9b0">div</span><span style="color: #808080">&gt;</span>
      {<span style="color: #9cdcfe">lines</span>.<span style="color: #dcdcaa">map</span>((<span style="color: #9cdcfe">line</span>, <span style="color: #9cdcfe">index</span>) <span style="color: #c586c0">=&gt;</span> (
        <span style="color: #808080">&lt;</span><span style="color: #4ec9b0">div</span> <span style="color: #92c5f8">key</span>=<span style="color: #808080">{</span><span style="color: #9cdcfe">index</span><span style="color: #808080">}</span><span style="color: #808080">&gt;</span>{<span style="color: #9cdcfe">line</span>}<span style="color: #808080">&lt;/</span><span style="color: #4ec9b0">div</span><span style="color: #808080">&gt;</span>
      ))}
    <span style="color: #808080">&lt;/</span><span style="color: #4ec9b0">div</span><span style="color: #808080">&gt;</span>
  );
}` }} />
              </pre>
            </Paper>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#00796b' }}>
              📖 複数行テキストの表示
            </Typography>

            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1, color: '#00897b' }}>
              white-space: pre-line を使う方法
            </Typography>
            <Paper elevation={1} sx={{ 
              p: 3, 
              mb: 3, 
              backgroundColor: '#1e1e1e',
              borderRadius: 2,
              border: '1px solid #333'
            }}>
              <pre style={{ 
                margin: 0, 
                fontFamily: '"Fira Code", "SF Mono", Monaco, monospace',
                fontSize: '14px',
                lineHeight: '1.5',
                color: '#d4d4d4',
                overflow: 'auto'
              }}>
                <code dangerouslySetInnerHTML={{ __html: `<span style="color: #c586c0">function</span> <span style="color: #dcdcaa">PreLineText</span>() {
  <span style="color: #c586c0">const</span> <span style="color: #9cdcfe">multilineText</span> = <span style="color: #ce9178">\`1行目のテキスト
2行目のテキスト
3行目のテキスト\`</span>;

  <span style="color: #c586c0">return</span> (
    <span style="color: #808080">&lt;</span><span style="color: #4ec9b0">div</span> <span style="color: #92c5f8">style</span>=<span style="color: #808080">{{</span> <span style="color: #9cdcfe">whiteSpace</span>: <span style="color: #ce9178">'pre-line'</span> <span style="color: #808080">}}</span><span style="color: #808080">&gt;</span>
      {<span style="color: #9cdcfe">multilineText</span>}
    <span style="color: #808080">&lt;/</span><span style="color: #4ec9b0">div</span><span style="color: #808080">&gt;</span>
  );
}` }} />
              </pre>
            </Paper>

            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1, color: '#00897b' }}>
              テンプレートリテラルを使う方法
            </Typography>
            <Paper elevation={1} sx={{ 
              p: 3, 
              mb: 3, 
              backgroundColor: '#1e1e1e',
              borderRadius: 2,
              border: '1px solid #333'
            }}>
              <pre style={{ 
                margin: 0, 
                fontFamily: '"Fira Code", "SF Mono", Monaco, monospace',
                fontSize: '14px',
                lineHeight: '1.5',
                color: '#d4d4d4',
                overflow: 'auto'
              }}>
                <code dangerouslySetInnerHTML={{ __html: `<span style="color: #c586c0">function</span> <span style="color: #dcdcaa">TemplateText</span>() {
  <span style="color: #c586c0">return</span> (
    <span style="color: #808080">&lt;</span><span style="color: #4ec9b0">div</span> <span style="color: #92c5f8">style</span>=<span style="color: #808080">{{</span> <span style="color: #9cdcfe">whiteSpace</span>: <span style="color: #ce9178">'pre-line'</span> <span style="color: #808080">}}</span><span style="color: #808080">&gt;</span>
      {<span style="color: #ce9178">\`こんにちは！
      
これは複数行の
テキストです。

空行も表示されます。\`</span>}
    <span style="color: #808080">&lt;/</span><span style="color: #4ec9b0">div</span><span style="color: #808080">&gt;</span>
  );
}` }} />
              </pre>
            </Paper>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#00796b' }}>
              📖 Material-UIでのテキスト表示
            </Typography>

            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1, color: '#00897b' }}>
              Typography コンポーネント
            </Typography>
            <Paper elevation={1} sx={{ 
              p: 3, 
              mb: 3, 
              backgroundColor: '#1e1e1e',
              borderRadius: 2,
              border: '1px solid #333'
            }}>
              <pre style={{ 
                margin: 0, 
                fontFamily: '"Fira Code", "SF Mono", Monaco, monospace',
                fontSize: '14px',
                lineHeight: '1.5',
                color: '#d4d4d4',
                overflow: 'auto'
              }}>
                <code dangerouslySetInnerHTML={{ __html: `<span style="color: #c586c0">import</span> { <span style="color: #9cdcfe">Typography</span> } <span style="color: #c586c0">from</span> <span style="color: #ce9178">'@mui/material'</span>;

<span style="color: #c586c0">function</span> <span style="color: #dcdcaa">MuiText</span>() {
  <span style="color: #c586c0">return</span> (
    <span style="color: #808080">&lt;</span><span style="color: #4ec9b0">div</span><span style="color: #808080">&gt;</span>
      <span style="color: #808080">&lt;</span><span style="color: #4ec9b0">Typography</span> <span style="color: #92c5f8">variant</span>=<span style="color: #ce9178">"h6"</span><span style="color: #808080">&gt;</span>
        見出しテキスト
      <span style="color: #808080">&lt;/</span><span style="color: #4ec9b0">Typography</span><span style="color: #808080">&gt;</span>
      
      <span style="color: #808080">&lt;</span><span style="color: #4ec9b0">Typography</span> <span style="color: #92c5f8">variant</span>=<span style="color: #ce9178">"body1"</span><span style="color: #808080">&gt;</span>
        本文の1行目<span style="color: #808080">&lt;</span><span style="color: #4ec9b0">br</span> <span style="color: #808080">/&gt;</span>
        本文の2行目
      <span style="color: #808080">&lt;/</span><span style="color: #4ec9b0">Typography</span><span style="color: #808080">&gt;</span>
      
      <span style="color: #808080">&lt;</span><span style="color: #4ec9b0">Typography</span> <span style="color: #92c5f8">variant</span>=<span style="color: #ce9178">"body2"</span> <span style="color: #92c5f8">sx</span>=<span style="color: #808080">{{</span> <span style="color: #9cdcfe">whiteSpace</span>: <span style="color: #ce9178">'pre-line'</span> <span style="color: #808080">}}</span><span style="color: #808080">&gt;</span>
        {<span style="color: #ce9178">\`複数行の
        テキストを
        表示します\`</span>}
      <span style="color: #808080">&lt;/</span><span style="color: #4ec9b0">Typography</span><span style="color: #808080">&gt;</span>
    <span style="color: #808080">&lt;/</span><span style="color: #4ec9b0">div</span><span style="color: #808080">&gt;</span>
  );
}` }} />
              </pre>
            </Paper>

            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#00796b' }}>
              🔄 練習問題
            </Typography>
            <Box sx={{ mb: 3 }}>
              <Typography variant="body1" sx={{ mb: 2 }}>
                以下の要件を満たすコンポーネントを作成してみましょう：
              </Typography>
              <Box component="ol" sx={{ pl: 3 }}>
                <li>複数行のメッセージを表示する</li>
                <li>各行に番号を付ける</li>
                <li>空行も適切に処理する</li>
                <li>Material-UIのスタイルを適用する</li>
              </Box>
            </Box>

            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#00796b' }}>
              💡 ポイント
            </Typography>
            <Box component="ul" sx={{ mb: 3, pl: 3 }}>
              <li>用途に応じて適切な改行方法を選ぶ</li>
              <li>パフォーマンスを考慮して配列のkeyを設定</li>
              <li>アクセシビリティを意識した実装</li>
              <li>Material-UIコンポーネントを活用する</li>
            </Box>
          </Box>
        );

      default:
        return (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary">
              この学習ガイドの内容は準備中です...
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              ガイドID: {guideId}
            </Typography>
          </Box>
        );
    }
  };

  return (
    <Box>
      {/* ヘッダー部分 */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
            {title}
          </Typography>
          <IconButton size="small" onClick={onBack}>
            <ArrowBackIcon />
          </IconButton>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Chip
            label={getDifficultyText(difficulty)}
            size="small"
            sx={{
              backgroundColor: getDifficultyColor(difficulty),
              color: '#fff',
              fontWeight: 'bold',
            }}
          />
          <Chip
            icon={<ScheduleIcon />}
            label={estimatedTime}
            size="small"
            sx={{
              backgroundColor: '#e3f2fd',
              color: '#1976d2',
            }}
          />
        </Box>
      </Box>
      
      {/* ガイドコンテンツ */}
      {renderGuideContent()}
    </Box>
  );
};