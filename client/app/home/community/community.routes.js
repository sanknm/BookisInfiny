'use strict';

export default function routes($stateProvider) {
     'ngInject';

     $stateProvider
          .state('community.user', {
               url: '/user/:id/profile',
               template: require('./user/user.profile.html'),
               controller: 'UserProfileController',
               controllerAs: 'vm',
               resolve: { wl, books, user, bookshelf },
               authenticate: false
          });
}

const wl = (userService, $stateParams) => userService.getUserWishList({_id: $stateParams.id});
const books = (userService, $stateParams) => userService.getUserBooks({_id: $stateParams.id});
const bookshelf = (userService, $stateParams) => userService.getUserBookshelf({_id: $stateParams.id});
const user = (userService, $stateParams) => userService.getUser($stateParams.id);
