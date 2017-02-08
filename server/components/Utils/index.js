'use strict';

const uniqidfn = require('uniqid');
const bcrypt = require('bcrypt-nodejs');
const App = require(__dirname+'/../App');
const bunyan = require('bunyan');
const _ = require('lodash');
const jsonlib = require('circular-json');

/**
 * Clase Utils con utilidades comunes
 */
class Utils {
  /**
   * Genera un uniqid
   * @return {*}
   */
  static uniqid(){
    return uniqidfn();
  }

  /**
   * Para objetos circulares
   * @param obj
   */
  static stringify(obj) {
    try {
      return (obj instanceof Error) ? obj.toString() : jsonlib.stringify(obj);
    } catch (e) {
      return '';
    }
  }

  static parseJSON(text) {
    try {
      return JSON.parse(text);
    } catch (e) {
      return {};
    }
  }

  /**
   * Genera un hash
   * @param ftp
   * @return {string}
   */
  static hash(ftp){
    return (ftp)?Math.random().toString(36).slice(-8):bcrypt.hashSync(Utils.uniqid(), bcrypt.genSaltSync(1));
  }

  /**
   * Valida un esquema de datos
   * @param values
   * @param schema
   */
  static valSchema(values,schema,update){
    for(let attr in values){
      let val = values[attr];
      if(attr === '_id') continue;
      if(!schema[attr]) throw "Attribute not valid "+attr+":"+JSON.stringify(values);
      switch(schema[attr]){
        case 'S':
          if(typeof val !== 'string') throw "Type Attr (string) error "+attr;
          break;
        case 'L':
          if(!Array.isArray(val)) throw "Type Attr (List: string comma sep.) error "+attr;
          break;
        case 'N':
          if(isNaN(val)) throw "Type Attr (Number) error "+attr;
          break;
        case 'M':
          if(typeof val !== 'object') throw "Type Attr (Object) error "+attr;
          break;
        case 'B':
          if(typeof val !== 'boolean') throw "Type Attr (boolean) error "+attr;
          break;
        case 'U':
          break;
      }
    }
    if(schema.requiredFields && !update){
      for(let i=0;i<schema.requiredFields.length;i++){
        if(!values[schema.requiredFields[i]]){
          throw schema.requiredFields[i]+" is required";
        }
      }
    }
  }

  /**
   * Str replace múltiple
   * @param str
   * @param mapObj
   * @return {*}
   */
  static replace(str,mapObj){
    for(let search in mapObj){
      str = str.split(search);
      str = str.join(mapObj[search]);
    }
    return str;
  }

  /**
   * Limpia de posibles variables un string ($)
   * @param str
   * @return {*}
   */
  static cleanJenkins(str){
    return Utils.replace(str,{'$' : parseInt(Math.random()*10)});
  }

  /**
   * Borra un parámetro get de una url
   * @param url
   * @param parameter
   * @return {*}
   */
  static removeURLParameter(url, parameter) {
    let urlparts= url.split('?');
    if (urlparts.length>=2) {
      let prefix= encodeURIComponent(parameter)+'=';
      let pars= urlparts[1].split(/[&;]/g);

      for (let i= pars.length; i-- > 0;) {
        if (pars[i].lastIndexOf(prefix, 0) !== -1) {
          pars.splice(i, 1);
        }
      }

      url= urlparts[0]+'?'+pars.join('&');
      return url;
    } else {
      return url;
    }
  }

  /**
   * Añade a la app el log de apache
   * @param webApp
   */
  static setMorgan(webApp){
    let morgan = require('morgan');
    let fs = require('fs');
    let config = App.Config();
    let accessLogStream = fs.createWriteStream(config.log.requests, {flags: 'a'});
    morgan.token('uid', function (req) {
      try {
        return req.utils.uid
      } catch (e) {
        return 'undefined';
      }
    });
    morgan.token('from', function (req) {
      try {
        return req.utils.from;
      } catch (e) {
        return 'undefined';
      }
    });
    morgan.token('ip', function (req) {
      try {
        return req.utils.ip;
      } catch (e) {
        return 'undefined';
      }
    });
    let type = ':uid - :ip - :from - [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"';
    webApp.use(morgan(type,{stream: accessLogStream}));
  }

  /**
   * Middleware que intercepta TODAS Las peticiones a la API inicialmente
   * @param app
   */
  static setMiddleware(app){
    app.use((req,res,next) => {
      if(req.path !== '/status') {
        let config = App.Config();
        let ip;
        try{
          ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        }catch(e){
          ip = "nodejs system";
        }
        req.utils = {
          from : req.headers.from,
          ip : ip,
          uid : req.headers.uid || Utils.uniqid()
        };

        if(!config.test.start) {
          if (!req.utils.from) {
            return res.status(401).send({ code : 401, msg : 'Unauthorized'});
          }
          App.Auth().isAuth(req, res, function () {
            return next();
          });
        }else{ // EN testtttt
          req.utils = config.test.utils;
          req.utils.uid = Utils.uniqid();
          return next();
        }
      }
      else{
        return next();
      }
    });
  }

