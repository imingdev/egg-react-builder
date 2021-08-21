const fs = require('fs');

module.exports = () => {
  return async (ctx, next) => {
    const ready = await ctx.helper.getBuilderReady();

    if (ready) {
      await next();
    } else {
      ctx.body = fs.readFileSync(require.resolve('../../lib/template/loading.html'), 'utf8');
    }
  };
};
