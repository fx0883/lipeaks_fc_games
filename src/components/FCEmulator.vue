<template>
  <div class="fc-emulator">
    <div class="emulator-container">
      <!-- 加载状态显示 -->
      <div v-if="isLoading" class="loading-overlay">
        <div class="loading-content">
          <div class="spinner"></div>
          <p>正在加载模拟器...</p>
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: loadingProgress + '%' }"></div>
          </div>
          <span class="progress-text">{{ loadingProgress.toFixed(0) }}%</span>
        </div>
      </div>
      
      <!-- 错误状态显示 -->
      <div v-if="error" class="error-display">
        <div class="error-content">
          <div class="error-icon">⚠️</div>
          <h3>加载失败</h3>
          <p>{{ error }}</p>
          <button @click="initEmulator" class="retry-btn">重试</button>
        </div>
      </div>
      
      <div :id="containerId"></div>
      
      <!-- 控制按钮 -->
      <div v-if="isGameLoaded" class="emulator-controls">
        <button @click="toggleKeyHelp" class="control-btn" title="按键说明">
          <span class="btn-icon">🎮</span>
          <span class="btn-text">按键说明</span>
        </button>
      </div>
      
      <!-- 按键说明弹窗 -->
      <div v-if="showKeyHelp" class="key-help-modal" @click.self="showKeyHelp = false">
        <div class="key-help-content">
          <div class="key-help-header">
            <h3>游戏按键说明</h3>
            <button class="close-btn" @click="showKeyHelp = false">×</button>
          </div>
          <div class="key-help-body">
            <div class="key-item">
              <span class="key-name">上</span>
              <span class="key-value">W</span>
            </div>
            <div class="key-item">
              <span class="key-name">下</span>
              <span class="key-value">S</span>
            </div>
            <div class="key-item">
              <span class="key-name">左</span>
              <span class="key-value">A</span>
            </div>
            <div class="key-item">
              <span class="key-name">右</span>
              <span class="key-value">D</span>
            </div>
            <div class="key-item">
              <span class="key-name">A</span>
              <span class="key-value">J</span>
            </div>
            <div class="key-item">
              <span class="key-name">AA</span>
              <span class="key-value">Z</span>
            </div>
            <div class="key-item">
              <span class="key-name">B</span>
              <span class="key-value">K</span>
            </div>
            <div class="key-item">
              <span class="key-name">BB</span>
              <span class="key-value">X</span>
            </div>
            <div class="key-item">
              <span class="key-name">Start</span>
              <span class="key-value">Enter</span>
            </div>
            <div class="key-item">
              <span class="key-name">Select</span>
              <span class="key-value">Ctrl</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FCEmulator',
  props: {
    romPath: {
      type: String,
      required: true
    },
    containerId: {
      type: String,
      default: 'emulator'
    },
    dataPath: {
      type: String,
      default: '/emulatorjs/data/'
    }
  },
  data() {
    return {
      isGameLoaded: false,
      isPaused: false,
      isSoundEnabled: true,
      isFullscreen: false,
      showKeyHelp: false,
      isLoading: false,
      error: '',
      loadingProgress: 0
    }
  },
  mounted() {
    console.log('FCEmulator: 组件挂载，开始初始化EmulatorJS');
    this.initEmulator();
    
    // 监听全屏状态变化
    document.addEventListener('fullscreenchange', this.handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', this.handleFullscreenChange);
    document.addEventListener('msfullscreenchange', this.handleFullscreenChange);
  },
  methods: {
    async initEmulator() {
      try {
        console.log('FCEmulator: 开始初始化EmulatorJS');
        this.isLoading = true;
        this.error = '';
        this.loadingProgress = 0;
        
        // 清除之前的模拟器实例
        this.clearEmulator();
        
        // 调整ROM路径
        const romPath = this.romPath.startsWith('/') ? this.romPath : `/${this.romPath}`;
        
        // 验证ROM文件是否可访问
        try {
          const response = await fetch(romPath, { method: 'HEAD' });
          if (!response.ok) {
            throw new Error(`ROM文件无法访问 (状态码: ${response.status})`);
          }
          console.log('FCEmulator: ROM文件验证成功');
        } catch (romError) {
          console.error('FCEmulator: ROM文件验证失败:', romError);
          throw new Error(`ROM文件验证失败: ${romError.message}`);
        }
        
        // 设置EmulatorJS配置
        window.EJS_player = `#${this.containerId}`
        window.EJS_gameUrl = romPath
        window.EJS_core = 'fceumm'
        window.EJS_pathtodata = this.dataPath
        window.EJS_gameName = 'NES Game'
        window.EJS_language = ''  // 默认英语
        window.EJS_startOnLoaded = true
        
        // EmulatorJS事件监听
        window.EJS_ready = () => {
          console.log('FCEmulator: EmulatorJS ready');
          this.isGameLoaded = true;
          this.$emit('game-loaded');
        }
        
        window.EJS_onGameStart = () => {
          console.log('FCEmulator: Game started');
          this.isLoading = false;
        }
        
        console.log('FCEmulator: EmulatorJS配置:', {
          player: window.EJS_player,
          gameUrl: window.EJS_gameUrl,
          core: window.EJS_core,
          pathtodata: window.EJS_pathtodata
        });
        
        // 加载EmulatorJS脚本
        await this.loadEmulatorJSScript();
        
      } catch (error) {
        console.error('FCEmulator: 初始化模拟器失败:', error);
        this.error = error.message;
        this.isLoading = false;
        this.$emit('error', error.message);
      }
    },
    
    async loadEmulatorJSScript() {
      return new Promise((resolve, reject) => {
        // 模拟加载进度
        const progressInterval = setInterval(() => {
          this.loadingProgress = Math.min(this.loadingProgress + Math.random() * 20, 90);
        }, 200);
        
        const script = document.createElement('script');
        script.src = '/emulatorjs/data/loader.js';
        
        script.onload = () => {
          console.log('FCEmulator: EmulatorJS script loaded');
          clearInterval(progressInterval);
          this.loadingProgress = 100;
          
          // 等待模拟器初始化
          this.waitForEmulatorInitialization()
            .then(() => {
              this.isLoading = false;
              resolve();
            })
            .catch(reject);
        };
        
        script.onerror = () => {
          clearInterval(progressInterval);
          reject(new Error('EmulatorJS脚本加载失败'));
        };
        
        document.head.appendChild(script);
      });
    },
    
    waitForEmulatorInitialization() {
      return new Promise((resolve, reject) => {
        let attempts = 0;
        const maxAttempts = 100; // 20秒超时
        
        const checkInterval = setInterval(() => {
          attempts++;
          
          if (window.EJS_emulator) {
            clearInterval(checkInterval);
            console.log('FCEmulator: EmulatorJS initialized');
            resolve();
          } else if (attempts >= maxAttempts) {
            clearInterval(checkInterval);
            reject(new Error('EmulatorJS初始化超时'));
          }
        }, 200);
      });
    },
    
    clearEmulator() {
      try {
        if (window.EJS_emulator) {
          // 清除全局变量
          delete window.EJS_emulator;
        }
        
        // 清理DOM
        const container = document.getElementById(this.containerId);
        if (container) {
          container.innerHTML = '';
        }
        
        // 移除之前的脚本
        const scripts = document.querySelectorAll('script[src*="emulatorjs"]');
        scripts.forEach(script => script.remove());
        
        this.isGameLoaded = false;
        console.log('FCEmulator: 模拟器已清除');
      } catch (err) {
        console.error('FCEmulator: 清除模拟器失败:', err);
      }
    },
    togglePause() {
      if (window.EJS_emulator) {
        if (this.isPaused) {
          if (typeof window.EJS_emulator.resume === 'function') {
            window.EJS_emulator.resume();
            this.isPaused = false;
          }
        } else {
          if (typeof window.EJS_emulator.pause === 'function') {
            window.EJS_emulator.pause();
            this.isPaused = true;
          }
        }
      }
    },
    restart() {
      if (window.EJS_emulator && typeof window.EJS_emulator.restart === 'function') {
        window.EJS_emulator.restart();
        this.isPaused = false;
      }
    },
    toggleSound() {
      if (window.EJS_emulator) {
        // EmulatorJS的音量控制
        this.isSoundEnabled = !this.isSoundEnabled;
        
        // 使用EmulatorJS API控制声音
        if (typeof window.EJS_emulator.setVolume === 'function') {
          window.EJS_emulator.setVolume(this.isSoundEnabled ? 1 : 0);
          console.log('Sound toggled:', this.isSoundEnabled ? 'on' : 'off');
        } else {
          console.warn('EmulatorJS setVolume方法不可用');
        }
      }
    },
    
    toggleKeyHelp() {
      this.showKeyHelp = !this.showKeyHelp;
    },
    
    toggleFullscreen() {
      if (window.EJS_emulator && typeof window.EJS_emulator.enterFullscreen === 'function') {
        if (!this.isFullscreen) {
          window.EJS_emulator.enterFullscreen();
          this.isFullscreen = true;
        } else {
          // EmulatorJS通常会自动处理退出全屏
          if (document.exitFullscreen) {
            document.exitFullscreen();
          } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
          } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
          }
          this.isFullscreen = false;
        }
      }
    },
    handleFullscreenChange() {
      // 当全屏状态改变时（比如按ESC键退出全屏）
      if (!document.fullscreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
        this.isFullscreen = false;
      }
    },
    
    // 提供给父组件使用的公共方法
    getControls() {
      return {
        pause: () => this.togglePause(),
        resume: () => {
          if (this.isPaused) {
            this.togglePause();
          }
        },
        restart: () => this.restart(),
        toggleSound: () => this.toggleSound(),
        toggleFullscreen: () => this.toggleFullscreen(),
        showKeyHelp: () => {
          this.showKeyHelp = true;
        },
        hideKeyHelp: () => {
          this.showKeyHelp = false;
        }
      };
    }
  },
  beforeUnmount() {
    console.log('FCEmulator: 组件卸载，释放资源');
    // 移除全屏事件监听器
    document.removeEventListener('fullscreenchange', this.handleFullscreenChange);
    document.removeEventListener('webkitfullscreenchange', this.handleFullscreenChange);
    document.removeEventListener('msfullscreenchange', this.handleFullscreenChange);
    // 清除EmulatorJS实例
    this.clearEmulator();
  }
}
</script>

