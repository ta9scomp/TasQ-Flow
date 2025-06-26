// ブラウザ環境でのパフォーマンステスト実行ユーティリティ

export interface PerformanceTestResult {
  scenario: string;
  taskCount: number;
  renderTime: number;
  domElements: number;
  memoryUsage: number;
  fps: number;
  timestamp: Date;
}

export class PerformanceTestRunner {
  private results: PerformanceTestResult[] = [];
  private isRunning = false;

  /**
   * パフォーマンステストを実行
   */
  async runTest(
    scenario: string,
    taskCount: number,
    onProgress?: (progress: number) => void
  ): Promise<PerformanceTestResult> {
    console.log('🔧 PerformanceTestRunner.runTest called:', { scenario, taskCount });
    
    if (this.isRunning) {
      throw new Error('テストは既に実行中です');
    }

    this.isRunning = true;
    // let progress = 0; // 未使用のため一時的にコメントアウト

    try {
      onProgress?.(10);
      
      // 1. 初期状態の測定
      console.log('📊 Measuring initial memory...');
      const initialMemory = this.measureMemoryUsage();
      // const startTime = performance.now(); // 未使用のため一時的にコメントアウト
      console.log('Initial memory:', initialMemory, 'MB');
      
      onProgress?.(30);
      
      // 2. DOM要素数の測定
      console.log('🔍 Counting DOM elements...');
      await this.waitForNextFrame();
      const domElements = document.querySelectorAll('*').length;
      console.log('DOM elements:', domElements);
      
      onProgress?.(50);
      
      // 3. レンダリング時間の測定
      console.log('⏱️ Measuring render time...');
      const renderStartTime = performance.now();
      await this.forceRerender();
      const renderTime = performance.now() - renderStartTime;
      console.log('Render time:', renderTime, 'ms');
      
      onProgress?.(70);
      
      // 4. FPS測定
      console.log('🎯 Measuring FPS...');
      const fps = await this.measureFPS();
      console.log('FPS:', fps);
      
      onProgress?.(90);
      
      // 5. メモリ使用量の測定
      console.log('💾 Measuring final memory...');
      const finalMemory = this.measureMemoryUsage();
      const memoryUsage = finalMemory - initialMemory;
      console.log('Final memory:', finalMemory, 'MB, Difference:', memoryUsage, 'MB');
      
      onProgress?.(100);
      
      const result: PerformanceTestResult = {
        scenario,
        taskCount,
        renderTime,
        domElements,
        memoryUsage,
        fps,
        timestamp: new Date()
      };
      
      console.log('✅ Performance test result:', result);
      this.results.push(result);
      return result;
      
    } catch (error) {
      console.error('❌ Performance test error:', error);
      throw error;
    } finally {
      console.log('🏁 Cleaning up performance test');
      this.isRunning = false;
    }
  }

  /**
   * FPS測定
   */
  private async measureFPS(): Promise<number> {
    return new Promise((resolve) => {
      let frames = 0;
      const startTime = performance.now();
      const duration = 1000; // 1秒間測定
      
      const countFrames = () => {
        frames++;
        if (performance.now() - startTime < duration) {
          requestAnimationFrame(countFrames);
        } else {
          const fps = Math.round(frames * 1000 / (performance.now() - startTime));
          resolve(fps);
        }
      };
      
      requestAnimationFrame(countFrames);
    });
  }

