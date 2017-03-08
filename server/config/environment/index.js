'use strict';
/*eslint no-process-env:0*/

import path from 'path';
import _ from 'lodash';

/*function requiredProcessEnv(name) {
 if(!process.env[name]) {
 throw new Error('You must set the ' + name + ' environment variable');
 }
 return process.env[name];
 }*/

// All configurations will extend these options
// ============================================
var all = {
     env: process.env.NODE_ENV,
     domain: process.env.DOMAIN,

     // Root path of server
     root: path.normalize(`${__dirname}/../../..`),

     // Browser-sync port
     browserSyncPort: process.env.BROWSER_SYNC_PORT || 3000,

     // Server port
     port: process.env.PORT || 9000,

     // Server IP
     ip: process.env.IP || '0.0.0.0',

     // Should we populate the DB with sample data?
     seedDB: false,

     // MongoDB connection options
     mongo: {
          options: {
               db: {
                    safe: true
               }
          }
     },

     sendgrid: {
          apiKey: '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'
     },

     s3: {
          accessKeyId: process.env.S3_KEY,
          secretAccessKey: process.env.S3_SECRET,
          bucket: `bookis.web.${process.env.NODE_ENV}`,
          region: 'eu-west-1',
          ACL: 'public-read'
     },

     facebook: {
          clientID: process.env.FACEBOOK_ID || 'id',
          clientSecret: process.env.FACEBOOK_SECRET || 'secret',
          callbackURL: `${process.env.DOMAIN || ''}/auth/facebook/callback`
     },

     twitter: {
          clientID: process.env.TWITTER_ID || 'id',
          clientSecret: process.env.TWITTER_SECRET || 'secret',
          callbackURL: `${process.env.DOMAIN || ''}/auth/twitter/callback`
     },

     google: {
          clientID: process.env.GOOGLE_ID || 'id',
          clientSecret: process.env.GOOGLE_SECRET || 'secret',
          callbackURL: `${process.env.DOMAIN || ''}/auth/google/callback`
     },

     events: {
          BOOK_REQUESTED: 'book-requested',
          BOOK_APPROVED: 'book-approved',
          BOOK_DELIVERED: 'book-delivered',
          BOOK_EXPIRED: 'book-expired',
          BOOK_DECLINED: 'book-declined',
          BOOK_CANCELED: 'book-canceled'
     }
};

// Export the config object based on the NODE_ENV
// ==============================================
module.exports = _.merge(
     all,
     require('./shared'),
     require(`./${process.env.NODE_ENV}.js`) || {});
