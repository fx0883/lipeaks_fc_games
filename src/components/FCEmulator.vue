<template>
  <div class="fc-emulator">
    <div class="emulator-container">
      <div id="emulator" ref="emulatorRef"></div>
      
      <div class="game-controls" v-if="isGameLoaded">
        <button class="control-btn" @click="togglePause">{{ isPaused ? '继续' : '暂停' }}</button>
        <button class="control-btn" @click="restart">重启</button>
        <button class="control-btn" @click="toggleSound">{{ isSoundEnabled ? '关闭声音' : '开启声音' }}</button>
        <button class="control-btn" @click="toggleFullscreen">全屏</button>
        <button class="control-btn" @click="showKeyHelp = true">按键说明</button>
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
    
    <div class="key-mapping">
      <h3>操作说明</h3>
      <div class="key-item">
        <span class="key">方向键</span>
        <span class="action">移动</span>
      </div>
      <div class="key-item">
        <span class="key">Z</span>
        <span class="action">A按钮</span>
      </div>
      <div class="key-item">
        <span class="key">X</span>
        <span class="action">B按钮</span>
      </div>
      <div class="key-item">
        <span class="key">Enter</span>
        <span class="action">开始</span>
      </div>
      <div class="key-item">
        <span class="key">Space</span>
        <span class="action">选择</span>
      </div>
    </div>
  </div>
</template>

<script>
import nesService from '../services/nesService';

// 使用index.html中已加载的jQuery，不再重复导入
// jQuery已在index.html中全局加载为window.jQuery

export default {
  name: 'FCEmulator',
  props: {
    romPath: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      isGameLoaded: false,
      isPaused: false,
      isSoundEnabled: false,
      isFullscreen: false,
      showKeyHelp: false
    }
  },
  mounted() {
    console.log('FCEmulator: 组件挂载，开始初始化模拟器');
    this.initEmulator();
    
    // 监听全屏状态变化
    document.addEventListener('fullscreenchange', this.handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', this.handleFullscreenChange);
    document.addEventListener('msfullscreenchange', this.handleFullscreenChange);
  },
  methods: {
    async initEmulator() {
      try {
        console.log('FCEmulator: 开始初始化模拟器');
        
        // 检查JSNES和jQuery是否已加载
        if (typeof window.JSNES === 'undefined') {
          console.error('FCEmulator: JSNES未加载，请确保在index.html中正确加载了JSNES脚本');
          console.log('FCEmulator: jQuery状态:', typeof window.jQuery !== 'undefined' ? '已加载' : '未加载');
          console.log('FCEmulator: JSNES状态:', typeof window.JSNES !== 'undefined' ? '已加载' : '未加载');
          if (typeof window.JSNES !== 'undefined') {
            console.log('FCEmulator: JSNES对象内容:', window.JSNES);
          }
          return;
        }
        
        // 检查jQuery JSNESUI插件是否可用
        if (typeof window.jQuery !== 'undefined' && typeof window.jQuery.fn.JSNESUI === 'undefined') {
          console.error('FCEmulator: jQuery JSNESUI插件未加载，请确保ui.js正确加载');
          return;
        }
        
        console.log('FCEmulator: JSNES已加载，继续初始化');
        
        // 设置游戏加载完成回调
        nesService.onGameLoaded(() => {
          console.log('FCEmulator: 游戏加载完成回调触发');
          this.isGameLoaded = true;
          this.$emit('game-loaded');
        });
        
        // 初始化NES模拟器
        console.log('FCEmulator: 调用nesService.init');
        await nesService.init('emulator');
        
        // 调整ROM路径 - 移除./public前缀，确保路径正确
        const romPath = this.romPath.startsWith('/') ? this.romPath : `/${this.romPath}`;
        
        // 加载ROM
        console.log(`FCEmulator: 开始加载ROM: ${romPath}`);
        await nesService.loadROM(romPath);
        console.log('FCEmulator: ROM加载完成');
      } catch (error) {
        console.error('FCEmulator: 初始化模拟器失败:', error);
      }
    },
    togglePause() {
      this.isPaused = nesService.togglePause();
    },
    restart() {
      nesService.restart();
      this.isPaused = false;
    },
    toggleSound() {
      this.isSoundEnabled = nesService.toggleSound();
    },
    toggleFullscreen() {
      const emulatorEl = this.$refs.emulatorRef;

      if (!document.fullscreenElement) {
        // 进入全屏
        if (emulatorEl.requestFullscreen) {
          emulatorEl.requestFullscreen();
        } else if (emulatorEl.webkitRequestFullscreen) {
          emulatorEl.webkitRequestFullscreen();
        } else if (emulatorEl.msRequestFullscreen) {
          emulatorEl.msRequestFullscreen();
        }
        this.isFullscreen = true;
        // 调用nesService切换canvas到全屏尺寸
        nesService.toggleCanvasFullscreen(true);
      } else {
        // 退出全屏
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
        this.isFullscreen = false;
        // 调用nesService切换canvas到普通尺寸
        nesService.toggleCanvasFullscreen(false);
      }
    },
    handleFullscreenChange() {
      // 当全屏状态改变时（比如按ESC键退出全屏）
      if (!document.fullscreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
        this.isFullscreen = false;
        nesService.toggleCanvasFullscreen(false);
      }
    }
  },
  beforeUnmount() {
    console.log('FCEmulator: 组件卸载，释放资源');
    // 移除全屏事件监听器
    document.removeEventListener('fullscreenchange', this.handleFullscreenChange);
    document.removeEventListener('webkitfullscreenchange', this.handleFullscreenChange);
    document.removeEventListener('msfullscreenchange', this.handleFullscreenChange);
    // 停止游戏并完全清除NES实例
    nesService.destroy();
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
}

#emulator {
  width: 100%;
  height: 500px;
  background-color: #000;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}



.game-controls {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.control-btn {
  padding: 8px 16px;
  background-color: var(--color-primary, #4a5568);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.control-btn:hover {
  background-color: var(--color-primary-dark, #2d3748);
}

.key-mapping {
  margin-top: 20px;
  border: 1px solid #eaeaea;
  border-radius: 4px;
  padding: 15px;
}

.key-mapping h3 {
  margin-top: 0;
  margin-bottom: 10px;
}

.key-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #eaeaea;
}

.key-item:last-child {
  border-bottom: none;
}

.key {
  font-weight: bold;
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
</style> 