  /**
   * メモリ使用量測定
   */
  private measureMemoryUsage(): number {
    try {
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        if (memory && typeof memory.usedJSHeapSize === 'number') {
          return memory.usedJSHeapSize / 1048576; // MB単位
        }
      }
      console.warn('Performance.memory API not available');
      return 0;
    } catch (error) {
      console.warn('Error measuring memory usage:', error);
      return 0;
    }
  }

  /**
   * 強制再レンダリング
   */
  private async forceRerender(): Promise<void> {
    // 強制的にレイアウトを再計算させる
    document.body.offsetHeight;
    await this.waitForNextFrame();
  }

  /**
   * 次のフレームまで待機
   */
  private waitForNextFrame(): Promise<void> {
    return new Promise(resolve => requestAnimationFrame(() => resolve()));
  }

  /**
   * スクロールパフォーマンステスト
   */
  async runScrollTest(containerSelector: string): Promise<{ fps: number; smoothness: number }> {
    const container = document.querySelector(containerSelector) as HTMLElement;
    if (!container) {
      throw new Error(`Container not found: ${containerSelector}`);
    }

    const startTime = performance.now();
    const duration = 2000; // 2秒間
    const startPos = container.scrollLeft;
    const maxScroll = container.scrollWidth - container.clientWidth;
    
    let frames = 0;
    let smoothnessScore = 0;
    let lastFrameTime = startTime;

    return new Promise((resolve) => {
      const animate = () => {
        const currentTime = performance.now();
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // スクロール位置を更新
        container.scrollLeft = startPos + (maxScroll - startPos) * progress;
        
        // FPS計算
        frames++;
        
        // スムーズネス計算（フレーム間の時間差）
        const frameDiff = currentTime - lastFrameTime;
        if (frameDiff > 0) {
          const expectedFrameTime = 16.67; // 60FPS
          const smoothnessRatio = Math.min(expectedFrameTime / frameDiff, 1);
          smoothnessScore += smoothnessRatio;
        }
        lastFrameTime = currentTime;
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          const fps = Math.round(frames * 1000 / duration);
          const smoothness = smoothnessScore / frames;
          resolve({ fps, smoothness });
        }
      };
      
      requestAnimationFrame(animate);
    });
  }

  /**
   * メトリクス評価
   */
  evaluatePerformance(result: PerformanceTestResult): {
    overall: 'excellent' | 'good' | 'fair' | 'poor';
    details: {
      renderTime: 'excellent' | 'good' | 'fair' | 'poor';
      domElements: 'excellent' | 'good' | 'fair' | 'poor';
      fps: 'excellent' | 'good' | 'fair' | 'poor';
      memory: 'excellent' | 'good' | 'fair' | 'poor';
    };
  } {
    const details = {
      renderTime: this.evaluateRenderTime(result.renderTime),
      domElements: this.evaluateDOMElements(result.domElements),
      fps: this.evaluateFPS(result.fps),
      memory: this.evaluateMemory(result.memoryUsage)
    };

    // 総合評価（最も悪い評価に引っ張られる）
    const scores = Object.values(details);
    let overall: 'excellent' | 'good' | 'fair' | 'poor' = 'excellent';
    
    if (scores.includes('poor')) overall = 'poor';
    else if (scores.includes('fair')) overall = 'fair';
    else if (scores.includes('good')) overall = 'good';

    return { overall, details };
  }

  private evaluateRenderTime(renderTime: number): 'excellent' | 'good' | 'fair' | 'poor' {
    if (renderTime < 16) return 'excellent';
    if (renderTime < 33) return 'good';
    if (renderTime < 100) return 'fair';
    return 'poor';
  }

  private evaluateDOMElements(elements: number): 'excellent' | 'good' | 'fair' | 'poor' {
    if (elements < 1000) return 'excellent';
    if (elements < 3000) return 'good';
    if (elements < 10000) return 'fair';
    return 'poor';
  }

  private evaluateFPS(fps: number): 'excellent' | 'good' | 'fair' | 'poor' {
    if (fps >= 55) return 'excellent';
    if (fps >= 40) return 'good';
    if (fps >= 25) return 'fair';
    return 'poor';
  }

  private evaluateMemory(memory: number): 'excellent' | 'good' | 'fair' | 'poor' {
    if (memory < 10) return 'excellent';
    if (memory < 50) return 'good';
    if (memory < 100) return 'fair';
    return 'poor';
  }

  /**
   * テスト結果をエクスポート
   */
  exportResults(): string {
    const data = {
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      results: this.results.map(result => ({
        ...result,
        evaluation: this.evaluatePerformance(result)
      }))
    };
    
    return JSON.stringify(data, null, 2);
  }

  /**
   * テスト結果をクリア
   */
  clearResults(): void {
    this.results = [];
  }

  /**
   * 全ての結果を取得
   */
  getAllResults(): PerformanceTestResult[] {
    return [...this.results];
  }
}

// シングルトンインスタンス
export const performanceTestRunner = new PerformanceTestRunner();