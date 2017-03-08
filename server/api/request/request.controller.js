/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/requests              ->  index
 * POST    /api/requests              ->  create
 * GET     /api/requests/:id          ->  show
 * PUT     /api/requests/:id          ->  upsert
 * PATCH   /api/requests/:id          ->  patch
 * DELETE  /api/requests/:id          ->  destroy
 */

'use strict';

import Request from './request.model';

export async function index(req, res) {
     const requests = await Request.find().populate('book').populate({ path: 'user', select: 'firstName lastName' }).lean();
     res.status(200).json(requests);
}

export async function show(req, res) {
     const request = await Request.findById(req.params.id).lean();
     if (!request) throw {code: 404, message: 'Request not found'};
     res.status(200).json(request);
}

export async function create(req, res) {
     const request = await new Request(req.body).save();
     await Request.populate(request, [
          {path: 'book'},
          {path: 'user', select: 'firstName lastName imageUrl'},
          {path: 'owner', select: 'firstName lastName imageUrl'}
     ]);
     res.status(200).json(request);
}

export async function approve(req, res) {
     const request = await Request.findById(req.params.id);
     if (!request) throw {code: 404, message: 'Request not found'};
     request.status = 'waiting';
     request.seen = {};
     await request.save();
     res.status(200).json(request);
}
export async function decline(req, res) {
     const request = await Request.findById(req.params.id);
     if (!request) throw {code: 404, message: 'Request not found'};
     request.status = 'declined';
     await request.save();
     res.status(200).json(request);
}
export async function deliver(req, res) {
     const request = await Request.findById(req.params.id);
     if (!request) throw {code: 404, message: 'Request not found'};
     request.status = 'delivered';
     request.seen = {};
     await request.save();
     res.status(200).json(request);
}
export async function cancel(req, res) {
     const request = await Request.findById(req.params.id);
     if (!request) throw {code: 404, message: 'Request not found'};
     request.status = 'canceled';
     await request.save();
     res.status(200).json(request);
}

export async function destroy(req, res) {
     let request = await Request.findById(req.params.id);
     if (!request) throw {code: 404, message: 'Request not found'};
     request.active = false;
     await request.save();
     res.status(204).end();
}

export async function markAsSeen(req, res) {
     const field = `seen.${req.params.type}`;
     const update = {};
     update[field] = new Date();
     await Request.updateMany({_id: {$in: req.body.unseenArray}}, update);
     res.status(200).end();
}
