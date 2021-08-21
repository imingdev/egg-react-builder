const Builder = require('./lib/Builder');

module.exports = agent => {
  agent.messenger.on('egg-ready', async () => {
    const builder = new Builder(agent);
    await builder.ready();
  });

  agent.ready(() => {
    agent.messenger.setMaxListeners(Infinity);
  });
};
