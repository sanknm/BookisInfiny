'use strict';

import mongoose from 'mongoose';
const {Schema} = mongoose;

const GenreSchema = new Schema({
     name: String,
     description: String,
     imageUrl: String
});

export default mongoose.model('Genre', GenreSchema);
