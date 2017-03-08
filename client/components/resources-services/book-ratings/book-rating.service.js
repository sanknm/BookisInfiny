'use strict';

export function BookRatingService(BookRatingAPI, toast, Util, Auth) {
     'ngInject';
     let bookRatings = [];
     let myRate = [];
     let total = {rating: 0};
     let me = Auth.getCurrentUserSync;//eslint-disable-line no-sync
     return {
          getRatingsAggregation,
          getMyRating,
          createRating,
          updateRating,
          getTotal,
          getAverage,
          syncRates
     };

     function getRatingsAggregation(bookId) {
          return BookRatingAPI.getRatingsAggregation({bookId}).$promise
               .then(ratings => {
                    Util.bindArray(bookRatings, ratings);
                    total.rating = _.sum(bookRatings);
                    return bookRatings;
               })
               .catch(err => console.log(err));
     }

     function getMyRating(book) {
          if (!me()._id) {
               return Promise.resolve(myRate);
          }
          return BookRatingAPI.getMyRating({bookId: book._id, userId: me()._id}).$promise
               .then(rating => {
                    Util.bindArray(myRate, rating);
                    return myRate;
               })
               .catch(err => console.log(err));
     }

     function createRating(book, rate) {
          const newRating = new BookRatingAPI({
               user: me()._id,
               book: book._id,
               rate
          });
          return newRating.$save(_.extend(newRating, {bookId: book._id}))
               .then(r => {
                    myRate[0] = r;
                    toast.simple('Successfully rated book!');
                    return r.rate;
               })
               .catch(err => console.log(err));
     }

     function updateRating(rating, newRate) {
          const update = _.extend(rating[0], {rate: newRate});
          return BookRatingAPI.update(_.extend(update, {bookId: update.book})).$promise
               .then(r => {
                    myRate[0] = r;
                    toast.simple('Updated your rating!');
                    return r.rate;
               })
               .catch(err => console.log(err));
     }

     function syncRates(rate, oldRate, collection = bookRatings) {
          collection[5 - rate]++;
          if (oldRate) collection[5 - oldRate]--;
          total.rating = _.sum(bookRatings);
     }

     function getTotal() {
          return total;
     }

     function getAverage() {
          return _.reduce(bookRatings, (sum, el, i) => {
               sum += (5 - i) * el;
               return sum;
          }, 0) / total.rating;
     }
}
