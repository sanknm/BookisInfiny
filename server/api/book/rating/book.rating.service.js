'use strict';

import Book from '../book.model';
import BookRating from './book.rating.model';

export async function updateBookRate(doc) {
     const [[avgRate], book] = await Promise.all([
          BookRating.aggregate([
               {$match: {book: doc.book}},
               {$group: {_id: null, avg: {$avg: '$rate'}, votes: {$sum: 1}}}
          ]),
          Book.findById(doc.book)
     ]);
     if (!avgRate) return;
     const ownBook = doc.user.toString() === book.user.toString();
     book.rating.avg = avgRate.avg;
     book.rating.votes = avgRate.votes;
     if (ownBook) book.rating.ownerRate = doc.rate;
     book.save();
}
