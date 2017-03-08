/**
 * Main application file
 */

'use strict';

import express from 'express';
import http from 'http';
import cronJob from './components/cron';

// Populate databases with sample data
if (config.seedDB) {
     require('./config/seed');
}

cronJob.startCronJobs();

// Setup server
var app = express();
var server = http.createServer(app);
require('./config/express').default(app);
require('./routes').default(app);

// Start server
function startServer() {
     app.bookisApp = server.listen(config.port, config.ip, function() {
          console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
     });
}

setImmediate(startServer);

// Expose app
exports = module.exports = app;
