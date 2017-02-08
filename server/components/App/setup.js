'use strict';

let EventEmitter = process.EventEmitter;
let App = require(__dirname+'/index');
let config = App.Config();
// let DB = App.DB();
let util = require('util');

// Cargas iniciales y dependencias
let setup = function setup(){
  EventEmitter.call(this);
  let $this = this;

  if(config.envVars){ //Carga de variables de entorno
    for (var key in config.envVars) {
      process.env[key] = config.envVars[key];
    }
  }

  if(!config.test.start){
    let promises = []//[DB.mongoConnect()];
    Promise.all(promises).then(
      ()=>this.emit('success',null),
      (err)=>this.emit('error',err)
    );
  }else{
    setTimeout(function(){
      $this.emit('success',null);
    },100);
  }
};

util.inherits(setup,EventEmitter);

module.exports = new setup();
