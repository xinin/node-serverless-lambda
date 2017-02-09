'use strict';

let MyApp = require(__dirname + '/server/components/App');
let config = MyApp.Config();

if(config.env === 'dev'){
    module.exports = MyApp.launch_local();
} else {
    module.exports = MyApp.launch();
}
