// パフォーマンステストスクリプト
// Node.js環境で基本的なデータ生成パフォーマンスをテスト

import { performance } from 'perf_hooks';

// 基本的なタスク生成パフォーマンステスト
function testTaskGeneration() {
  console.log('🚀 タスク生成パフォーマンステスト開始');
  
  const scenarios = [
    { name: 'small', tasks: 100, members: 10 },
    { name: 'medium', tasks: 500, members: 20 },
    { name: 'large', tasks: 1000, members: 50 },
    { name: 'extreme', tasks: 5000, members: 100 }
  ];
  
  scenarios.forEach(scenario => {
    console.log(`\n--- ${scenario.name}シナリオ (${scenario.tasks}タスク, ${scenario.members}メンバー) ---`);
    
    const startTime = performance.now();
    
    // タスク生成シミュレーション
    const tasks = [];
    for (let i = 0; i < scenario.tasks; i++) {
      tasks.push({
        id: `task_${i}`,
        title: `タスク ${i + 1}`,
        startDate: new Date(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        progress: Math.floor(Math.random() * 100),
        priority: Math.floor(Math.random() * 100),
        status: 'inProgress',
        assignees: [`member_${i % scenario.members}`],
        tags: ['test'],
        color: '#2196F3'
      });
    }
    
    // メンバー生成シミュレーション
    const members = [];
    for (let i = 0; i < scenario.members; i++) {
      members.push({
        id: `member_${i}`,
        name: `メンバー ${i + 1}`,
        email: `member${i}@example.com`,
        role: 'member',
        color: '#2196F3',
        isActive: true
      });
    }
    
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    console.log(`✓ 生成時間: ${duration.toFixed(2)} ms`);
    console.log(`✓ タスク数: ${tasks.length.toLocaleString()}`);
    console.log(`✓ メンバー数: ${members.length.toLocaleString()}`);
    console.log(`✓ 1タスクあたり: ${(duration / tasks.length).toFixed(4)} ms`);
    
    // メモリ使用量推定
    const estimatedMemory = (tasks.length * 1000 + members.length * 500) / 1024;
    console.log(`✓ 推定メモリ使用量: ${estimatedMemory.toFixed(2)} KB`);
    
    // パフォーマンス評価
    if (duration < 100) {
      console.log('🟢 パフォーマンス: 優秀');
    } else if (duration < 500) {
      console.log('🟡 パフォーマンス: 良好');
    } else if (duration < 2000) {
      console.log('🟠 パフォーマンス: 要注意');
    } else {
      console.log('🔴 パフォーマンス: 改善必要');
    }
  });
  
  console.log('\n✅ パフォーマンステスト完了');
}

// DOM要素数シミュレーション
function testDOMElementCount() {
  console.log('\n📊 DOM要素数計算テスト');
  
  const scenarios = [
    { tasks: 100, estimatedElements: 300 },
    { tasks: 500, estimatedElements: 1500 },
    { tasks: 1000, estimatedElements: 3000 },
    { tasks: 5000, estimatedElements: 15000 }
  ];
  
  scenarios.forEach(scenario => {
    console.log(`${scenario.tasks}タスク → 推定DOM要素数: ${scenario.estimatedElements.toLocaleString()}`);
    
    if (scenario.estimatedElements < 1000) {
      console.log('  🟢 軽量');
    } else if (scenario.estimatedElements < 5000) {
      console.log('  🟡 中程度');
    } else if (scenario.estimatedElements < 10000) {
      console.log('  🟠 重い');
    } else {
      console.log('  🔴 非常に重い - 仮想化必須');
    }
  });
}

// レンダリングパフォーマンス推定
function testRenderingPerformance() {
  console.log('\n🎨 レンダリングパフォーマンス推定');
  
  const baseRenderTime = 16.67; // 60FPS = 16.67ms/frame
  
  const scenarios = [
    { tasks: 100, complexity: 'low' },
    { tasks: 500, complexity: 'medium' },
    { tasks: 1000, complexity: 'high' },
    { tasks: 5000, complexity: 'extreme' }
  ];
  
  scenarios.forEach(scenario => {
    let multiplier;
    switch (scenario.complexity) {
      case 'low': multiplier = 1; break;
      case 'medium': multiplier = 2.5; break;
      case 'high': multiplier = 5; break;
      case 'extreme': multiplier = 10; break;
    }
    
    const estimatedRenderTime = baseRenderTime * multiplier;
    const estimatedFPS = 1000 / estimatedRenderTime;
    
    console.log(`${scenario.tasks}タスク (${scenario.complexity}):`);
    console.log(`  推定レンダリング時間: ${estimatedRenderTime.toFixed(2)} ms`);
    console.log(`  推定FPS: ${estimatedFPS.toFixed(1)} fps`);
    
    if (estimatedFPS >= 50) {
      console.log('  🟢 スムーズ');
    } else if (estimatedFPS >= 30) {
      console.log('  🟡 良好');
    } else if (estimatedFPS >= 20) {
      console.log('  🟠 カクつき');
    } else {
      console.log('  🔴 重い');
    }
  });
}

// メイン実行
console.log('📈 TasQ Flow パフォーマンステスト\n');

testTaskGeneration();
testDOMElementCount();
testRenderingPerformance();

console.log('\n🎉 全テスト完了');