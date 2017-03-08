'use strict';

const controller = require('./wishlist.controller');
import * as auth from '../../auth/auth.service';

const router = require('express-async-router').AsyncRouter();

router.get('/', controller.index);
router.post('/', auth.isAuthenticated(), controller.create);
router.put('/:id', auth.isAuthenticated(), controller.update);

module.exports = router;
