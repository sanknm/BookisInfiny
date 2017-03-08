'use strict';

export function BookReviewService(BookReviewAPI, bookReplyService, toast, Util, Auth) {
     'ngInject';
     const me = Auth.getCurrentUserSync;//eslint-disable-line no-sync
     const data = {
          reviews: []
     };
     return {
          getBookReviews,
          createReview,
          replyToReview,
          getReviewReplies,
          toggleReviewLike
     };

     function createReview(review, book) {
          _.extend(review, {user: me()._id, book: book._id});
          const newReview = new BookReviewAPI(review);
          return newReview.$save()
               .then(rew => {
                    rew.user = _.pick(me(), ['firstName', 'lastName', 'imageUrl', '_id']);
                    rew.amFilter = true;
                    rew.collapsed = true;
                    data.reviews.unshift(rew);
                    toast.simple('You successfully reviewed book.');
                    return rew;
               })
               .catch(err => console.log(err));
     }

     function getBookReviews({_id: book}, userId) {
          const query = {book};
          if (userId) _.extend(query, {userId});
          return BookReviewAPI.query(query).$promise
               .then(reviews => {
                    Util.bindArray(data.reviews, reviews);
                    return data.reviews;
               })
               .catch(err => console.log(err));
     }

     function replyToReview(book, review, reply) {
          return bookReplyService.createReviewReply(book, review, reply)
               .then(rep => {
                    const index = _.findIndex(data.reviews, {_id: review._id});
                    if (!data.reviews[index].replies) data.reviews[index].replies = [];
                    rep.user = _.pick(me(), ['firstName', 'lastName', 'imageUrl']);
                    data.reviews[index].replies.push(rep);
                    data.reviews[index].noReplies = data.reviews[index].replies.length;
                    if (!data.reviews[index].fetched) data.reviews[index].fetched = 0;
                    data.reviews[index].fetched++;
                    return data.reviews[index].replies;
               })
               .catch(err => console.log(err));
     }

     function getReviewReplies(book, review, amount = 3) {
          const index = _.findIndex(data.reviews, {_id: review._id});
          return bookReplyService.getReviewReplies(book, review, amount, data.reviews[index].fetched || 0)
               .then(rep => {
                    if (!data.reviews[index].replies) data.reviews[index].replies = [];
                    data.reviews[index].replies.push(...rep);
                    data.reviews[index].fetched = data.reviews[index].replies.length;
                    return data.reviews[index].replies;
               })
               .catch(err => console.log(err));
     }

     function toggleReviewLike({_id: book}, {_id}) {
          if (!me()._id) return;
          const index = _.findIndex(data.reviews, {_id});
          const newArray = _.xor(data.reviews[index].likes, [me()._id]);
          Util.bindArray(data.reviews[index].likes, newArray);
          BookReviewAPI.toggleReviewLike({book, _id}).$promise
               .then(resp => {
                    Util.bindArray(data.reviews[index].likes, resp);
                    return resp;
               })
               .catch(err => {
                    console.log('Err :', err);
               });
     }
}
