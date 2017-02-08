'use strict';

let MyApp = require(__dirname + '/server/components/App');
let config = MyApp.Config();

module.exports = MyApp.launch();