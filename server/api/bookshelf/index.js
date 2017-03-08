'use strict';

const controller = require('./bookshelf.controller');

const router = require('express-async-router').AsyncRouter();

router.get('/', controller.index);
router.post('/', controller.create);
router.put('/:id', controller.update);

module.exports = router;