  static objectEmpty(obj) {
    if (Array.isArray(obj)) {
      return obj.length === 0;
    } else if (typeof obj === 'object') {
      for (var i in obj) {
        return false;
      }
      return true;
    } else {
      return !obj;
    }
  }

  /**
   * Devuelve un timestamp casero con todas las cifras
   * @param milisec
   * @return {string}
   */
  static getDate(milisec){
    let date = new Date();
    let hour = date.getUTCHours();
    if(hour<10) hour = "0"+hour;
    let min = date.getUTCMinutes();
    if(min<10) min = "0"+min;
    let seg = date.getUTCSeconds();
    if(seg<10) seg = "0"+seg;
    let month = date.getUTCMonth()+1;
    if(month<10) month = "0"+month;
    let day = date.getUTCDate();
    if(day<10) day = "0"+day;
    let mil = date.getUTCMilliseconds();
    if(mil<10){
      mil = "00"+mil;
    }else if(mil<100){
      mil = "0"+mil;
    }
    let basic = ""+date.getFullYear()+month+day+hour+min+seg;
    return (milisec)?basic+mil:basic;
  }

  static slug(str) {
    str = str.replace(/^\s+|\s+$/g, ''); // trim
    str = str.toLowerCase();

    // remove accents, swap ñ for n, etc
    var from = "ãàáäâẽèéëêìíïîõòóöôùúüûñç·/_,:;";
    var to   = "aaaaaeeeeeiiiiooooouuuunc------";
    for (var i=0, l=from.length ; i<l ; i++) {
      str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
    }

    str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
      .replace(/\s+/g, '-') // collapse whitespace and replace by -
      .replace(/-+/g, '-'); // collapse dashes

    return str;
  }

  static cleanUrl(url,preserveWww) {
    url = url.replace('http://', '');
    url = url.replace('https://', '');
    if(!preserveWww && url.startsWith('www.')){
      url = url.substr(4,url.length-4);
    }
    url = url.split('?')[0];
    url = url.split('/')[0];
    return url.trim();
  }

  /**
   * Respuesta genérica de la API
   * @param req
   * @param res
   * @param code
   * @param data
   * @return {*}
   */
  static response(req,res,code,data){
    console.log({
      code,
      data
    });
    return res.status(code).json({
      code,
      data
    });
  }

  static isStatic(uri) {
    uri = uri.replace('https://','');
    uri = uri.replace('http://','');
    uri = uri.split('/');
    if(uri.length>0){
      uri.shift();
      uri = uri.join('/');
      uri = uri.split('?')[0];
      uri = uri.split('.');
      if(uri.length>1){
        uri = uri[uri.length-1];
        return (uri.split() !== 'html');
      } else {
        return false;
      }
    } else { // es un dominio a secas
      return false;
    }
  }


  /**
   * Error genérico de la api
   * @param req
   * @param res
   * @param err
   * @param code
   * @return {*}
   */
  static error(req,res,err,code){
    if(!err && (code === 401)){
      err = 'Auth error';
    }
    if(!_.isObject(err)){
      err = {
        msg : err,
        code : code || 500
      };
    }else{
      if(!err.msg){
        err = {
          code : err.statusCode || isNaN(err.code)?500:err.code,
          msg : err.toString() || JSON.stringify(err),
          alert : err.alert || false
        }
      }
    }
    App.log().error(req, err);
    if(err.code > 600){
      err.code = 500;
    }
    return res.status(err.code).send({
      code : err.statusCode || err.code,
      msg : err.msg
    });
  }

  static objetcSize( object ) {

    var objectList = [];
    var stack = [ object ];
    var bytes = 0;

    while ( stack.length ) {
      var value = stack.pop();

      if ( typeof value === 'boolean' ) {
        bytes += 4;
      }
      else if ( typeof value === 'string' ) {
        bytes += value.length * 2;
      }
      else if ( typeof value === 'number' ) {
        bytes += 8;
      }
      else if
      (
        typeof value === 'object'
        && objectList.indexOf( value ) === -1
      )
      {
        objectList.push( value );

        for( var i in value ) {
          stack.push( value[ i ] );
        }
      }
    }
    return bytes;
  }
  static base64encode(string) {
    return new Buffer( string ).toString( 'base64' );
  }

  static base64decode(string) {
    return new Buffer( string , 'base64' ).toString( 'utf8' );
  }

  static clone(origin) {
    return _.cloneDeep(origin);
  }

  static copy(origin) {
    return Utils.clone(origin);
  }

  static status(req, res) {
    Utils.response(req, res, 202);
  }

}

module.exports = Utils;
