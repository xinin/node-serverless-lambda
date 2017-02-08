'use strict';

var path = require('path');
var _ = require('lodash');

var Config = {
  root: path.normalize(__dirname + '/../../'),
  secrets: {
    session: 'secret-session'
  },
  tokenTime : 30, // 1/2 hora
  test : {
    start : false,
    utils : {
      from : 'usertest@test.com',
      ip : 'usertestip'
    },
    data : {
      project : 'iibhxzeb',
      user : 'david.garcia@beeva.com'
    }
  },
  security : {
    start : 3 // restart hilos
  },
  sgPorts : { // rangos
    developer : [22, 3306],
    user : [80, 80]
  }
};

let custom;
try{
  custom = require('/var/properties/config.js');
}catch(e){
  custom = require(__dirname+'/custom.js');
}

// Export the config object based on the NODE_ENV
// ==============================================

//TODO coger de sistemas
module.exports = _.merge(
  Config,
  custom || {});
