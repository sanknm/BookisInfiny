'use strict';

import BookReview from '../review/book.review.model';

export function setNewState(next) {
     this._isNew = this.isNew;
     next();
}

export function incrementReviewReplyCount(doc) {
     if (doc._isNew) {
          BookReview.updateOne({_id: doc.reviewId}, {$inc: {noReplies: 1}}).exec();
     }
}
