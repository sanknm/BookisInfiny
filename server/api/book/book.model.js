'use strict';

import mongoose from 'mongoose';
const {Schema, Schema: {ObjectId}} = mongoose;

const BookSchema = new Schema({
     isbn: String,
     title: String,
     author: String,
     description: String,
     active: {type: Boolean, default: true},
     status: {type: String, default: 'active'},
     price: Number,
     imageUrl: {type: String, default: 'http://onlinebookclub.org/book-covers/id122892-125.jpg'},
     format: String,
     condition: {type: String, default: 'new'},
     comment: String,
     year: Number,
     rating: {
          avg: {type: Number, default: 0},
          votes: {type: Number, default: 0},
          ownerRate: {type: Number, default: 0}
     },
     user: {
          type: ObjectId,
          ref: 'User'
     }
}, {timestamps: true});

export default mongoose.model('Book', BookSchema);
