'use strict';

import angular from 'angular';

import uiRouter from 'angular-ui-router';

import routing from './home.routes';
import allBooks from './all-books';
import kids from './kids';
import student from './student';
import top100 from './top100';
import community from './community';
import sellbooks from './sell-books';

export default angular.module('bookisApp.home', [uiRouter, allBooks, kids, student, top100, community, sellbooks])
     .config(routing)
     .run($rootScope => {
          'ngInject';

          $rootScope.$on('$stateChangeStart', (event, next, nextParams, current) => {
               if (next.name === 'logout' && current && current.name && !current.authenticate) {
                    next.referrer = current.name;
               }
          });
     })
     .name;
