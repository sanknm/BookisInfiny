'use strict';

export default function routes($stateProvider) {
     'ngInject';

     $stateProvider
          .state('allbooks.details.seller', {
               url: '/:uid/seller',
               template: require('./seller/book.seller.html'),
               controller: 'BookSellerController',
               controllerAs: 'se',
               resolve: { wl, books, user, bookshelf },
               authenticate: false
          });
          // .state('allbooks.details.author', {
          //      url: '/:id/author',
          //      template: require('./popular/popular.html'),
          //      controller: 'PopularController',
          //      controllerAs: 'vm',
          //      authenticate: false
          // })
}

const wl = (userService, $stateParams) => userService.getUserWishList({_id: $stateParams.uid});
const books = (userService, $stateParams) => userService.getUserBooks({_id: $stateParams.uid});
const bookshelf = (userService, $stateParams) => userService.getUserBookshelf({_id: $stateParams.uid});
const user = (userService, $stateParams) => userService.getUser($stateParams.uid);
