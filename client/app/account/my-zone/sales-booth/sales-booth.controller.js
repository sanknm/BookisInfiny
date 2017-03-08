'use strict';
// @flow

export default class SalesBoothController {
     currentNavItem:string;
     navigationItems;
     getLength = arrays => _.reduce(arrays, (agg, array) => agg + array.length, 0);
     /*@ngInject*/
     constructor($state, userService) {
          this.navigationItems = [{
               title: 'Active',
               state: '.active',
               number: userService.getBooks('active')
          }, {
               title: 'Pending request',
               state: '.pending',
               number: userService.fetchRequests('incoming', 'pending', 'all'),
               unseen: userService.getRequests(['pending'], 'incoming', 'unseen')
          }, {
               title: 'Waiting to be delivered',
               state: '.waiting',
               number: userService.fetchRequests('incoming', 'waiting', 'all'),
               unseen: userService.getRequests(['waiting'], 'incoming', 'unseen')
          }];
          const title = _.capitalize($state.current.url.substring(1).replace(/-/g, ' '));
          this.currentNavItem = _.findIndex(this.navigationItems, {title});
          if (title === 'Sales booth') this.currentNavItem = 0;
     }
}
