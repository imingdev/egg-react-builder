const path = require('path');
const express = require('express');
const portfinder = require('portfinder');
const RextBuilder = require('@rextjs/builder');
const Constant = require('./Constant');

const empty = () => {

};

module.exports = class Builder {
  constructor(agent) {
    // 动态修改配置
    agent.config.builder.dev = agent.config.env === 'local';
    if (agent.config.builder.build.publicPath === '/') {
      agent.config.builder.build.publicPath = `/${agent.name}/`;
    }

    const config = agent.config.builder;
    this.agent = agent;

    this.config = config;
    this.instance = new RextBuilder(config);

    this.emit = this.emit.bind(this);
    this.on = this.on.bind(this);
    this.once = this.once.bind(this);
    this.loadResources = this.loadResources.bind(this);
    this.ready = this.ready.bind(this);
  }

  emit(event, data = null) {
    return this.agent.messenger.sendToApp(event, data);
  }

  on(event, callback = empty) {
    this.agent.messenger.on(event, callback);
  }

  once(event, callback = empty) {
    this.agent.messenger.once(event, callback);
  }

  /**
   * load client resources
   * @return {{}}
   */
  loadResources() {
    const { config, instance } = this;
    const { dir, build } = config;
    const { mfs } = instance;

    let result = {};

    try {
      const fullPath = path.join(dir.root, dir.build, build.dir.manifest);

      if (mfs.existsSync(fullPath)) {
        const contents = mfs.readFileSync(fullPath, 'utf-8');

        result = JSON.parse(contents) || {};
      }
    } catch (err) {
      result = {};
    }

    return result;
  }

  async ready() {
    const { emit, on, instance, agent, config, loadResources } = this;
    let ready = false;
    // 获取一个可用端口
    const port = await portfinder.getPortPromise();
    const host = `http://127.0.0.1:${port}`;
    const publicPath = config.build.publicPath;

    // 获取webpack内存中的文件(manifest)
    on(Constant.EVENT_WEBPACK_MEMORY_MANIFEST, () => emit(Constant.EVENT_WEBPACK_MEMORY_MANIFEST, loadResources()));
    // 构建状态是否已经就绪
    on(Constant.EVENT_WEBPACK_BUILD_READY, () => emit(Constant.EVENT_WEBPACK_BUILD_READY, ready));
    // 获取构建代理的配置
    on(Constant.EVENT_WEBPACK_BUILD_PROXY_CONFIG, () => emit(Constant.EVENT_WEBPACK_BUILD_PROXY_CONFIG, { host, publicPath }));

    await instance.build();

    // 创建一个服务设置webpack中间件并启动
    express().use(instance.middleware).listen(port);

    agent.logger.info(`[agent] started on ${host}`);

    ready = true;
  }
};
