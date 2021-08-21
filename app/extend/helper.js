const Constant = require('../../lib/Constant');

module.exports = {
  // 获取webpack内存中的文件(manifest)
  getMemoryManifest() {
    const app = this.app;

    return new Promise(resolve => {
      app.messenger.on(Constant.EVENT_WEBPACK_MEMORY_MANIFEST, resolve);
      app.messenger.sendToAgent(Constant.EVENT_WEBPACK_MEMORY_MANIFEST, null);
    });
  },
  // 构建状态是否已经就绪
  getBuilderReady() {
    const app = this.app;

    return new Promise(resolve => {
      app.messenger.on(Constant.EVENT_WEBPACK_BUILD_READY, resolve);
      app.messenger.sendToAgent(Constant.EVENT_WEBPACK_BUILD_READY, null);
    });
  },
  // 获取构建代理的配置
  getBuilderProxyConfig() {
    const app = this.app;

    return new Promise(resolve => {
      app.messenger.on(Constant.EVENT_WEBPACK_BUILD_PROXY_CONFIG, resolve);
      app.messenger.sendToAgent(Constant.EVENT_WEBPACK_BUILD_PROXY_CONFIG, null);
    });
  },
};
