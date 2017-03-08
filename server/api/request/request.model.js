'use strict';

import mongoose from 'mongoose';
const {Schema, Schema: {ObjectId}} = mongoose;
import * as requestService from './request.service';

const RequestSchema = new Schema({
     book: {
          type: ObjectId,
          ref: 'Book'
     },
     user: {
          type: ObjectId,
          ref: 'User'
     },
     owner: {
          type: ObjectId,
          ref: 'User'
     },
     seen: {
          user: Date,
          owner: Date
     },
     expire: Date,
     status: {type: String, default: 'pending'},
     delivery: String,
     message: String
}, {timestamps: true, minimize: false});

RequestSchema.pre('save', requestService.addExpirationDate);
RequestSchema.post('save', requestService.emit);

export default mongoose.model('Request', RequestSchema);
