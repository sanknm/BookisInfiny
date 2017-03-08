'use strict';

const envData = {
     development: {
          DOMAIN: 'http://localhost:3000'
     },
     staging: {
          DOMAIN: 'http://staging.mxgtax9asd.eu-west-1.elasticbeanstalk.com'
     },
     production: {
          DOMAIN: 'http://production.mxgtax9asd.eu-west-1.elasticbeanstalk.com'
     }
};

exports = module.exports = {
     // List of user roles
     userRoles: ['user', 'merchant', 'admin'],
     genders: ['male', 'female'],
     shippingDurations: ['1-3', '3-6', '6-9', '9+'],
     books: {
          formats: ['paperback', 'hardcover'],
          conditions: ['new', 'refurbished', 'like new', 'very good', 'good', 'acceptable'],
          statuses: ['active', 'sold']
     },
     requests: {
          statuses: ['pending', 'waiting', 'delivered', 'declined']
     },
     envData: envData[process.env.NODE_ENV],
     social: [
          {provider: 'facebook', key: '251261141963996'},
          {provider: 'twitter', key: 'Bookisno'}
     ]
};