<style scoped>
.fc-emulator {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
}

.emulator-container {
  margin-bottom: 20px;
  position: relative;
}

#emulator, [id^="emulator"] {
  width: 100%;
  height: 500px;
  background-color: #000;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 按键说明弹窗样式 */
.key-help-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.key-help-content {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  max-width: 400px;
  width: 90%;
  max-height: 80%;
  overflow-y: auto;
}

.key-help-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
}

.key-help-header h3 {
  margin: 0;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  color: #333;
  background-color: #f5f5f5;
  border-radius: 50%;
}

.key-help-body {
  display: grid;
  gap: 10px;
}

.key-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background-color: #f8f9fa;
  border-radius: 4px;
}

.key-name {
  font-weight: bold;
  color: #333;
}

.key-value {
  background-color: #007bff;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-family: monospace;
  font-weight: bold;
}

/* 加载状态样式 */
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  z-index: 5;
}

.loading-content {
  text-align: center;
  color: white;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #007bff;
  animation: spin 1s ease-in-out infinite;
  margin: 0 auto 16px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.progress-bar {
  width: 200px;
  height: 8px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  overflow: hidden;
  margin: 12px auto 8px;
}

.progress-fill {
  height: 100%;
  background: #007bff;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 14px;
  opacity: 0.8;
}

/* 错误状态样式 */
.error-display {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(220, 53, 69, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  border: 2px dashed #dc3545;
}

.error-content {
  text-align: center;
  color: #dc3545;
  padding: 24px;
}

.error-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.error-content h3 {
  margin: 0 0 12px 0;
  font-size: 20px;
}

.error-content p {
  margin: 0 0 16px 0;
  color: #721c24;
  font-size: 14px;
  max-width: 400px;
}

.retry-btn {
  padding: 10px 20px;
  background: #ffc107;
  color: #212529;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
}

.retry-btn:hover {
  background: #e0a800;
}

/* 控制按钮样式 */
.emulator-controls {
  display: flex;
  justify-content: center;
  padding: 10px 0;
  gap: 10px;
}

.control-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  background-color: #f8f9fa;
  color: #333;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.control-btn:hover {
  background-color: #e9ecef;
}

.btn-icon {
  font-size: 18px;
}

.btn-text {
  font-size: 14px;
}
</style> 