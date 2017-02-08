'use strict';

const App = require(__dirname+'/../../components/App');
const Utils = App.Utils();

exports.test = function (req, res) {
  Utils.response(req, res, 200,{msg:'LLEGAMOS!'});
};
