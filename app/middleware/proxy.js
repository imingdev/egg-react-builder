const proxy = require('koa-proxy');

module.exports = () => {
  return async (ctx, next) => {
    const proxyConfig = await ctx.helper.getBuilderProxyConfig();
    if (proxyConfig) {
      const middleware = proxy(proxyConfig);

      return await middleware(ctx, next);
    }

    await next();
  };
};
