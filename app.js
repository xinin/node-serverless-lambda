'use strict';

let MyApp = require(__dirname + '/server/components/App');
// let config = MyApp.Config();

if(process.env.NODE_ENV === 'lambda'){
    module.exports = MyApp.launch();
} else {
    module.exports = MyApp.launch_local();
}
