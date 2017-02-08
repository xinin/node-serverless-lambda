'use strict';
module.exports = {
  env : 'dev', // dev, pre y pro
  log : {
    requests : __dirname+'/../../../log/req.log',
    errors : __dirname+'/../../../log/err.log',
    info : __dirname+'/../../../log/info.log',
    cloudWatch : '/openweb/api/', // worker lo tendrá distinto /worker
  },
  app : {
    port : 9000,
    ip : '0.0.0.0',
  },
  dev : { // sólo en dev, para activar estos servicios por defecto
    enableSQS : true, // activa poll de mensajes en sqs
    enableJenkins : true // crea máquinas de verdad
  },
  emails: [
    'webpublicas@beeva.com'
  ],
  envVars: {

  }
};
