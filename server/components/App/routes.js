/**
 * Main application routes
 */

'use strict';

const App = require(__dirname+'/index');
const config = App.Config();
const Utils = App.Utils();

module.exports = function(app) {

  app.use('/test', require(config.root+'api/test'));
  // app.use('/test', require('/home/diegoprieto/workspace/serverless/server/api/test/'));
  // app.use('/test', Utils.status);

  app.use('/status', Utils.status);
  app.use('/', Utils.status);

  app.all('/*', (req, res) => {
    res.status(404).send({
      code : 404,
      msg : 'Not found'
    });
  });

  app.use((err, req, res, next) => {
    try {
      console.log('Error handler: '+ Utils.stringify(err));
      // App.log().error(false, { msg : 'Error handler: '+ Utils.stringify(err), code : 500 , alert : 'system' },true);
    } catch (e) {
      console.log('Error handler error', e);
      // App.log().error(false, { msg : 'Error handler error: ' + Utils.stringify(e), code : 500 , alert : 'system' }, true);
    }
    res.status(500).send({
      code : err.code || 500,
      msg : 'Internal error'
    });
  });
};
