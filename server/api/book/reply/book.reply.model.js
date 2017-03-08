'use strict';

import mongoose from 'mongoose';
const {Schema, Schema: {ObjectId}} = mongoose;
import {incrementReviewReplyCount, setNewState} from './book.reply.service';

const BookReplySchema = new Schema({
     user: {
          type: ObjectId,
          ref: 'User'
     },
     book: {
          type: ObjectId,
          ref: 'Book'
     },
     reviewId: {
          type: ObjectId,
          ref: 'BookReview'
     },
     reply: {type: String, required: true},
     likes: [{ type : ObjectId, ref: 'User' }],
     noLikes: {type: Number, default: 0},
     dislikes: [String],
     noDislikes: {type: Number, default: 0}
}, {timestamps: true});

BookReplySchema.pre('save', setNewState);
BookReplySchema.post('save', incrementReviewReplyCount);

export default mongoose.model('BookReply', BookReplySchema);
