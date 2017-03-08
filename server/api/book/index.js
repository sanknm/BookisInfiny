'use strict';

import * as auth from '../../auth/auth.service';
const controller = require('./book.controller');
import multer from 'multer';

const router = require('express-async-router').AsyncRouter();
const upload = multer({dest: 'uploads/'});

router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/', auth.isAuthenticated(), controller.create);
router.post('/bulk', auth.isAuthenticated(), upload.single('file'), controller.bulk);
router.put('/:id', controller.upsert);
router.patch('/:id', controller.patch);
router.delete('/:id', controller.destroy);

module.exports = router;
