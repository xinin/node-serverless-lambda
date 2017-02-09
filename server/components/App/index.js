'use strict';

let config;
let auth;
let users;
let utils;
let db;
let jenkins;
let aws;
let cf;
let testApplication;
let s3;
let waf;
let cloudfront;
let ec2;
let log;
let ses;
let cloudsearch;
let apiGateway;
let cloudwatch;
let cloudwatchlogs;
let nm;

/**
 * Clase que gestiona la APP y todas sus dependencias
 */
class App {
  static Config(){
    if(!config) config = require(__dirname+'/../Config');
    return config;
  }
  //
  // static SES(){
  //   let cnf = App.Config();
  //   if(!ses) ses = require( __dirname + (cnf.test.start ? '/../SES/SEStest' : '/../SES') );
  //   return new ses();
  // }
  //
  //
  // static Auth(){
  //   if(!auth) auth = require(__dirname+'/../Auth');
  //   return auth;
  // }
  //
  static Utils(){
    if(!utils) utils = require(__dirname+'/../Utils');
    return utils;
  }
  //
  // static AWS(){
  //   if(!aws){
  //     aws = require("aws-sdk");
  //     aws.config.update({region : "eu-west-1"});
  //   }
  //   return aws;
  // }
  //
  // static Waf(){
  //   if(!waf){
  //     let cnf = App.Config();
  //     waf = (cnf.test.start)?require(__dirname+'/../Waf/WafTest'):require(__dirname+'/../Waf');
  //   }
  //   return new waf();
  // }
  //
  // static CloudFront(){
  //   if(!cloudfront){
  //     let cnf = App.Config();
  //     cloudfront = (cnf.test.start)?require(__dirname+'/../CloudFront/cloudFrontTest'):require(__dirname+'/../CloudFront');
  //   }
  //   return new cloudfront();
  // }
  //
  // static CloudSearch(){
  //   if(!cloudsearch){
  //     let cnf = App.Config();
  //     cloudsearch = (cnf.test.start)?require(__dirname+'/../CloudSearch/cloudSearchTest'):require(__dirname+'/../CloudSearch');
  //   }
  //   return new cloudsearch();
  // }
  //
  // static EC2(){
  //   if(!ec2){
  //     ec2 = require(__dirname+'/../EC2');
  //   }
  //   return new ec2();
  // }
  //
  // static NotificationManager(){
  //   if(!nm){
  //     nm = require(__dirname+'/../NotificationManager');
  //   }
  //   return new nm();
  // }
  //
  // static BbvaMailer(service){
  //   let bm = require(__dirname+'/../BbvaMailer');
  //   return new bm(service);
  // }
  //
  // static CloudFormation(){
  //   if(!cf){
  //     let cnf = App.Config();
  //     cf = (cnf.test.start)?require(__dirname+'/../CloudFormation/cloudFormationTest'):require(__dirname+'/../CloudFormation');
  //   }
  //   return new cf();
  // }
  //
  // static S3(){
  //   if(!s3){
  //     let cnf = App.Config();
  //     s3 = (cnf.test.start)?require(__dirname+'/../S3/S3Test'):require(__dirname+'/../S3');
  //   }
  //   return new s3();
  // }
  //
  // static ApiGateway(){
  //   if(!apiGateway){
  //     let cnf = App.Config();
  //     apiGateway = (cnf.test.start)?require(__dirname+'/../ApiGateway/apiGatewayTest'):require(__dirname+'/../ApiGateway');
  //   }
  //   return new apiGateway();
  // }
  //
  // static CloudWatch(){
  //   if(!cloudwatch){
  //     let cnf = App.Config();
  //     cloudwatch = (cnf.test.start)?require(__dirname+'/../CloudWatch/cloudWatch'):require(__dirname+'/../CloudWatch');
  //   }
  //   return new cloudwatch();
  // }
  //
  // static CloudWatchLogs(){
  //   if(!cloudwatchlogs){
  //     let cnf = App.Config();
  //     cloudwatchlogs = (cnf.test.start)?require(__dirname+'/../CloudWatchLogs/cloudWatchTest'):require(__dirname+'/../CloudWatchLogs');
  //   }
  //   return new cloudwatchlogs();
  // }

  // static DB(){
  //   if(!db) db = require(__dirname+'/../DB');
  //   return new db();
  // }

  /**
   * Carga un modelo de mongo
   * @param model
   * @return {*|Object}
   */
  static getModel(model){
    let cnf = App.Config();
    let md = (cnf.test.start)?require(__dirname+'/../Models/testModels/'+model):require(__dirname+'/../Models/'+model);
    return new md();
  }

  // static Jenkins(){
  //   if(!jenkins){
  //     let cnf = App.Config();
  //     jenkins = require(__dirname+'/../Jenkins');
  //   }
  //   return new jenkins();
  // }
  //
  // /**
  //  * Devuelve una APP de prueba
  //  * @return {*}
  //  */
  // static testApp(){
  //   if(!testApplication){
  //     let cnf = App.Config();
  //     cnf.test.start = true;
  //     testApplication=require(__dirname+'/../../app');
  //   }
  //   return testApplication;
  // }
  //
  // static log(){
  //   if(!log) log = require(__dirname+'/../Log');
  //   return new log();
  // }

  /**
   * Lanza una aplicación
   * @return {*|Object}
   */
  static launch(){
    return require(__dirname+'/servers');
  }

  static launch_local(){
    return require(__dirname+'/servers_local');
  }
}

module.exports = App;
