'use strict';

import mongoose from 'mongoose';
const {Schema, Schema: {ObjectId}} = mongoose;
import Request from '../request.model';

const ReqMessageSchema = new Schema({
     user: {
          type: ObjectId,
          ref: 'User'
     },
     request: {
          type: ObjectId,
          ref: 'Request'
     },
     type: {type: String, default: 'message'},
     message: String
}, {timestamps: true});

ReqMessageSchema.post('save', doc => {
     Request.updateOne({_id: doc.request}, {message: doc.message, updatedAt: new Date()}).exec();//add latest message
});

export default mongoose.model('ReqMessage', ReqMessageSchema);
