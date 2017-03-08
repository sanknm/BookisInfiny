const mongoose = require('mongoose');
const bluebird = require('bluebird');

global._ = require('lodash');
global.config = require('./config/environment');

(async function handleGlobals() {
     mongoose.Promise = bluebird;
     await mongoose.connect(config.mongo.uri, config.mongo.options);
}()).catch(err => console.log('Error', err));
