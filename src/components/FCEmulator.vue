<template>
  <div class="fc-emulator">
    <div class="emulator-container">
      <div id="emulator" ref="emulatorRef"></div>
      
      <div class="game-controls" v-if="isGameLoaded">
        <button class="control-btn" @click="togglePause">{{ isPaused ? '继续' : '暂停' }}</button>
        <button class="control-btn" @click="restart">重启</button>
        <button class="control-btn" @click="toggleSound">{{ isSoundEnabled ? '关闭声音' : '开启声音' }}</button>
        <button class="control-btn" @click="toggleFullscreen">全屏</button>
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
      isFullscreen: false
    }
  },
  mounted() {
    console.log('FCEmulator: 组件挂载，开始初始化模拟器');
    this.initEmulator();
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
        if (emulatorEl.requestFullscreen) {
          emulatorEl.requestFullscreen();
        } else if (emulatorEl.webkitRequestFullscreen) {
          emulatorEl.webkitRequestFullscreen();
        } else if (emulatorEl.msRequestFullscreen) {
          emulatorEl.msRequestFullscreen();
        }
        this.isFullscreen = true;
      } else {
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
  beforeUnmount() {
    console.log('FCEmulator: 组件卸载，释放资源');
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
  height: 480px;
  background-color: #000;
  position: relative;
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
</style> 