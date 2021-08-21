const path = require('path');
const yargs = require('yargs');
const rm = require('rimraf');
const consola = require('consola');
const utils = require('egg-utils');
const Builder = require('@rextjs/builder');

const config = utils.getConfig({
  baseDir: process.cwd(),
  framework: path.join(process.cwd(), 'node_modules/egg'),
  env: 'prod',
}).builder;

exports.run = () => yargs
  .command('build', 'build the project', () => {
    config.dev = false;

    return rm(path.join(config.dir.root, config.dir.build), async err => {
      if (err) throw err;
      const builder = new Builder(config);
      await builder.build();

      consola.success({
        message: '  Build complete.',
        badge: true,
      });
    });
  })
  .argv;

exports.run();
