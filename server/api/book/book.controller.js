/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/books              ->  index
 * POST    /api/books              ->  create
 * GET     /api/books/:id          ->  show
 * PUT     /api/books/:id          ->  upsert
 * PATCH   /api/books/:id          ->  patch
 * DELETE  /api/books/:id          ->  destroy
 */

'use strict';

import jsonpatch from 'fast-json-patch';
import Book from './book.model';
import path from 'path';
import {xlsToJson} from '../../components/xls-json';
import fs from 'fs';

export async function index(req, res) {
     const books = await Book.find({status: 'active', active: true}).lean();
     res.status(200).json(books);
}

export async function show(req, res) {
     const book = await Book.findById(req.params.id).populate({path: 'user', select: '-salt -password'}).lean();
     if (!book) throw {code: 404, message: 'Book not found'};
     res.status(200).json(book);
}

export async function create(req, res) {
     req.body.user = req.user._id;
     const book = await new Book(req.body).save();
     res.status(200).json(book);
}

export async function bulk(req, res) {
     const excel = path.join(__dirname, '../../..', req.file.path);
     const books = _.map(await xlsToJson(excel), lowerFields);
     const newBooks = _.map(books, book => new Book(_.extend(book, {user: req.user._id, createdAt: new Date()})));
     _.map(newBooks, book => book.save());
     fs.unlink(excel);
     res.status(200).json(newBooks);
}

export async function upsert(req, res) {
     const book = await Book.findById(req.params.id);
     if (book.status === 'requested') throw {status: 403, message: 'Cannot update requested book.'};
     _.extend(book, req.body);
     await book.save();
     res.status(200).json(book);
}

//TODO: fix
export async function patch(req, res) {
     if (req.body._id) {
          Reflect.deleteProperty(req.body, '_id');
     }
     const book = await Book.findById(req.params.id);
     if (!book) throw {code: 404, message: 'Book not found'};
     await patchUpdates(book, req.body);
     res.status(200).json(book);
}

export async function destroy(req, res) {
     let book = await Book.findById(req.params.id);
     if (!book) throw {code: 404, message: 'Book not found'};
     book.active = false;
     await book.save();
     res.status(204).end();
}

async function patchUpdates(entity, body) {
     try {
          jsonpatch.apply(entity, body, true);//eslint-disable-line prefer-reflect
     } catch (err) {
          return Promise.reject(err);
     }
     return entity.save();
}

function lowerFields(book) {
     return _.forOwn(book, (v, k) => {
          book[k.toLowerCase()] = v;
          delete book[k];
     });
}