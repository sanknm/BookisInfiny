'use strict';

import mongoose from 'mongoose';
const {Schema, Schema: {ObjectId}} = mongoose;
import {} from './book.review.service';

const BookReviewSchema = new Schema({
     user: {
          type: ObjectId,
          ref: 'User'
     },
     book: {
          type: ObjectId,
          ref: 'Book'
     },
     review: {type: String, required: true},
     likes: [{ type : ObjectId, ref: 'User' }],
     noLikes: {type: Number, default: 0},
     dislikes: [String],
     noDislikes: {type: Number, default: 0},
     noReplies: {type: Number, default: 0}
}, {timestamps: true});

export default mongoose.model('BookReview', BookReviewSchema);
