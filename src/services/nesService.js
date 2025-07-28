/**
 * NES模拟器全局实例管理服务
 * 确保在整个应用中只有一个NES实例
 */
// 使用index.html中已加载的jQuery，不再重复导入
// jQuery已在index.html中全局加载为window.jQuery

class NESService {
  constructor() {
    this.nes = null;
    this.isInitialized = false;
    this.currentRomPath = null;
    this.callbacks = {
      onGameLoaded: null
    };
    console.log('NESService: 服务已创建');
    
    // 检查jQuery是否可用
    if (typeof window.jQuery === 'undefined') {
      console.error('NESService: jQuery未加载，请确保在index.html中正确加载了jQuery');
    }
  }

  /**
   * 初始化NES模拟器
   * @param {string} containerId 模拟器容器元素ID
   * @returns {Promise<void>}
   */
  init(containerId) {
    console.log(`NESService: 开始初始化模拟器，容器ID: ${containerId}`);
    return new Promise((resolve, reject) => {
      // 确保jQuery可用
      if (typeof window.jQuery === 'undefined') {
        console.error('NESService: jQuery未加载');
        return reject(new Error('jQuery is not loaded'));
      }
      console.log('NESService: jQuery已加载');

      // 确保JSNES已加载
      if (typeof window.JSNES === 'undefined') {
        console.error('NESService: JSNES未加载');
        return reject(new Error('JSNES is not loaded'));
      }
      
      console.log('NESService: JSNES已加载，对象内容:', window.JSNES);
      
      // 检查jQuery JSNESUI插件是否可用
      if (typeof window.jQuery.fn.JSNESUI === 'undefined') {
        console.error('NESService: jQuery JSNESUI插件未加载');
        return reject(new Error('jQuery JSNESUI plugin is not loaded'));
      }
      console.log('NESService: jQuery JSNESUI插件已加载');

      // 检查容器元素是否存在
      const container = window.jQuery(`#${containerId}`);
      if (container.length === 0) {
        console.error(`NESService: 找不到ID为${containerId}的容器元素`);
        return reject(new Error(`Container element with ID ${containerId} not found`));
      }
      console.log(`NESService: 找到容器元素:`, container[0]);

      // 如果已经存在NES实例，先销毁它
      if (this.nes) {
        console.log('NESService: 发现已存在的NES实例，先销毁它');
        this.destroy();
      }

      try {
        console.log('NESService: 创建JSNES实例');
        
        // 初始化NES模拟器 - 使用正确的方式创建JSNES实例
        this.nes = new window.JSNES({
          'ui': window.jQuery(`#${containerId}`).JSNESUI({
            "游戏": [
              ["魂斗罗", "/roms/Contra1(U)30.nes"]
            ]
          })
        });
        console.log('NESService: 已创建JSNES实例');
        
        if (!this.nes) {
          console.error('NESService: 创建JSNES实例失败');
          reject(new Error('Failed to create JSNES instance'));
          return;
        }
        
        console.log('NESService: JSNES实例创建成功', this.nes);
        this.isInitialized = true;
        resolve(this.nes);
      } catch (error) {
        console.error('NESService: 初始化模拟器时出错:', error);
        reject(error);
      }
    });
  }

  /**
   * 加载ROM
   * @param {string} romPath ROM文件路径
   * @returns {Promise<void>}
   */
  loadROM(romPath) {
    console.log(`NESService: 开始加载ROM: ${romPath}`);
    return new Promise((resolve, reject) => {
      if (!this.nes) {
        console.error('NESService: NES模拟器未初始化');
        return reject(new Error('NES模拟器未初始化'));
      }

      // 如果当前已经加载了相同的ROM，则不重复加载
      if (this.currentRomPath === romPath && this.nes.rom) {
        console.log('NESService: 已加载相同ROM，不重复加载');
        this.nes.start();
        if (this.callbacks.onGameLoaded) {
          this.callbacks.onGameLoaded();
        }
        resolve();
        return;
      }

      const xhr = new XMLHttpRequest();
      xhr.open('GET', romPath);
      xhr.overrideMimeType('text/plain; charset=x-user-defined');
      
      xhr.onload = () => {
        if (xhr.status === 200) {
          console.log(`NESService: ROM加载成功，状态码: ${xhr.status}`);
          try {
            console.log('NESService: 开始解析ROM数据');
            this.nes.loadRom(xhr.responseText);
            console.log('NESService: ROM解析成功，开始运行');
            this.nes.start();
            this.currentRomPath = romPath;
            
            if (this.callbacks.onGameLoaded) {
              console.log('NESService: 触发游戏加载完成回调');
              this.callbacks.onGameLoaded();
            }
            
            resolve();
          } catch (error) {
            console.error('NESService: ROM解析或启动失败:', error);
            reject(error);
          }
        } else {
          console.error(`NESService: ROM加载失败，状态码: ${xhr.status}`);
          reject(new Error(`Failed to load ROM: ${xhr.status}`));
        }
      };
      
      xhr.onerror = (error) => {
        console.error('NESService: ROM加载网络错误:', error);
        reject(new Error('Failed to load ROM'));
      };
      
      console.log(`NESService: 发送ROM请求: ${romPath}`);
      xhr.send();
    });
  }

