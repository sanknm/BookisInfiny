'use strict';

import mongoose from 'mongoose';
const {Schema, Schema: {ObjectId}} = mongoose;

const WishlistSchema = new Schema({
     user: {
          type: ObjectId,
          ref: 'User'
     },
     book: {
          type: ObjectId,
          ref: 'Book'
     },
     public: {
          type: Boolean,
          default: false
     },
     active: {
          type: Boolean,
          default: true
     }
}, {timestamps: true});

export default mongoose.model('Wishlist', WishlistSchema);
