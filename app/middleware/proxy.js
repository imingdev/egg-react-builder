const proxy = require('koa-server-http-proxy');

module.exports = () => {
  return async (ctx, next) => {
    const proxyConfig = await ctx.helper.getBuilderProxyConfig();
    if (proxyConfig) {
      const middleware = proxy(proxyConfig.publicPath, {
        target: proxyConfig.host,
        logLevel: 'silent',
      });

      return await middleware(ctx, next);
    }

    await next();
  };
};
