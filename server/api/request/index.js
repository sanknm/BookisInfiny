'use strict';

const controller = require('./request.controller');

const router = require('express-async-router').AsyncRouter();

router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.patch('/:id/approve', controller.approve);
router.patch('/:id/decline', controller.decline);
router.patch('/:id/deliver', controller.deliver);
router.patch('/:id/cancel', controller.cancel);
router.patch('/seen/:type', controller.markAsSeen);
router.delete('/:id', controller.destroy);

module.exports = router;
