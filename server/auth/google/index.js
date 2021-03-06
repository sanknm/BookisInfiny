'use strict';

import express from 'express';
import passport from 'passport';
import {setTokenCookie} from '../auth.service';

var router = express.Router();

router
     .get('/', passport.authenticate('google', {
          failureRedirect: '/',
          scope: [
               'profile',
               'email'
          ],
          session: false
     }))
     .get('/callback', passport.authenticate('google', {
          failureRedirect: '/',
          session: false
     }), setTokenCookie);

export default router;
