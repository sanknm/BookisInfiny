'use strict';

export default function routes($stateProvider) {
     'ngInject';

     $stateProvider
          .state('allbooks', {
               url: '/all-books',
               template: require('./all-books/all-books.html'),
               controller: 'AllBooksController',
               controllerAs: 'vm',
               authenticate: false
          })
          .state('kids', {
               url: '/kids',
               template: require('./kids/kids.html'),
               controller: 'KidsController',
               controllerAs: 'vm',
               authenticate: false
          })
          .state('student', {
               url: '/student',
               template: require('./student/student.html'),
               controller: 'StudentController',
               controllerAs: 'vm',
               authenticate: false
          })
          .state('top100', {
               url: '/top100',
               template: require('./top100/top100.html'),
               controller: 'Top100Controller',
               controllerAs: 'vm',
               authenticate: false
          })
          .state('community', {
               url: '/community',
               template: require('./community/community.html'),
               controller: 'CommunityController',
               controllerAs: 'vm',
               authenticate: false
          })
          .state('sellbooks', {
               url: '/sell-books',
               template: require('./sell-books/sell-books.html'),
               controller: 'SellBooksController',
               controllerAs: 'vm',
               authenticate: false
          });
}
