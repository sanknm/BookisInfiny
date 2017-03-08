'use strict';

const controller = require('./export.controller');
import * as auth from '../../auth/auth.service';

const router = require('express-async-router').AsyncRouter();

router.get('/template', auth.isAuthenticated(), controller.template);

module.exports = router;
