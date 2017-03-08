'use strict';

import _ from 'lodash';

const isValidationError = err => _.eq(_.get(err, 'name'), 'ValidationError');

function handleError(req, res, forcedCode) {
     return err => {
          console.log('Err :', err);
          let code = forcedCode ? forcedCode : err.code || err.statusCode;
          if (!code || !_.isNumber(code)) {
               code = isValidationError(err) ? 422 : 500;
          }
          res.status(code).send(err.message || err);
     };
}

function postRoute(app) {
     app.use('/:url(api|auth)/*', (err, req, res, done) => {
          if (res.headersSent) {
               return done(err);
          }
          if (err) return handleError(req, res, undefined)(err);
          return done();
     });
}

export {
     postRoute
};
