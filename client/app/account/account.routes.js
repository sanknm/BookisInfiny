'use strict';

export default function routes($stateProvider) {
     'ngInject';

     $stateProvider
          .state('logout', {
               url: '/logout?referrer',
               referrer: 'main',
               template: '',
               controller($state, Auth) {
                    'ngInject';

                    var referrer = $state.params.referrer || $state.current.referrer || 'main';
                    Auth.logout();
                    $state.go(referrer);
               }
          })
          .state('myzone', {
               url: '/my-zone',
               template: require('./my-zone/my-zone.html'),
               controller: 'MyZoneController',
               controllerAs: 'vm',
               resolve: {me, userBooks, userRequests, userWishList, userBookshelf},
               authenticate: true
          })
          .state('verify', {
               url: '/verify-email/:id',
               template: require('./verify/verify.html'),
               controller: 'VerifyController',
               controllerAs: 'vm',
               authenticate: false
          })
          .state('reset', {
               url: '/reset-password/:id',
               template: require('./reset/reset.html'),
               controller: 'ResetController',
               controllerAs: 'vm',
               authenticate: false
          });
}

const me = Auth => Auth.getCurrentUser(me => me);//eslint-disable-line no-shadow
const userBooks = (userService, me) => userService.getUserBooks(me);//eslint-disable-line no-shadow
const userRequests = (userService, me) => userService.getUserRequests(me);//eslint-disable-line no-shadow
const userWishList = (userService, me) => userService.getUserWishList(me);//eslint-disable-line no-shadow
const userBookshelf = (userService, me) => userService.getUserBookshelf(me);//eslint-disable-line no-shadow