  /**
   * 设置游戏加载完成回调
   * @param {Function} callback 回调函数
   */
  onGameLoaded(callback) {
    console.log('NESService: 设置游戏加载完成回调');
    this.callbacks.onGameLoaded = callback;
  }

  /**
   * 暂停/继续游戏
   * @returns {boolean} 是否暂停
   */
  togglePause() {
    if (!this.nes) {
      console.warn('NESService: 尝试暂停/继续游戏，但NES实例不存在');
      return false;
    }

    if (this.nes.isRunning) {
      console.log('NESService: 暂停游戏');
      this.nes.stop();
      return true; // 已暂停
    } else {
      console.log('NESService: 继续游戏');
      this.nes.start();
      return false; // 已继续
    }
  }

  /**
   * 重启游戏
   */
  restart() {
    if (!this.nes) {
      console.warn('NESService: 尝试重启游戏，但NES实例不存在');
      return;
    }
    
    console.log('NESService: 重启游戏');
    this.nes.reloadRom();
    this.nes.start();
  }

  /**
   * 切换声音
   * @returns {boolean} 是否开启声音
   */
  toggleSound() {
    if (!this.nes) {
      console.warn('NESService: 尝试切换声音，但NES实例不存在');
      return false;
    }

    console.log('NESService: 切换声音状态');
    this.nes.opts.emulateSound = !this.nes.opts.emulateSound;
    
    if (this.nes.opts.emulateSound) {
      console.log('NESService: 声音已开启');
      // 创建一个空的音频上下文以激活声音
      try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const source = audioContext.createBufferSource();
        source.connect(audioContext.destination);
        source.start(0);
      } catch (error) {
        console.error('NESService: 创建音频上下文失败:', error);
      }
    } else {
      console.log('NESService: 声音已关闭');
    }
    
    return this.nes.opts.emulateSound;
  }

  /**
   * 切换canvas全屏显示尺寸
   * @param {boolean} isFullscreen 是否为全屏模式
   */
  toggleCanvasFullscreen(isFullscreen) {
    console.log(`NESService: 切换canvas全屏模式: ${isFullscreen}`);
    
    const canvas = document.querySelector('.nes-screen');
    if (!canvas) {
      console.warn('NESService: 找不到.nes-screen canvas元素');
      return;
    }

    if (isFullscreen) {
      // 全屏模式：放大到更大尺寸，充满屏幕
      canvas.style.width = '100vw';
      canvas.style.height = '100vh';
      canvas.style.objectFit = 'contain';
      canvas.style.imageRendering = 'pixelated';
      console.log('NESService: 已切换到全屏显示模式');
    } else {
      // 普通模式：恢复到2倍大小
      canvas.style.width = '512px';
      canvas.style.height = '480px';
      canvas.style.objectFit = 'initial';
      canvas.style.imageRendering = 'pixelated';
      console.log('NESService: 已切换到普通显示模式');
    }
  }

  /**
   * 释放资源
   */
  destroy() {
    console.log('NESService: 释放资源');
    if (this.nes && this.nes.isRunning) {
      console.log('NESService: 停止游戏运行');
      this.nes.stop();
    }
    
    // 完全清除NES实例和相关状态
    console.log('NESService: 清除NES实例');
    this.nes = null;
    this.isInitialized = false;
    this.currentRomPath = null;
  }
}

// 创建单例
const nesService = new NESService();

export default nesService; 