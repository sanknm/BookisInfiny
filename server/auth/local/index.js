'use strict';

import express from 'express';
import passport from 'passport';
import {signToken} from '../auth.service';

const router = express.Router();

router.post('/', (req, res, next) => {
     passport.authenticate('local', (err, user, info) => {
          let error = err || info;
          if (error) {
               return res.status(401).json(error);
          }
          if (!user) {
               return res.status(404).json({message: 'Something went wrong, please try again.'});
          }

          let token = signToken(user._id, user.role, 60 * 60 * 5);
          res.json({token, role: user.role});
     })(req, res, next);
});

export default router;
