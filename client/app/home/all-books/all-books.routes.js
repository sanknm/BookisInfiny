'use strict';

export default function routes($stateProvider, $urlRouterProvider) {
     'ngInject';

     $urlRouterProvider.when('/all-books', '/all-books/popular');

     $stateProvider
          .state('allbooks.details', {
               url: '/:id/details',
               template: require('./book-details/book-details.html'),
               controller: 'BookDetailsController',
               controllerAs: 'vm',
               resolve: {book, ratings, myRate, alreadyRequested, alreadyWishListed},
               authenticate: false
          })
          .state('allbooks.popular', {
               url: '/popular',
               template: require('./popular/popular.html'),
               controller: 'PopularController',
               controllerAs: 'vm',
               authenticate: false
          });
}

const book = (bookService, $stateParams) => bookService.getBook($stateParams.id);
const ratings = (bookRatingService, $stateParams) => bookRatingService.getRatingsAggregation($stateParams.id);
const myRate = (bookRatingService, book) => bookRatingService.getMyRating(book);//eslint-disable-line no-shadow
const alreadyRequested = (userService, book) => userService.getUserSentRequests(undefined, book);//eslint-disable-line no-shadow
const alreadyWishListed = (userService, book) => userService.getUserWishList(undefined, book);//eslint-disable-line no-shadow
