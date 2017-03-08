'use strict';

const controller = require('./book.review.controller');
import * as auth from '../../../auth/auth.service';

const router = require('express-async-router').AsyncRouter({mergeParams: true});

router.post('/', auth.isAuthenticated(), controller.create);
router.post('/:reviewId/likes', auth.isAuthenticated(), controller.toggleLike);
router.get('/', controller.index);

module.exports = router;
